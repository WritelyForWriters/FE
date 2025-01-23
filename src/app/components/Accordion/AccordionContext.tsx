"use client";

import { createContext, useContext, useState } from "react";

export const AccordionContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const AccordionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const useAccordionContext = () => {
  return useContext(AccordionContext);
};
