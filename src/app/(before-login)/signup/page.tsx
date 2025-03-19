'use client'

/**
 * 회원가입 페이지
 * @author 선우
 */
import Link from 'next/link'

import { useEffect } from 'react'

import { AUTH_ERROR_MESSAGE } from 'constants/signup/message'
import { AUTH_PATTERN } from 'constants/signup/pattern'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import CheckboxGroup from '@components/checkbox-group/CheckboxGroup'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function SignupPage() {
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      'confirm-password': '',
      'all-agree': '',
    },
  })

  const { handleSubmit, watch, setError, clearErrors } = methods

  const password = watch('password')
  const confirmPassword = watch('confirm-password')

  // 이메일 중복 검사
  const checkEmailDuplication = () => {
    return true
  }

  // 비밀번호 일치 여부 검사
  useEffect(() => {
    if (password && confirmPassword && confirmPassword !== password) {
      setError('confirm-password', {
        type: 'manual',
        message: AUTH_ERROR_MESSAGE.PASSWORD_NOT_MATCH,
      })
    } else {
      clearErrors('confirm-password')
    }
  }, [password, confirmPassword])

  // 회원가입
  const handleSignup = (data: FieldValues) => {
    if (!data['terms-of-service'] && !data['privacy-policy']) {
      setError('all-agree', {
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
                }}
              />
              <TextField
                name="confirm-password"
                label="비밀번호 확인"
                variant="password"
                options={{
                  required: true,
                  pattern: {
                    value: AUTH_PATTERN.PASSWORD,
                    message: AUTH_ERROR_MESSAGE.PASSWORD_PATTERN,
                  },
                  validate: (value) => {
                    if (value !== password) {
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
                name: 'all-agree',
                label: '전체 동의',
              }}
              checkboxes={[
                {
                  name: 'terms-of-service',
                  label: '(필수) 이용약관',
                },
                {
                  name: 'privacy-policy',
                  label: '(필수) 개인정보처리방침',
                },
                {
                  name: 'marketing-consent',
                  label: '(선택) 마케팅 메시지 수신',
                },
              ]}
              checkboxWrapperClassName={cx('form__action-section--checkboxes')}
              helperText={AUTH_ERROR_MESSAGE.TERMS_AGREEMENT_REQUIRED}
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
