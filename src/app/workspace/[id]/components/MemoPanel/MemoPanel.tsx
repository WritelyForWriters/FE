'use client'

import Accordion from '@components/Accordion/Accordion'
import Row from '@components/Row/Row'

// TODO 절대경로
import PanelContainer from '../ui/PanelContainer/PanelContainer'

export default function MemoPanel() {
  return (
    <PanelContainer>
      <Accordion>
        <Accordion.Header>
          {(isOpen, setIsOpen) => (
            <Row spaceBetween>
              메모
              <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '열렸다' : '닫혔다'}</button>
            </Row>
          )}
        </Accordion.Header>
        <Accordion.Body>
          <div>메모 들어갑니다~~</div>
          <div>메모 들어갑니다~~</div>
          <div>메모 들어갑니다~~</div>
          <div>메모 들어갑니다~~</div>
          <div>메모 들어갑니다~~</div>
        </Accordion.Body>
      </Accordion>
    </PanelContainer>
  )
}
