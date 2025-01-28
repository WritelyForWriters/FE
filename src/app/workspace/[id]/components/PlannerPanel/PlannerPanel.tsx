"use client";

import { FaListAlt } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";

import AccordionPanel from "@/app/components/Accordion/Accordion";
import PanelBody from "../ui/panelUI/PanelBody/PanelBody";
import PanelHeader from "@/app/workspace/[id]/components/ui/panelUI/PanelHeader/PanelHeader";
import PanelContainer from "@/app/workspace/[id]/components/ui/panelUI/PanelContainer/PanelContainer";
import Text from "@/app/components/Text/Text";
import IconButton from "@/app/components/Buttons/IconButton/IconButton";
import Row from "@/app/components/Row/Row";
import PlannerList from "./PlannerList/PlannerList";

export default function PlannerPanel() {
  return (
    <PanelContainer>
      <AccordionPanel>
        <AccordionPanel.Header>
          {(isOpen, setIsOpen) => (
            <PanelHeader isOpen={isOpen}>
              <Text fontSize="14px" fontWeight={600} color="#000">
                작품 플래너
              </Text>

              {isOpen ? (
                <Row gap={8}>
                  <IconButton onClick={() => setIsOpen(!isOpen)}>
                    <FaListAlt size={20} color="#A5A4A2" />
                  </IconButton>
                  <IconButton onClick={() => setIsOpen(!isOpen)}>
                    <FaMinus size={20} color="#A5A4A2" />
                  </IconButton>
                </Row>
              ) : (
                <IconButton onClick={() => setIsOpen(!isOpen)}>
                  <IoChevronDownOutline size={20} color="#A5A4A2" />
                </IconButton>
              )}
            </PanelHeader>
          )}
        </AccordionPanel.Header>
        <AccordionPanel.Body>
          <PanelBody>
            <PlannerList />
          </PanelBody>
        </AccordionPanel.Body>
      </AccordionPanel>
    </PanelContainer>
  );
}
