"use client";

import { createContext, useContext, useState } from "react";

export const AccordionPanelContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const AccordionPanelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionPanelContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AccordionPanelContext.Provider>
  );
};

export const useAccordionPanelContext = () => {
  return useContext(AccordionPanelContext);
};
