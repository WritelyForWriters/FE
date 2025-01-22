"use client";

import { useAccordionPanelContext } from "../AccordionPanelContext";

interface Props {
  children: (
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
  ) => React.ReactNode;
}
export default function AccordionPanelHeader({ children }: Props) {
  const { isOpen, setIsOpen } = useAccordionPanelContext();

  return <div>{children(isOpen, setIsOpen)}</div>;
}
