'use client'

import Accordion from '@components/accordion/Accordion'

import PlannerItem from './PlannerItem'

import classNames from 'classnames/bind'

import styles from './PlannerPannel.module.scss'

const cx = classNames.bind(styles)

export default function PlannerPannel() {
  // mock data
  const datas = ['시놉시스', '세계관', '등장인물', '줄거리', '아이디어 노트']

  return (
    <section className={cx('container')}>
      <Accordion>
        <Accordion.Header>
          <h2 className={cx('title')}>작품 플래너</h2>
        </Accordion.Header>

        <Accordion.Body>
          <ul className={cx('memo-list')}>
            {datas.map((data) => (
              <PlannerItem key={data} title={data} content={`${data} 내용`} />
            ))}
          </ul>
        </Accordion.Body>
      </Accordion>
    </section>
  )
}
