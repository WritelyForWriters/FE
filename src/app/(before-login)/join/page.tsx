'use client'

/**
 * 회원가입 페이지
 * @author 선우
 */
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { AUTH_ERROR_MESSAGE } from 'constants/join/message'
import { AUTH_PATTERN } from 'constants/join/pattern'
import { TERMS_URLS } from 'constants/join/urls'
import { useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { FormProvider, useForm } from 'react-hook-form'
import { isCompleteJoinAtom } from 'store/isCompleteJoinAtom'
import { JoinFormFieldValues, Terms } from 'types/auth/auth'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import CheckboxGroup from '@components/checkbox-group/CheckboxGroup'
import TextField from '@components/text-field/TextField'

import { usePageExitTracking } from '@hooks/amplitude/usePageExitTracking'
import { useJoin } from '@hooks/index'

import { checkValueDuplicate } from './../../api/auth/Auth'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function JoinPage() {
  const router = useRouter()
  const setIsCompleteJoin = useSetAtom(isCompleteJoinAtom)

  useEffect(() => {
    trackEvent('page_view', {
      page_name: 'signup',
    })
  }, [])

  usePageExitTracking('signup')

  const methods = useForm<JoinFormFieldValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      allAgree: false,
      termsOfService: false,
      privacyPolicy: false,
      marketingReceive: false,
    },
  })

  const { handleSubmit, setError, watch, trigger } = methods

  const { mutate, isPending } = useJoin({
    onSuccessHandler: () => {
      trackEvent('signup_start', {
        referrer: document.referrer,
      })
      setIsCompleteJoin(true)
      router.replace('/')
    },
  })

  // 중복 검사
  const validateValueDuplicate = async (type: 'email' | 'nickname', value: string) => {
    const { exists } = await checkValueDuplicate(type, value)

    if (exists) {
      return type === 'email'
        ? AUTH_ERROR_MESSAGE.EMAIL_DUPLICATE
        : AUTH_ERROR_MESSAGE.NICKNAME_DUPLICATE
    } else {
      return true
    }
  }

  // 회원가입
  const handleJoin = async (data: JoinFormFieldValues) => {
    if (!data.termsOfService || !data.privacyPolicy) {
      setError('allAgree', {
        type: 'manual',
        message: AUTH_ERROR_MESSAGE.TERMS_AGREEMENT_REQUIRED,
      })
      return
    }

    const { email, password, nickname, privacyPolicy, marketingReceive, termsOfService } = data

    const termsList = [
      { termsCd: Terms.PRIVACY_POLICY, isAgreed: privacyPolicy },
      { termsCd: Terms.MARKETING_RECEIVE, isAgreed: marketingReceive },
      { termsCd: Terms.TERMS_OF_SERVICE, isAgreed: termsOfService },
    ]

    mutate({ email, password, nickname, termsList })
  }

  return (
    <main className={cx('wrapper')}>
      <FormProvider {...methods}>
        <form className={cx('form')} onSubmit={handleSubmit(handleJoin)}>
          <section className={cx('form__input-section')}>
            <h3 className={cx('form__input-section--title')}>
              라이트온을
              <br />
              시작해볼까요?
            </h3>
            <div className={cx('form__input-section--inputs')}>
              <TextField
                name="email"
                label="이메일"
                options={{
                  required: true,
                  pattern: {
                    value: AUTH_PATTERN.EMAIL,
                    message: AUTH_ERROR_MESSAGE.EMAIL_PATTERN,
                  },
                  validate: (value) => validateValueDuplicate('email', value),
                }}
              />
              <TextField
                name="nickname"
                label="닉네임"
                options={{
                  required: true,
                  pattern: {
                    value: AUTH_PATTERN.NICKNAME,
                    message: AUTH_ERROR_MESSAGE.NICKNAME_PATTERN,
                  },
                  validate: (value) => validateValueDuplicate('nickname', value),
                }}
              />
              <TextField
                name="password"
                label="비밀번호"
                variant="password"
                options={{
                  required: true,
                  pattern: {
                    value: AUTH_PATTERN.PASSWORD,
                    message: AUTH_ERROR_MESSAGE.PASSWORD_PATTERN,
                  },
                  onChange: () => trigger('confirmPassword'),
                }}
              />
              <TextField
                name="confirmPassword"
                label="비밀번호 확인"
                variant="password"
                options={{
                  required: true,
                  validate: (value) => {
                    if (value !== watch('password')) {
                      return AUTH_ERROR_MESSAGE.PASSWORD_NOT_MATCH
                    }
                  },
                }}
              />
            </div>
          </section>
          <section className={cx('form__action-section')}>
            <CheckboxGroup
              checkAllCheckbox={{
                name: 'allAgree',
                label: '전체 동의',
              }}
              checkboxes={[
                {
                  name: 'termsOfService',
                  label: '(필수) 이용약관',
                  handleLabelClick: () => window.open(TERMS_URLS.TERMS_OF_SERVICE, '_blank'),
                },
                {
                  name: 'privacyPolicy',
                  label: '(필수) 개인정보처리방침',
                  handleLabelClick: () => window.open(TERMS_URLS.PRIVACY_POLICY, '_blank'),
                },
                {
                  name: 'marketingReceive',
                  label: '(선택) 마케팅 메시지 수신',
                },
              ]}
              checkboxWrapperClassName={cx('form__action-section--checkboxes')}
            />
            <div className={cx('form__action-section--buttons')}>
              <FillButton size="large" disabled={isPending}>
                회원가입
              </FillButton>
              <div className={cx('form__action-section--login-btn')}>
                <Link href="/login">
                  <TextButton size="small">로그인으로 돌아가기</TextButton>
                </Link>
              </div>
            </div>
          </section>
        </form>
      </FormProvider>
    </main>
  )
}
