'use client'

import { useRouter } from 'next/navigation'

import { MAX_PRODUCT_COUNT } from 'constants/bookself/number'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { postProducts } from 'services/products/products'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'
import { useToast } from '@components/toast/ToastProvider'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './MainHeader.module.scss'

const cx = classNames.bind(styles)

interface MainHeaderProps {
  productCount?: number
}

export default function MainHeader({ productCount }: MainHeaderProps) {
  const router = useRouter()
  const { isOpen, onToggle, onClose } = useCollapsed()
  const showToast = useToast()

  const onClickOpenDropdown = () => {
    if (productCount && productCount >= MAX_PRODUCT_COUNT) {
      return showToast('warning', TOAST_MESSAGE.LIMIT_PRODUCT_COUNT)
    }
    onToggle()
  }

  const onClickWriting = async (route: 'workspace' | 'planner') => {
    try {
      const productId = await postProducts()

      if (productId) {
        router.push(`/${route}/${productId}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className={cx('header')}>
      <div>로고</div>

      <div className={cx('button-wrapper')}>
        <FillButton size="medium" onClick={onClickOpenDropdown}>
          글쓰기
        </FillButton>

        <SelectMenu handleClose={onClose} isOpen={isOpen} style={{ width: '109px' }}>
          <SelectMenu.Option option={{ handleAction: () => onClickWriting('workspace') }}>
            바로 집필하기
          </SelectMenu.Option>
          <SelectMenu.Option option={{ handleAction: () => onClickWriting('planner') }}>
            작품 기획하기
          </SelectMenu.Option>
        </SelectMenu>
      </div>
    </header>
  )
}
