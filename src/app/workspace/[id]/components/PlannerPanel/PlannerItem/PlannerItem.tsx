import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import Accordion from '@components/Accordion/Accordion'
import IconButton from '@components/Buttons/IconButton/IconButton'
import Row from '@components/Row/Row'
import Text from '@components/Text/Text'

interface Props {
  title: string
  content: string
}

export default function PlannerItem({ title, content }: Props) {
  return (
    <Accordion gap={12}>
      <Accordion.Header>
        {(isOpen, setIsOpen) => (
          <Row spaceBetween>
            <Text fontSize="12px" fontWeight={700} color="#000">
              {title}
            </Text>

            <IconButton onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaChevronUp color="#A5A4A2" /> : <FaChevronDown color="#A5A4A2" />}
            </IconButton>
          </Row>
        )}
      </Accordion.Header>
      <Accordion.Body>
        <Text fontSize="14px" fontWeight={400} color="#000">
          {content}
        </Text>
      </Accordion.Body>
    </Accordion>
  )
}
