import React from 'react';
import type { TabsProps } from './tabTypes';
import Tab from './Tab';
import { setActiveTab } from './tabSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const Tabs: React.FC<TabsProps> = ({ tabs, tabGroupId, activeTabId, onTabChange }) => {
  const dispatch = useAppDispatch();
  const globalActiveTab = useAppSelector((state) => state.tabs[tabGroupId]);

  const currentTabId = activeTabId || globalActiveTab || tabs[0]?.id;

  const handleChange = (id: string) => {
    dispatch(setActiveTab({ groupId: tabGroupId, tabId: id }));
    onTabChange?.(id);
  };

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            active={tab.id === currentTabId}
            onClick={() => handleChange(tab.id)}
          />
        ))}
      </div>
      <div className="p-4">
        {tabs.find((tab) => tab.id === currentTabId)?.content}
      </div>
    </div>
  );
};

export default Tabs;
