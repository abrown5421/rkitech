export interface MenuProps {
  twClasses?: string[];
  environment: 'client' | string; 
  navigationHook?: (slug: string, name: string, id: string) => () => void;
  menuPages?: any[]; 
}
