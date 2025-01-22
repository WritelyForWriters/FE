"use client";

import AccordionPanel from "@/app/workspace/[id]/components/ui/AccordionPanel/AccordionPanel";
import Row from "@/app/components/Row/Row";

export default function MemoPanel() {
  return (
    <AccordionPanel>
      <AccordionPanel.Header>
        {(isOpen, setIsOpen) => (
          <Row spaceBetween>
            메모
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "열렸다" : "닫혔다"}
            </button>
          </Row>
        )}
      </AccordionPanel.Header>
      <AccordionPanel.Body>
        <div>메모 들어갑니다~~</div>
        <div>메모 들어갑니다~~</div>
        <div>메모 들어갑니다~~</div>
        <div>메모 들어갑니다~~</div>
        <div>메모 들어갑니다~~</div>
      </AccordionPanel.Body>
    </AccordionPanel>
  );
}
