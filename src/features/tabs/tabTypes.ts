import type { AuthUser } from "../auth/authUserTypes";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  tabGroupId: string;
}

export interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface TabsState {
  [groupId: string]: string;
}

export interface ProfileTab {
    profileUser: AuthUser;
}