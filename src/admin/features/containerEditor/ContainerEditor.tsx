import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { updatePageField } from "../../../admin/features/page/pageEditorSlice";
import Container from "../../../shared/components/container/Container";
import type { ContainerEditorProps } from "./containerEditorTypes";
import Select from "../../../shared/components/select/Select";
import ColorPicker from "../../components/colorPicker/ColorPicker";
import BorderPicker from "../../components/borderPicker/BorderPicker";
import Text from "../../../shared/components/text/Text";
import MarginPicker from "../../components/marginPicker/MarginPicker";
import PaddingPicker from "../../components/paddingPicker/PaddingPicker";

const ContainerEditor: React.FC<ContainerEditorProps> = ({ nodeUUID }) => {
  const dispatch = useAppDispatch();
  const prefix = useAppSelector((state) => state.pageEditor.activePrefix);
  const hoverMode = useAppSelector((state) => state.pageEditor.hover);
  const pageContent = useAppSelector(
    (state) => state.pageEditor.localPageObjectFromDb?.content
  );

  const [containerTwClassObj, setContainerTwClassObj] = useState<Record<string, any>>({});

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
        "flexDirection",
        "justifyContent",
        "alignItems",
        "textColor", 
        "bgColor",
        "borderColor",
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

      setContainerTwClassObj(twClassObj);
    }
  }, [pageContent, nodeUUID, prefix, hoverMode]);

  const updateNodeStyle = (propName: string, newValue: string) => {
    const fieldKey = getActiveFieldKey();
    
    setContainerTwClassObj((prev) => ({
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
      {hoverMode && (
        <Container TwClassName="mb-3 p-2 bg-amber-50 border border-amber-200 rounded">
          <Text text="✨ Hover Mode Active - Editing hover states" TwClassName="text-amber-700 text-sm" />
        </Container>
      )}
      
      <Text TwClassName="block text-sm font-medium mb-2" text="Layout Settings" />
      
      <Container TwClassName="flex-row mb-3 gap-2">
        {containerTwClassObj.flexDirection && (
          <Select
            TwClassName="flex-1"
            label="Direction"
            value={removePrefix(getCurrentValue(containerTwClassObj.flexDirection))}
            onChange={(e) => updateNodeStyle("flexDirection", addPrefix(e.target.value))}
          >
            <option value="">Default</option>
            <option value="flex-row">Row</option>
            <option value="flex-col">Column</option>
            <option value="flex-row-reverse">Row Reverse</option>
            <option value="flex-col-reverse">Column Reverse</option>
          </Select>
        )}
        
        
      </Container>

      <Container TwClassName="flex-row mb-4 gap-2">
        {containerTwClassObj.justifyContent && (
          <Select
            TwClassName="flex-1"
            label="Justify Content"
            value={removePrefix(getCurrentValue(containerTwClassObj.justifyContent))}
            onChange={(e) => updateNodeStyle("justifyContent", addPrefix(e.target.value))}
          >
            <option value="">Default</option>
            <option value="justify-start">Start</option>
            <option value="justify-end">End</option>
            <option value="justify-center">Center</option>
            <option value="justify-between">Space Between</option>
            <option value="justify-around">Space Around</option>
            <option value="justify-evenly">Space Evenly</option>
          </Select>
        )}
        {containerTwClassObj.alignItems && (
          <Select
            TwClassName="flex-1"
            label="Align Items"
            value={removePrefix(getCurrentValue(containerTwClassObj.alignItems))}
            onChange={(e) => updateNodeStyle("alignItems", addPrefix(e.target.value))}
          >
            <option value="">Default</option>
            <option value="items-start">Start</option>
            <option value="items-end">End</option>
            <option value="items-center">Center</option>
            <option value="items-baseline">Baseline</option>
            <option value="items-stretch">Stretch</option>
          </Select>
        )}
      </Container>

      <Text TwClassName="block text-sm font-medium mb-2" text="Color Settings" />
      
      <ColorPicker
        label="Text Color"
        prefix="text-"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(containerTwClassObj.textColor))}
        onChange={(val) => updateNodeStyle("textColor", addPrefix(val))}
      />
      
      <ColorPicker
        label="Background Color"
        prefix="bg-"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(containerTwClassObj.bgColor))}
        onChange={(val) => updateNodeStyle("bgColor", addPrefix(val))}
      />

      <BorderPicker 
        label="Border Settings"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(containerTwClassObj.borderStyle))}
        onChange={(val) => updateNodeStyle("borderStyle", addPrefix(val))}
      />

      <MarginPicker
        label="Margin"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(containerTwClassObj.margin))}
        onChange={(val) => updateNodeStyle("margin", addPrefix(val))}
      />
      
      <PaddingPicker
        label="Padding"
        TwClassName="mb-4"
        value={removePrefix(getCurrentValue(containerTwClassObj.padding))}
        onChange={(val) => updateNodeStyle("padding", addPrefix(val))}
      />
    </Container>
  );
};

export default ContainerEditor;