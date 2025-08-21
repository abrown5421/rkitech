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

const TextEditor: React.FC<TextEditorProps> = ({ nodeUUID }) => {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (!pageContent) return;

    const node = findNodeByUUID(pageContent, nodeUUID);

    if (node) {
      setText(node.props?.text || "");

      const twClassObj = (node.props?.TwClassName || []).reduce(
        (acc: Record<string, any>, obj: any) => {
          if (obj.propName) acc[obj.propName] = obj;
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
        "borderStyle", // Added border support
      ];
      defaultProps.forEach((key) => {
        if (!twClassObj[key]) twClassObj[key] = { noPrefix: "" };
      });

      setTextTwClassObj(twClassObj);
    }
  }, [pageContent, nodeUUID]);

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
    const newValue =
      textTwClassObj[propName]?.noPrefix === twClass ? "" : twClass;
    setTextTwClassObj((prev) => {
      const currentValue = prev[propName]?.noPrefix || "";
      return {
        ...prev,
        [propName]: {
          ...prev[propName],
          noPrefix: currentValue === twClass ? "" : twClass,
        },
      };
    });
    updateNodeStyle(propName, newValue);
  };

  const updateNodeStyle = (propName: string, newValue: string) => {
    setTextTwClassObj((prev) => ({
      ...prev,
      [propName]: { ...prev[propName], noPrefix: newValue },
    }));

    if (!pageContent) return;

    const updatedContent = updateNodeTwClass(
      pageContent,
      nodeUUID,
      propName,
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
    value: string
  ): any => {
    if (!node) return node;
    if (Array.isArray(node))
      return node.map((n) => updateNodeTwClass(n, uuid, propName, value));
    if (node.UUID === uuid) {
      const existing = node.props?.TwClassName || [];
      const updatedClasses = existing.map((cls: any) =>
        cls.propName === propName ? { ...cls, noPrefix: value } : cls
      );

      if (!updatedClasses.find((cls: any) => cls.propName === propName)) {
        updatedClasses.push({ propName, noPrefix: value });
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
        children: updateNodeTwClass(node.children, uuid, propName, value),
      };
    return node;
  };
  
  if (!pageContent) return null;

  return (
    <Container TwClassName="flex-col mb-4">
      <Container TwClassName="flex-row mb-3 gap-3">
        <Select
          TwClassName="flex-2"
          label="Font Size"
          value={textTwClassObj.fontSize?.noPrefix || ""}
          onChange={(e) => updateNodeStyle("fontSize", e.target.value)}
        >
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
          value={textTwClassObj.fontFace?.noPrefix || ""}
          onChange={(e) => updateNodeStyle("fontFace", e.target.value)}
        >
          <option value="font-primary">Primary</option>
          <option value="font-secondary">Secondary</option>
          <option value="font-sans">Sans</option>
          <option value="font-serif">Serif</option>
          <option value="font-mono">Mono</option>
        </Select>
        <Button
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${
            textTwClassObj.fontWeight?.noPrefix === "font-bold"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => toggleStyle("fontWeight", "font-bold")}
        >
          <Icon name="Bold" color="text-gray-900" />
        </Button>

        <Button
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${
            textTwClassObj.fontItalic?.noPrefix === "italic"
              ? "bg-gray-200"
              : ""
          }`}
          onClick={() => toggleStyle("fontItalic", "italic")}
        >
          <Icon name="Italic" color="text-gray-900" />
        </Button>

        <Button
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${
            textTwClassObj.fontUnderline?.noPrefix === "underline"
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
        value={textTwClassObj.fontColor?.noPrefix || ""}
        onChange={(val) => updateNodeStyle("fontColor", val)}
      />
      <ColorPicker
        label="Text Background"
        prefix="bg-"
        TwClassName="mb-4"
        value={textTwClassObj.bgColor?.noPrefix || ""}
        onChange={(val) => updateNodeStyle("bgColor", val)}
      />
      <BorderPicker 
        label="Border Settings"
        TwClassName="mb-4"
        value={textTwClassObj.borderStyle?.noPrefix || ""}
        onChange={(val) => updateNodeStyle("borderStyle", val)}
      />
    </Container>
  );
};

export default TextEditor;