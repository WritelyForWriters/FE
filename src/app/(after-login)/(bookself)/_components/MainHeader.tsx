'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { MAX_PRODUCT_COUNT } from 'constants/bookself/number'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { useAtomValue } from 'jotai'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import SelectMenu from '@components/select-menu/SelectMenu'
import { useToast } from '@components/toast/ToastProvider'

import { useLogout } from '@hooks/auth/useLogout'
import { useCollapsed } from '@hooks/common/useCollapsed'
import { useProducts } from '@hooks/products/useProductsMutation'
import { useGetProductList } from '@hooks/products/useProductsQueries'

import logo from '/public/images/logo.png'

import classNames from 'classnames/bind'

import styles from './MainHeader.module.scss'

const cx = classNames.bind(styles)

export default function MainHeader() {
  const router = useRouter()
  const { isOpen, onToggle, onClose } = useCollapsed()
  const showToast = useToast()

  const isLoggedIn = useAtomValue(isLoggedInAtom)

  const { data } = useGetProductList()
  const { createProductIdMutation } = useProducts()
  const { mutate: logout } = useLogout()

  const onClickOpenDropdown = () => {
    if (!isLoggedIn) {
      router.push(`/login`)
    } else {
      if (data?.length && data?.length >= MAX_PRODUCT_COUNT) {
        return showToast('warning', TOAST_MESSAGE.LIMIT_PRODUCT_COUNT)
      }
      onToggle()
    }
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

  const handleAuthButtonClick = (type: 'logout' | 'login') => {
    if (type === 'logout') {
      logout()
    } else {
      router.push('/login')
    }
  }

  return (
    <header className={cx('header')}>
      <div className={cx('inner-container')}>
        <Image src={logo} width={89} height={16} alt="로고" />
        <section className={cx('inner-container__buttons')}>
          <TextButton
            size="large"
            style={{
              display: 'inline',
              marginRight: '1.6rem',
            }}
            onClick={() => handleAuthButtonClick(isLoggedIn ? 'logout' : 'login')}
          >
            {isLoggedIn ? '로그아웃' : '로그인'}
          </TextButton>
          <FillButton
            size="medium"
            style={{
              display: 'inline',
            }}
            onClick={onClickOpenDropdown}
          >
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
        </section>
      </div>
    </header>
  )
}
