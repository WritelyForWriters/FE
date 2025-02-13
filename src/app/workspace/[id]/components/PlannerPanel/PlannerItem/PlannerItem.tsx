import AccordionPanel from "@/app/components/Accordion/Accordion";
import Text from "@/app/components/Text/Text";
import Row from "@/app/components/Row/Row";
import IconButton from "@/app/components/Buttons/IconButton/IconButton";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  title: string;
  content: string;
}

export default function PlannerItem({ title, content }: Props) {
  return (
    <AccordionPanel gap={8}>
      <AccordionPanel.Header>
        {(isOpen, setIsOpen) => (
          <Row spaceBetween fullWidth>
            <Text fontSize="12px" fontWeight={700} color="#000">
              {title}
            </Text>

            <IconButton onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FaChevronUp color="#A5A4A2" />
              ) : (
                <FaChevronDown color="#A5A4A2" />
              )}
            </IconButton>
          </Row>
        )}
      </AccordionPanel.Header>
      <AccordionPanel.Body>
        <Text fontSize="14px" fontWeight={400} color="#000">
          {content}
        </Text>
      </AccordionPanel.Body>
    </AccordionPanel>
  );
}
