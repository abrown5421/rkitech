import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updatePageField } from "../../../admin/features/page/pageEditorSlice";
import Container from "../../../shared/components/container/Container";
import Input from "../../../shared/components/input/Input";
import type { TextEditorProps } from "./textEditorTypes";
import Select from "../../../shared/components/select/Select";
import Button from "../../../shared/components/button/Button";
import Icon from "../../../shared/components/icon/Icon";
import ColorPicker from "../../components/colorPicker/ColorPicker";
import BorderPicker from "../../components/borderPicker/BorderPicker";
import Text from "../../../shared/components/text/Text";
import MarginPicker from "../../components/marginPicker/MarginPicker";
import PaddingPicker from "../../components/paddingPicker/PaddingPicker";

const TextEditor: React.FC<TextEditorProps> = ({ nodeUUID }) => {
  const dispatch = useAppDispatch();
  const prefix = useAppSelector((state) => state.pageEditor.activePrefix);
  const hoverMode = useAppSelector((state) => state.pageEditor.hover);
  const pageContent = useAppSelector(
    (state) => state.pageEditor.localPageObjectFromDb?.content
  );

  const [text, setText] = useState<string>("");
  const [textTwClassObj, setTextTwClassObj] = useState<Record<string, any>>({});

  const findNodeByUUID = (content: any, uuid: string): any | null => {
    if (!content) return null;
    if (Array.isArray(content)) {
      for (let child of content) {
        const found = findNodeByUUID(child, uuid);
        if (found) return found;
      }
      return null;
    }
    if (content.UUID === uuid) return content;
    if (content.children) return findNodeByUUID(content.children, uuid);
    return null;
  };

  const getActiveFieldKey = () => {
    if (hoverMode) return "hover";
    if (prefix === "md") return "md";
    if (prefix === "xl") return "xl";
    return "noPrefix";
  };

  const getCurrentValue = (styleObj: any) => {
    const fieldKey = getActiveFieldKey();
    return styleObj?.[fieldKey] || "";
  };

  const removePrefix = (className: string) => {
    if (!className) return "";
    
    if (className.startsWith("hover:")) {
      return className.substring(6);
    }
    
    if (prefix === "md" && className.startsWith("md:")) {
      return className.substring(3);
    }
    if (prefix === "xl" && className.startsWith("xl:")) {
      return className.substring(3);
    }
    return className;
  };

  const addPrefix = (className: string) => {
    if (!className) return "";
    
    if (hoverMode) return `hover:${className}`;
    
    if (prefix === "md") return `md:${className}`;
    if (prefix === "xl") return `xl:${className}`;
    return className;
  };

  useEffect(() => {
    if (!pageContent) return;

    const node = findNodeByUUID(pageContent, nodeUUID);

    if (node) {
      setText(node.props?.text || "");

      const twClassObj = (node.props?.TwClassName || []).reduce(
        (acc: Record<string, any>, obj: any) => {
          if (obj.propName) {
            acc[obj.propName] = {
              propName: obj.propName,
              noPrefix: obj.noPrefix || "",
              hover: obj.hover || "",
              md: obj.md || "",
              xl: obj.xl || "",
            };
          }
          return acc;
        },
        {}
      );

      const defaultProps = [
        "fontSize",
        "fontFace",
        "fontWeight",
        "fontItalic",
        "fontUnderline",
        "fontColor",
        "bgColor",
        "borderStyle",
        "margin",
        "padding",
      ];
      
      defaultProps.forEach((key) => {
        if (!twClassObj[key]) {
          twClassObj[key] = {
            propName: key,
            noPrefix: "",
            hover: "",
            md: "",
            xl: "",
          };
        }
      });

      setTextTwClassObj(twClassObj);
    }
  }, [pageContent, nodeUUID, prefix, hoverMode]);

  const handleChange = (val: string) => {
    setText(val);
    if (!pageContent) return;

    dispatch(
      updatePageField({
        field: "content",
        value: updateNodeText(pageContent, nodeUUID, val),
      })
    );
  };

  const updateNodeText = (node: any, uuid: string, newText: string): any => {
    if (!node) return node;
    if (Array.isArray(node))
      return node.map((n) => updateNodeText(n, uuid, newText));
    if (node.UUID === uuid)
      return {
        ...node,
        props: {
          ...(node.props || {}),
          text: newText,
          TwClassName: node.props?.TwClassName || [],
        },
      };
    if (node.children)
      return {
        ...node,
        children: updateNodeText(node.children, uuid, newText),
      };
    return node;
  };

  const toggleStyle = (propName: string, twClass: string) => {
    const fieldKey = getActiveFieldKey();
    const currentValue = removePrefix(getCurrentValue(textTwClassObj[propName]));

    let newValue = "";

    switch (propName) {
      case "fontWeight":
        newValue = currentValue === "font-bold" ? "font-normal" : "font-bold";
        break;
      case "fontItalic":
        newValue = currentValue === "italic" ? "not-italic" : "italic";
        break;
      case "fontUnderline":
        newValue = currentValue === "underline" ? "no-underline" : "underline";
        break;
      default:
        newValue = currentValue === twClass ? "" : twClass;
    }

    // In hover mode, only update the hover field
    if (hoverMode) {
      const prefixedValue = newValue ? `hover:${newValue}` : "";
      
      setTextTwClassObj((prev) => ({
        ...prev,
        [propName]: {
          ...prev[propName],
          hover: prefixedValue,
        },
      }));

      updateNodeStyle(propName, prefixedValue);
      return;
    }

    // Normal breakpoint cascade behavior
    const breakpointHierarchy = ["noPrefix", "md", "xl"];
    const currentIndex = breakpointHierarchy.indexOf(fieldKey);
    const targetBreakpoints = breakpointHierarchy.slice(currentIndex);

    setTextTwClassObj((prev) => {
      const updated = { ...prev };
      targetBreakpoints.forEach(breakpoint => {
        const prefixedValue = breakpoint === "noPrefix" ? newValue : `${breakpoint}:${newValue}`;
        updated[propName] = {
          ...updated[propName],
          [breakpoint]: prefixedValue,
        };
      });
      return updated;
    });

    updateNodeStyleCascade(propName, newValue, targetBreakpoints);
  };

  const updateNodeStyleCascade = (propName: string, newValue: string, targetBreakpoints: string[]) => {
    if (!pageContent) return;

    let updatedContent = pageContent;

    targetBreakpoints.forEach(breakpoint => {
      const prefixedValue = breakpoint === "noPrefix" ? newValue : `${breakpoint}:${newValue}`;
      updatedContent = updateNodeTwClass(
        updatedContent,
        nodeUUID,
        propName,
        breakpoint,
        prefixedValue
      );
    });

    dispatch(
      updatePageField({
        field: "content",
        value: updatedContent,
      })
    );
  };

  const updateNodeStyle = (propName: string, newValue: string) => {
    const fieldKey = getActiveFieldKey();
    
    setTextTwClassObj((prev) => ({
      ...prev,
      [propName]: { 
        ...prev[propName], 
        [fieldKey]: newValue 
      },
    }));

    if (!pageContent) return;

    const updatedContent = updateNodeTwClass(
      pageContent,
      nodeUUID,
      propName,
      fieldKey,
      newValue
    );

    dispatch(
      updatePageField({
        field: "content",
        value: updatedContent,
      })
    );
  };

  const updateNodeTwClass = (
    node: any,
    uuid: string,
    propName: string,
    fieldKey: string,
    value: string
  ): any => {
    if (!node) return node;
    if (Array.isArray(node))
      return node.map((n) => updateNodeTwClass(n, uuid, propName, fieldKey, value));
    if (node.UUID === uuid) {
      const existing = node.props?.TwClassName || [];
      const updatedClasses = existing.map((cls: any) =>
        cls.propName === propName 
          ? { ...cls, [fieldKey]: value } 
          : cls
      );

      if (!updatedClasses.find((cls: any) => cls.propName === propName)) {
        const newClass = {
          propName,
          noPrefix: "",
          hover: "",
          md: "",
          xl: "",
          [fieldKey]: value,
        };
        updatedClasses.push(newClass);
      }

      return {
        ...node,
        props: {
          ...(node.props || {}),
          TwClassName: updatedClasses,
        },
      };
    }
    if (node.children)
      return {
        ...node,
        children: updateNodeTwClass(node.children, uuid, propName, fieldKey, value),
      };
    return node;
  };
  
  if (!pageContent) return null;

  return (
    <Container TwClassName="flex-col mb-4">
      {/* Mode Indicator */}
      {hoverMode && (
        <Container TwClassName="mb-3 p-2 bg-amber-50 border border-amber-200 rounded">
          <Text text="✨ Hover Mode Active - Editing hover states" TwClassName="text-amber-700 text-sm" />
        </Container>
      )}
      
      <Container TwClassName="flex-row mb-3 gap-3">
        <Select
          TwClassName="flex-2"
          label="Size"
          value={removePrefix(getCurrentValue(textTwClassObj.fontSize))}
          onChange={(e) => updateNodeStyle("fontSize", addPrefix(e.target.value))}
        >
          <option value="">Default</option>
          <option value="text-xs">XS</option>
          <option value="text-sm">SM</option>
          <option value="text-md">MD</option>
          <option value="text-lg">LG</option>
          <option value="text-xl">XL</option>
          <option value="text-2xl">2XL</option>
          <option value="text-3xl">3XL</option>
          <option value="text-4xl">4XL</option>
          <option value="text-5xl">5XL</option>
          <option value="text-6xl">6XL</option>
          <option value="text-7xl">7XL</option>
          <option value="text-8xl">8XL</option>
          <option value="text-9xl">9XL</option>
        </Select>
        <Select
          TwClassName="flex-3"
          label="Font Family"
          value={removePrefix(getCurrentValue(textTwClassObj.fontFace))}
          onChange={(e) => updateNodeStyle("fontFace", addPrefix(e.target.value))}
        >
          <option value="">Default</option>
          <option value="font-primary">Primary</option>
          <option value="font-secondary">Secondary</option>
          <option value="font-sans">Sans</option>
          <option value="font-serif">Serif</option>
          <option value="font-mono">Mono</option>
        </Select>
        <Button
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${
            removePrefix(getCurrentValue(textTwClassObj.fontWeight)) === "font-bold"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => toggleStyle("fontWeight", "font-bold")}
        >
          <Icon name="Bold" color="text-gray-900" />
        </Button>

        <Button
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${
            removePrefix(getCurrentValue(textTwClassObj.fontItalic)) === "italic"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => toggleStyle("fontItalic", "italic")}
        >
          <Icon name="Italic" color="text-gray-900" />
        </Button>

        <Button
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${
            removePrefix(getCurrentValue(textTwClassObj.fontUnderline)) === "underline"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => toggleStyle("fontUnderline", "underline")}
        >
          <Icon name="Underline" color="text-gray-900" />
        </Button>
      </Container>
      <Input
        label="Text"
        value={text}
        rows={4}
        multiline
        onChange={(e) => handleChange(e.target.value)}
        TwClassName="mb-4"
      />
      <Text TwClassName="block text-sm font-medium mb-2" text="Color Settings" />
      <ColorPicker
        label="Text Color"
        prefix="text-"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(textTwClassObj.fontColor))}
        onChange={(val) => updateNodeStyle("fontColor", addPrefix(val))}
      />
      <ColorPicker
        label="Text Background"
        prefix="bg-"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(textTwClassObj.bgColor))}
        onChange={(val) => updateNodeStyle("bgColor", addPrefix(val))}
      />
      <BorderPicker 
        label="Border Settings"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(textTwClassObj.borderStyle))}
        onChange={(val) => updateNodeStyle("borderStyle", addPrefix(val))}
      />
      <MarginPicker
        label="Margin"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(textTwClassObj.margin))}
        onChange={(val) => updateNodeStyle("margin", addPrefix(val))}
      />
      <PaddingPicker
        label="Padding"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(textTwClassObj.padding))}
        onChange={(val) => updateNodeStyle("padding", addPrefix(val))}
      />
      <MarginPicker
        label="Margin"
        TwClassName="mb-4"
        value={textTwClassObj.margin?.noPrefix || ""}
        onChange={(val) => updateNodeStyle("margin", val)}
      />
      <PaddingPicker
        label="Padding"
        TwClassName="mb-4"
        value={textTwClassObj.margin?.noPrefix || ""}
        onChange={(val) => updateNodeStyle("margin", val)}
      />
    </Container>
  );
};

export default TextEditor;