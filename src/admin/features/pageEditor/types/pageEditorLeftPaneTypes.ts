export type EditorType = 'default' | 'text' | 'container' | 'image' | 'button' | 'icon';

export interface Editor {
  editorName: string;
  editorIcon: React.ReactNode;
  editor: EditorType;
}