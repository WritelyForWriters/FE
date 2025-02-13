'use client'

import { FaListAlt } from 'react-icons/fa'
import { FaMinus } from 'react-icons/fa6'
import { IoChevronDownOutline } from 'react-icons/io5'

import Accordion from '@components/Accordion/Accordion'
import IconButton from '@components/Buttons/IconButton/IconButton'
import Row from '@components/Row/Row'
import Text from '@components/Text/Text'

import PanelBody from '../ui/panelUI/PanelBody/PanelBody'
import PanelContainer from '../ui/panelUI/PanelContainer/PanelContainer'
import PanelHeader from '../ui/panelUI/PanelHeader/PanelHeader'
import PlannerList from './PlannerList/PlannerList'

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
