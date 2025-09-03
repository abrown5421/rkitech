import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Container from "../../../shared/components/container/Container";
import type { NodeTwClassName, TextEditorProps } from "./textEditorTypes";
import { findNodeByUUID } from "../../utils/findNodeByUUID";
import Input from "../../../shared/components/input/Input";
import { updatePageField } from "../page/pageEditorSlice";
import Icon from "../../../shared/components/icon/Icon";
import Button from "../../../shared/components/button/Button";
import Select from "../../../shared/components/select/Select";
import PaddingPicker from "../../components/paddingPicker/PaddingPicker";
import MarginPicker from "../../components/marginPicker/MarginPicker";
import BorderPicker from "../../components/borderPicker/BorderPicker";
import ColorPicker from "../../components/colorPicker/ColorPicker";
import Text from "../../../shared/components/text/Text";


const TextEditor: React.FC<TextEditorProps> = ({ nodeUUID }) => {
  const dispatch = useAppDispatch();
  const pageContent = useAppSelector(
    (state) => state.pageEditor.localPageObjectFromDb?.content
  );
  const activePrefix = useAppSelector((state) => state.pageEditor.activePrefix) || 'base';

  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('');
  const [fontWeight, setFontWeight] = useState<boolean>(false);
  const [fontItalic, setFontItalic] = useState<boolean>(false);
  const [fontUnderline, setFontUnderline] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [border, setBorder] = useState<string>('');
  const [margin, setMargin] = useState<string>('');
  const [padding, setPadding] = useState<string>('');

  const extractClassFromTwClassName = (twClassName: NodeTwClassName, category: string, breakpoint?: string): string => {
    const categoryData = twClassName[category as keyof NodeTwClassName];
    if (!categoryData || typeof categoryData !== 'object') return '';
    
    const key = breakpoint || activePrefix;
    return categoryData[key] || '';
  };

  const checkBooleanClass = (twClassName: NodeTwClassName, category: string, targetClass: string, breakpoint?: string): boolean => {
    const classValue = extractClassFromTwClassName(twClassName, category, breakpoint);
    return classValue === targetClass;
  };

  useEffect(() => {
    if (!pageContent) return;

    const node = findNodeByUUID(pageContent, nodeUUID);
    if (node) {      
      setText(node.props?.text || "");
      
      const twClassName = node.props?.TwClassName as NodeTwClassName || {};
      
      setFontSize(extractClassFromTwClassName(twClassName, 'fontSize'));
      setFontFamily(extractClassFromTwClassName(twClassName, 'fontFace'));
      setFontWeight(checkBooleanClass(twClassName, 'fontWeight', 'font-bold'));
      setFontItalic(checkBooleanClass(twClassName, 'fontWeight', 'italic')); 
      setFontUnderline(checkBooleanClass(twClassName, 'fontWeight', 'underline')); 
      setTextColor(extractClassFromTwClassName(twClassName, 'fontColor'));
      setBackgroundColor(extractClassFromTwClassName(twClassName, 'backgroundColor'));
      setBorder(extractClassFromTwClassName(twClassName, 'border'));
      setMargin(extractClassFromTwClassName(twClassName, 'margin'));
      setPadding(extractClassFromTwClassName(twClassName, 'padding'));
    }
  }, [nodeUUID, pageContent]);

  const updateNodeTwClassName = (
    node: any, 
    uuid: string, 
    category: string, 
    newValue: string, 
    breakpoint?: string
  ): any => {
    if (!node) return node;
    
    if (Array.isArray(node)) {
      return node.map((n) => updateNodeTwClassName(n, uuid, category, newValue, breakpoint));
    }
    
    if (node.UUID === uuid) {
      const currentTwClassName = node.props?.TwClassName || {};
      const key = breakpoint || activePrefix;
      
      const updatedTwClassName = {
        ...currentTwClassName,
        [category]: {
          ...(currentTwClassName[category] || {}),
          [key]: newValue,
        }
      };
      
      return {
        ...node,
        props: {
          ...(node.props || {}),
          TwClassName: updatedTwClassName,
        },
      };
    }
    
    if (node.children) {
      return {
        ...node,
        children: updateNodeTwClassName(node.children, uuid, category, newValue, breakpoint),
      };
    }
    
    return node;
  };

  const handleTextChange = (val: string) => {
    setText(val);
    if (!pageContent) return;

    dispatch(
      updatePageField({
        field: "content",
        value: updateNodeText(pageContent, nodeUUID, val),
      })
    );
  };

  const handleStyleUpdate = (category: string, newValue: string, breakpoint?: string) => {
    if (!pageContent) return;

    dispatch(
      updatePageField({
        field: "content",
        value: updateNodeTwClassName(pageContent, nodeUUID, category, newValue, breakpoint),
      })
    );
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontSize = e.target.value;
    setFontSize(newFontSize);
    handleStyleUpdate('fontSize', newFontSize);
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
    handleStyleUpdate('fontFace', newFontFamily);
  };

  const handleFontWeightToggle = () => {
    const newFontWeight = !fontWeight;
    setFontWeight(newFontWeight);
    handleStyleUpdate('fontWeight', newFontWeight ? 'font-bold' : '');
  };

  const handleFontItalicToggle = () => {
    const newFontItalic = !fontItalic;
    setFontItalic(newFontItalic);
    handleStyleUpdate('fontStyle', newFontItalic ? 'italic' : '');
  };

  const handleFontUnderlineToggle = () => {
    const newFontUnderline = !fontUnderline;
    setFontUnderline(newFontUnderline);
    handleStyleUpdate('textDecoration', newFontUnderline ? 'underline' : '');
  };

  const handleTextColorChange = (newColor: string) => {
    setTextColor(newColor);
    handleStyleUpdate('fontColor', newColor);
  };

  const handleBackgroundColorChange = (newColor: string) => {
    setBackgroundColor(newColor);
    handleStyleUpdate('backgroundColor', newColor);
  };

  const handleBorderChange = (newBorder: string) => {
    setBorder(newBorder);
    handleStyleUpdate('border', newBorder);
  };

  const handleMarginChange = (newMargin: string) => {
    setMargin(newMargin);
    handleStyleUpdate('margin', newMargin);
  };

  const handlePaddingChange = (newPadding: string) => {
    setPadding(newPadding);
    handleStyleUpdate('padding', newPadding);
  };

  // Keep the existing updateNodeText function for text updates
  const updateNodeText = (node: any, uuid: string, newText: string): any => {
    if (!node) return node;
    if (Array.isArray(node)) return node.map((n) => updateNodeText(n, uuid, newText));
    if (node.UUID === uuid) return { ...node, props: { ...(node.props || {}), text: newText, TwClassName: node.props?.TwClassName || {}, }, };
    if (node.children) return { ...node, children: updateNodeText(node.children, uuid, newText), };
    return node;
  };

  if (!pageContent) return null;

  return (
    <Container TwClassName="flex-col mb-4">
      <Container TwClassName="flex-row mb-3 gap-3">
        <Select 
          TwClassName="flex-2" 
          label="Size" 
          value={fontSize}
          onChange={handleFontSizeChange}
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
          value={fontFamily}
          onChange={handleFontFamilyChange}
        >
          <option value="">Default</option>
          <option value="font-primary">Primary</option>
          <option value="font-secondary">Secondary</option>
          <option value="font-sans">Sans</option>
          <option value="font-serif">Serif</option>
          <option value="font-mono">Mono</option>
        </Select>
        
        <Button 
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${fontWeight ? 'bg-blue-100' : ''}`}
          onClick={handleFontWeightToggle}
        >
          <Icon name="Bold" color="text-gray-900" />
        </Button>
        
        <Button 
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${fontItalic ? 'bg-blue-100' : ''}`}
          onClick={handleFontItalicToggle}
        >
          <Icon name="Italic" color="text-gray-900" />
        </Button>
        
        <Button 
          TwClassName={`border-1 border-gray-300 flex-1 rounded ${fontUnderline ? 'bg-blue-100' : ''}`}
          onClick={handleFontUnderlineToggle}
        >
          <Icon name="Underline" color="text-gray-900" />
        </Button>
      </Container>

      <Input 
        label="Text" 
        value={text} 
        rows={4} 
        multiline 
        onChange={(e) => handleTextChange(e.target.value)} 
        TwClassName="mb-4" 
      />

      <Text TwClassName="block text-sm font-medium mb-2" text="Color Settings" />
      
      <ColorPicker 
        label="Text Color" 
        prefix="text-" 
        TwClassName="mb-4" 
        value={textColor}
        onChange={handleTextColorChange}
      />
      
      <ColorPicker 
        label="Text Background" 
        prefix="bg-" 
        TwClassName="mb-4" 
        value={backgroundColor}
        onChange={handleBackgroundColorChange}
      />

      <BorderPicker 
        label="Border Settings" 
        TwClassName="mb-4" 
        value={border}
        onChange={handleBorderChange}
      />

      <MarginPicker 
        label="Margin" 
        TwClassName="mb-4" 
        value={margin}
        onChange={handleMarginChange}
      />

      <PaddingPicker 
        label="Padding" 
        TwClassName="mb-4" 
        value={padding}
        onChange={handlePaddingChange}
      />
    </Container>
  );
};

export default TextEditor;