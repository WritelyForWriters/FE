'use client'

import { FaListAlt } from 'react-icons/fa'
import { FaMinus } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'

import Accordion from '@components/accordion/Accordion'
import IconButton from '@components/buttons/IconButton'
import Row from '@components/row/Row'
import Text from '@components/text/Text'

import PanelBody from '../panel/PanelBody'
import PanelContainer from '../panel/PanelContainer'
import PanelHeader from '../panel/PanelHeader'
import PlannerList from './PlannerList'

export default function PlannerPanel() {
  return (
    <PanelContainer>
      <Accordion>
        <Accordion.Header>
          {(isOpen, setIsOpen) => (
            <PanelHeader isOpen={isOpen}>
              <Text fontSize="14px" fontWeight={600} color="#000">
                작품 플래너
              </Text>

              {isOpen ? (
                <Row gap={4}>
                  <IconButton onClick={() => setIsOpen(!isOpen)}>
                    <FaListAlt size={20} color="#B3B3B3" />
                  </IconButton>
                  <IconButton onClick={() => setIsOpen(!isOpen)}>
                    <FaMinus size={18} color="#B3B3B3" />
                  </IconButton>
                </Row>
              ) : (
                <IconButton onClick={() => setIsOpen(!isOpen)}>
                  <IoIosArrowDown size={18} fill="#B3B3B3" />
                </IconButton>
              )}
            </PanelHeader>
          )}
        </Accordion.Header>
        <Accordion.Body>
          <PanelBody>
            <PlannerList />
          </PanelBody>
        </Accordion.Body>
      </Accordion>
    </PanelContainer>
  )
}
