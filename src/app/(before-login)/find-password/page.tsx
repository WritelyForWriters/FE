'use client'

/**
 * 비밀번호 찾기 페이지
 * @author 선우
 */
import Link from 'next/link'

import { AUTH_ERROR_MESSAGE } from 'constants/join/message'
import { AUTH_PATTERN } from 'constants/join/pattern'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { FormProvider, useForm } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import TextField from '@components/text-field/TextField'
import { useToast } from '@components/toast/ToastProvider'

import { sendChangePasswordToken } from './services/findPasswordService'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function FindPasswordPage() {
  const showToast = useToast()

  const methods = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
  })

  const { handleSubmit } = methods

  // 비밀번호 변경 링크 전송
  const handleSendToken = async (data: { email: string }) => {
    try {
      const result = await sendChangePasswordToken(data.email)

      if (result.code !== 'RESULT-001') {
        showToast('warning', result.message)
      } else {
        showToast('success', TOAST_MESSAGE.FIND_PASSWORD_COMPLETE)
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast('warning', error.message)
      }
    }
  }

  return (
    <main className={cx('wrapper')}>
      <FormProvider {...methods}>
        <form className={cx('form')} onSubmit={handleSubmit(handleSendToken)}>
          <section className={cx('form__input-section')}>
            <h3 className={cx('form__input-section__title')}>
              가입할 때 사용했던
              <br />
              이메일을 입력해 주세요
            </h3>
            <TextField
              name="email"
              label="이메일"
              options={{
                required: true,
                pattern: {
                  value: AUTH_PATTERN.EMAIL,
                  message: AUTH_ERROR_MESSAGE.EMAIL_PATTERN,
                },
              }}
            />
          </section>
          <section className={cx('form__action-section')}>
            <FillButton type="submit" size="large">
              비밀번호 변경 링크 받기
            </FillButton>
            <div className={cx('form__action-section__login-btn')}>
              <Link href="/login">
                <TextButton type="button" size="small">
                  로그인으로 돌아가기
                </TextButton>
              </Link>
            </div>
          </section>
        </form>
      </FormProvider>
    </main>
  )
}
