"use client";

import { useAccordionContext } from "../AccordionContext";

interface Props {
  children: (
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
  ) => React.ReactNode;
}
export default function AccordionHeader({ children }: Props) {
  const { isOpen, setIsOpen } = useAccordionContext();

  return <div>{children(isOpen, setIsOpen)}</div>;
}
