import MemoCard from './MemoCard/MemoCard'

import classNames from 'classnames/bind'

import styles from './MemoList.module.scss'

const cx = classNames.bind(styles)

interface Props {
  status: 'all' | 'ing'
}

export default function MemoList({ status }: Props) {
  // TODO status eslint 에러로 console.log 추가헤 두었습니다. 추후 변수 사용이 필요합니다.
  console.log(status)

  return (
    <ul className={cx('list')}>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
      <li>
        <MemoCard />
      </li>
    </ul>
  )
}
