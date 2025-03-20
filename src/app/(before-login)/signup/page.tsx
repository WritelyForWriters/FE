'use client'

/**
 * 회원가입 페이지
 * @author 선우
 */
import Link from 'next/link'

import { AUTH_ERROR_MESSAGE } from 'constants/signup/message'
import { AUTH_PATTERN } from 'constants/signup/pattern'
import { FormProvider, useForm } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import CheckboxGroup from '@components/checkbox-group/CheckboxGroup'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

interface SignUpFormValue {
  email: string
  nickname: string
  password: string
  confirmPassword: string
  allAgree: boolean
  termsOfService: boolean
  privacyPolicy: boolean
  marketingConsent: boolean
}

export default function SignupPage() {
  const methods = useForm<SignUpFormValue>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      allAgree: false,
      termsOfService: false,
      privacyPolicy: false,
      marketingConsent: false,
    },
  })

  const { handleSubmit, setError, watch, trigger } = methods

  // 이메일 중복 검사
  const checkEmailDuplication = () => {
    return true
  }

  // 회원가입
  const handleSignup = (data: SignUpFormValue) => {
    if (!data.termsOfService || !data.privacyPolicy) {
      setError('allAgree', {
        type: 'manual',
        message: AUTH_ERROR_MESSAGE.TERMS_AGREEMENT_REQUIRED,
      })

      return
    }
  }

  return (
    <main className={cx('wrapper')}>
      <FormProvider {...methods}>
        <form className={cx('form')} onSubmit={handleSubmit(handleSignup)}>
          <section className={cx('form__input-section')}>
            <h3 className={cx('form__input-section--title')}>
              라이틀리를
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
                  validate: checkEmailDuplication,
                }}
              />
              <TextField name="nickname" label="닉네임" options={{ required: true }} />
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
                },
                {
                  name: 'privacyPolicy',
                  label: '(필수) 개인정보처리방침',
                },
                {
                  name: 'marketingConsent',
                  label: '(선택) 마케팅 메시지 수신',
                },
              ]}
              checkboxWrapperClassName={cx('form__action-section--checkboxes')}
            />
            <div className={cx('form__action-section--buttons')}>
              <FillButton size="large">회원가입</FillButton>
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
