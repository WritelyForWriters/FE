import { PLANNER_CHARACTER_ITEMS } from 'constants/planner/plannerConstants'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import FillButton from '@components/buttons/FillButton'
import TextField from '@components/text-field/TextField'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterFormList.module.scss'

const cx = classNames.bind(styles)

interface PlannerCharacterFormListProps {
  arrayIndex: number
  characterId: string
  handleRemoveCharacter: (id: string) => void
}

export default function PlannerCharacterFormList({
  arrayIndex,
  characterId,
  handleRemoveCharacter,
}: PlannerCharacterFormListProps) {
  const { isOpen, onToggle } = useCollapsed(true)

  return (
    <div className={cx('list')}>
      <div className={cx('list__title')}>
        <span>등장인물 {arrayIndex + 1}</span>
        <div className={cx('list__title__buttons')}>
          <div className={cx('list__title__buttons__delete')}>
            <FillButton
              size="small"
              variant="secondary"
              type="button"
              onClick={() => handleRemoveCharacter(characterId)}
            >
              삭제하기
            </FillButton>
          </div>

          {isOpen ? (
            <IoIosArrowUp onClick={onToggle} className={cx('list__title__buttons__closed-icon')} />
          ) : (
            <IoIosArrowDown onClick={onToggle} className={cx('list__title__buttons__opend-icon')} />
          )}
        </div>
      </div>

      {isOpen && (
        <div className={cx('list__items')}>
          {PLANNER_CHARACTER_ITEMS.map((item, index) => (
            <TextField
              key={`planner-character-item-${index}`}
              name={`characters[${characterId}].${item.name}`}
              label={item.label}
            />
          ))}
        </div>
      )}
    </div>
  )
}
