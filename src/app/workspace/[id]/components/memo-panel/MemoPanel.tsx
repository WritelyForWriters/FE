'use client'

import { ArrowDownIcon, RemoveIcon } from '@components/Icons'
import Accordion from '@components/accordion/Accordion'
import IconButton from '@components/buttons/IconButton'
import Text from '@components/text/Text'

import PanelBody from '../panel/PanelBody'
import PanelContainer from '../panel/PanelContainer'
import PanelHeader from '../panel/PanelHeader'
import MemoPanelBody from './MemoPanelBody'

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
