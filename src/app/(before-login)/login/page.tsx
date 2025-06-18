'use client'

/**
 * 로그인 페이지
 * @author 선우
 */
import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { useSetAtom } from 'jotai'
import { setAmplitudeUserId, trackEvent } from 'lib/amplitude'
import { FormProvider, useForm } from 'react-hook-form'
import { plannerCharacterFormValuesAtom } from 'store/plannerAtoms'
import { LoginFormFieldValues } from 'types/auth/auth'

import FillButton from '@components/buttons/FillButton'
import OutLinedButton from '@components/buttons/OutLinedButton'
import TextButton from '@components/buttons/TextButton'
import Checkbox from '@components/checkbox/Checkbox'
import TextField from '@components/text-field/TextField'

import { usePageExitTracking } from '@hooks/amplitude/usePageExitTracking'
import { useLogin } from '@hooks/index'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function LoginPage() {
  const router = useRouter()
  const setPlannerFormValues = useSetAtom(plannerCharacterFormValuesAtom)

  useEffect(() => {
    trackEvent('page_view', {
      page_name: 'login',
    })
  }, [])

  usePageExitTracking('login')

  const methods = useForm<LoginFormFieldValues>()

  const { handleSubmit } = methods

  const { mutate: login } = useLogin({
    onSuccessHandler: () => {
      setPlannerFormValues([])
      router.replace('/')
    },
  })

  // 로그인 하기
  const handleLogin = async (data: LoginFormFieldValues) => {
    trackEvent('login_attempt', {
      user_id: data.email,
    })

    setAmplitudeUserId(data.email)

    login(data)
  }

  // 회원가입 하기
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
                <Checkbox label="로그인 유지하기" name="isRememberMe" />
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
