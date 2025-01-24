"use client";

import AccordionPanel from "@/app/components/Accordion/Accordion";
import PanelBody from "../ui/panelUI/PanelBody/PanelBody";
import PanelHeader from "@/app/workspace/[id]/components/ui/panelUI/PanelHeader/PanelHeader";
import PanelContainer from "@/app/workspace/[id]/components/ui/panelUI/PanelContainer/PanelContainer";
import MemoPanelBody from "./MemoPanelBody/MemoPanelBody";
import Text from "@/app/components/Text/Text";
import { ArrowDownIcon, RemoveIcon } from "@/app/components/Icons";
import IconButton from "@/app/components/Buttons/IconButton/IconButton";

export default function MemoPanel() {
  return (
    <PanelContainer>
      <AccordionPanel>
        <AccordionPanel.Header>
          {(isOpen, setIsOpen) => (
            <PanelHeader isOpen={isOpen}>
              <Text fontSize="14px" fontWeight={600} color="#000">
                메모
              </Text>
              <IconButton onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <RemoveIcon /> : <ArrowDownIcon />}
              </IconButton>
            </PanelHeader>
          )}
        </AccordionPanel.Header>
        <AccordionPanel.Body>
          <PanelBody>
            <MemoPanelBody />
          </PanelBody>
        </AccordionPanel.Body>
      </AccordionPanel>
    </PanelContainer>
  );
}
