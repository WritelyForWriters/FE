import { PLANNER_CHARACTER_ITEMS } from 'constants/planner/plannerConstants'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import TextField from '@components/text-field/TextField'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterFormList.module.scss'

const cx = classNames.bind(styles)

export default function PlannerCharacterFormList() {
  const { isOpen, onToggle } = useCollapsed(true)

  return (
    <div className={cx('list')}>
      <div className={cx('list__title')}>
        <span>등장인물 1</span>
        {isOpen ? (
          <IoIosArrowUp onClick={onToggle} className={cx('list__title__closed-icon')} />
        ) : (
          <IoIosArrowDown onClick={onToggle} className={cx('list__title__opend-icon')} />
        )}
      </div>

      {isOpen && (
        <div className={cx('list__items')}>
          {PLANNER_CHARACTER_ITEMS.map((item) => (
            <TextField key={item.itemId} name={item.name} label={item.label} />
          ))}
        </div>
      )}
    </div>
  )
}
