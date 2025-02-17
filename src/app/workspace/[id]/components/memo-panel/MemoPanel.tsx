'use client'

import { FaMinus } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'

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
                {isOpen ? (
                  <FaMinus color="#B3B3B3" size={18} />
                ) : (
                  <IoIosArrowDown size={18} fill="#B3B3B3" />
                )}
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
