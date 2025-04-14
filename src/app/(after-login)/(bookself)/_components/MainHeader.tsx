'use client'

import { useRouter } from 'next/navigation'

import { MAX_PRODUCT_COUNT } from 'constants/bookself/number'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'
import { useToast } from '@components/toast/ToastProvider'

import { useCollapsed } from '@hooks/common/useCollapsed'
import { useProducts } from '@hooks/products/useProductsMutation'
import { useGetProductList } from '@hooks/products/useProductsQueries'

import classNames from 'classnames/bind'

import styles from './MainHeader.module.scss'

const cx = classNames.bind(styles)

export default function MainHeader() {
  const router = useRouter()
  const { isOpen, onToggle, onClose } = useCollapsed()
  const showToast = useToast()

  const { data } = useGetProductList()
  const { createProductIdMutation } = useProducts()

  const onClickOpenDropdown = () => {
    if (data?.length && data?.length >= MAX_PRODUCT_COUNT) {
      return showToast('warning', TOAST_MESSAGE.LIMIT_PRODUCT_COUNT)
    }
    onToggle()
  }

  const onClickWriting = async (route: 'workspace' | 'planner') => {
    createProductIdMutation.mutate(
      {},
      {
        onSuccess: (productId: string) => {
          router.push(`/${route}/${productId}`)
        },
      },
    )
  }

  return (
    <header className={cx('header')}>
      {/* TODO 로고로 대체 예정 */}
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
