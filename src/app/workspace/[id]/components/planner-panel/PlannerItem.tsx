import Accordion from '@components/accordion/Accordion'

import classNames from 'classnames/bind'

import styles from './PlannerItem.module.scss'

const cx = classNames.bind(styles)

interface PlannerItemProps {
  title: string
  content: string
}

export default function PlannerItem({ title, content }: PlannerItemProps) {
  return (
    <li>
      <Accordion>
        <Accordion.Header>
          <h3 className={cx('title')}>{title}</h3>
        </Accordion.Header>

        <Accordion.Body>
          <p className={cx('content')}>{content}</p>
        </Accordion.Body>
      </Accordion>
    </li>
  )
}
