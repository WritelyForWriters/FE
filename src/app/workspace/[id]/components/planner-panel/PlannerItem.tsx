import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import Accordion from '@components/accordion/Accordion'
import IconButton from '@components/buttons/IconButton'
import Row from '@components/row/Row'
import Text from '@components/text/Text'

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
              {isOpen ? <FaChevronUp color="#B3B3B3" /> : <FaChevronDown color="#B3B3B3" />}
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
