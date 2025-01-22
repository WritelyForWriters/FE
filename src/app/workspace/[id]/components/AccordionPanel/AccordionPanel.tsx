"use client";

import { PropsWithChildren } from "react";

import { AccordionPanelProvider } from "./AccordionPanelContext";
import AccordionPanelHeader from "./AccordionPanelHeader/AccordionPanelHeader";
import AccordionPanelBody from "./AccordionPanelBody/AccordionPanelBody";

import styles from "./AccordionPanelStyle.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function AccordionPanel({ children }: PropsWithChildren) {
  return (
    <AccordionPanelProvider>
      <div className={cx("container")}>{children}</div>
    </AccordionPanelProvider>
  );
}

AccordionPanel.Header = AccordionPanelHeader;
AccordionPanel.Body = AccordionPanelBody;
