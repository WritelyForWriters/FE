'use client'

import Accordion from '@components/Accordion/Accordion'
import IconButton from '@components/Buttons/IconButton/IconButton'
import { ArrowDownIcon, RemoveIcon } from '@components/Icons'
import Text from '@components/Text/Text'

import PanelBody from '../ui/panelUI/PanelBody/PanelBody'
import PanelContainer from '../ui/panelUI/PanelContainer/PanelContainer'
import PanelHeader from '../ui/panelUI/PanelHeader/PanelHeader'
import MemoPanelBody from './MemoPanelBody/MemoPanelBody'

export default function MemoPanel() {
  return (
    <PanelContainer>
      <Accordion>
        <Accordion.Header>
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
        </Accordion.Header>
        <Accordion.Body>
          <PanelBody>
            <MemoPanelBody />
          </PanelBody>
        </Accordion.Body>
      </Accordion>
    </PanelContainer>
  )
}
