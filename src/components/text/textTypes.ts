export interface TextProps {
  text: string;
  twClasses?: string[]; 
}

export interface TextEditorProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}