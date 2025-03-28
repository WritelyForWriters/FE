'use client'

/**
 * 로그인 페이지
 * @author 선우
 */
import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { setCookie } from 'cookies-next'
import { useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { login } from 'service/auth/auth'
import { isLoggedInAtom } from 'store/isLoggedInAtom'
import { LoginFormFieldValues } from 'types/auth/login'

import FillButton from '@components/buttons/FillButton'
import OutLinedButton from '@components/buttons/OutLinedButton'
import TextButton from '@components/buttons/TextButton'
import Checkbox from '@components/checkbox/Checkbox'
import TextField from '@components/text-field/TextField'
import { useToast } from '@components/toast/ToastProvider'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function LoginPage() {
  const router = useRouter()
  const showToast = useToast()

  const methods = useForm<LoginFormFieldValues>()

  const { handleSubmit } = methods

  const isLoggedIn = useAtomValue(isLoggedInAtom)

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = '/'
    }
  }, [isLoggedIn])

  // 로그인 하기
  const handleLogin = async (data: LoginFormFieldValues) => {
    const { email, password, rememberMe } = data

    try {
      const response = await login({ email, password })

      if (response.code === 'RESULT-001') {
        // TODO: cookie expire 의사 결정 필요
        const date = new Date()
        date.setTime(date.getTime() + 60 * 60 * 1000)

        if (rememberMe) {
          setCookie('isRemberMe', true, { expires: date, path: '/' })
        }

        setCookie(
          'refreshToken',
          response.result.refreshToken,
          rememberMe ? { expires: date, path: '/' } : {},
        )
        setCookie('isLoggedIn', true, rememberMe ? { expires: date, path: '/' } : {})

        router.replace('/')
      } else {
        showToast('warning', response.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast('warning', error.message)
      }
    }
  }

  const navigateTo = (url: string) => {
    router.push(url)
  }

  return (
    <main className={cx('wrapper')}>
      <div className={cx('inner-container')}>
        <section className={cx('form-section')}>
          <h3 className={cx('form-section__title')}>
            당신의 인생 작품, <br />한 문장부터 시작하세요
          </h3>
          <FormProvider {...methods}>
            <form className={cx('login-form')}>
              <TextField
                name="email"
                label="이메일"
                options={{
                  required: true,
                }}
              />
              <TextField
                name="password"
                label="비밀번호"
                variant="password"
                options={{
                  required: true,
                }}
              />
              <div className={cx('login-form__checkbox-section')}>
                <Checkbox label="로그인 유지하기" name="rememberMe" />
              </div>
            </form>
          </FormProvider>
        </section>
        <section className={cx('btn-section')}>
          <FillButton type="submit" size="large" onClick={handleSubmit(handleLogin)}>
            로그인
          </FillButton>
          <OutLinedButton type="button" size="large" onClick={() => navigateTo('/join')}>
            회원가입
          </OutLinedButton>
          <div className={cx('btn-section__find-password')}>
            <TextButton type="button" size="small" onClick={() => navigateTo('/find-password')}>
              비밀번호 찾기
            </TextButton>
          </div>
        </section>
      </div>
    </main>
  )
}
