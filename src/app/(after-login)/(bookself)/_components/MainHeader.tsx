'use client'

import { useRouter } from 'next/navigation'

import { products } from 'mockData'
import { postProducts } from 'services/products/products'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './MainHeader.module.scss'

const cx = classNames.bind(styles)

export default function MainHeader() {
  const router = useRouter()
  const { isOpen, onToggle } = useCollapsed()

  const onClickOpenDropdown = () => {
    if (products.length >= 30) {
      // TODO 토스트
      alert('최대 30개만 집필')
      return
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

        <SelectMenu handleClose={() => {}} isOpen={isOpen} style={{ width: '109px' }}>
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
