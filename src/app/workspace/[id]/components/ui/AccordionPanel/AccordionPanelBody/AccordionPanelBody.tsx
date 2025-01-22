import { PropsWithChildren } from "react";

import { useAccordionPanelContext } from "../AccordionPanelContext";

export default function AccordionPanelBody({ children }: PropsWithChildren) {
  const { isOpen } = useAccordionPanelContext();

  return isOpen ? <div>{children}</div> : null;
}
