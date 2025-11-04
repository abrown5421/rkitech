import React, { useState } from "react";
import type { AccordionProps, AccordionItem } from "./accordionTypes";

const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
  toggleable = true,
  allowMultipleOpen = false,
}) => {
  const [openItems, setOpenItems] = useState<Set<string | number>>(
    new Set(items.filter(item => item.defaultOpen).map(item => item.id))
  );

  const handleToggle = (id: string | number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        if (toggleable) newSet.delete(id);
      } else {
        if (!allowMultipleOpen) newSet.clear();
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getColors = (item: AccordionItem, isOpen: boolean) =>
    isOpen ? item.activeColorObject : item.inactiveColorObject;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map(item => {
        const isOpen = openItems.has(item.id);
        const colors = getColors(item, isOpen);

        return (
          <div
            key={item.id}
            className={`collapse collapse-arrow ${isOpen ? "collapse-open" : ""} border ${colors.borderClass} ${colors.bgColorClass}`}
          >
            <div
              className={`collapse-title font-semibold cursor-pointer flex items-center justify-between ${colors.headingTextClass}`}
              onClick={() => handleToggle(item.id)}
            >
              <span>{item.title}</span>
            </div>
            <div className={`collapse-content text-sm ${colors.bodyTextClass}`}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
