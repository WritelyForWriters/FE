"use client";

import { PropsWithChildren } from "react";

import { AccordionProvider } from "./AccordionContext";
import AccordionHeader from "./AccordionHeader/AccordionHeader";
import AccordionBody from "./AccordionBody/AccordionBody";

export default function Accordion({ children }: PropsWithChildren) {
  return (
    <AccordionProvider>
      <div>{children}</div>
    </AccordionProvider>
  );
}

Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;
