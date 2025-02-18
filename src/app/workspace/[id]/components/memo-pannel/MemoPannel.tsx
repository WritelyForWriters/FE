'use client'

import Accordion from '@components/accordion/Accordion'
import Tab from '@components/tab/Tab'

import MemoItem from './MemoItem'

import classNames from 'classnames/bind'

import styles from './MemoPannel.module.scss'

const cx = classNames.bind(styles)

export default function MemoPannel() {
  return (
    <section className={cx('container')}>
      <Accordion>
        <Accordion.Header>
          <h2 className={cx('title')}>메모</h2>
        </Accordion.Header>
        <Accordion.Body>
          <div className={cx('contents')}>
            <Tab defaultTab="progress">
              <Tab.Button value="progress">진행중</Tab.Button>
              <Tab.Button value="all">전체</Tab.Button>
            </Tab>

            <ul className={cx('memo-list')}>
              {Array.from({ length: 4 }, (_, index) => (
                <MemoItem key={index} />
              ))}
            </ul>
          </div>
        </Accordion.Body>
      </Accordion>
    </section>
  )
}
