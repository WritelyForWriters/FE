// 작업공간
"use client";

import AccordionPanel from "./components/AccordionPanel/AccordionPanel";
import Row from "@/app/components/Row/Row";

export default function Page() {
  return (
    <div style={{ width: "200px" }}>
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
    </div>
  );
}
