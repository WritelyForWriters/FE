'use client'

/**
 * 비밀번호 변경 페이지
 * @author 선우
 */
import { useParams } from 'next/navigation'

import { AUTH_ERROR_MESSAGE } from 'constants/signup/message'
import { AUTH_PATTERN } from 'constants/signup/pattern'
import { FormProvider, useForm } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

interface ResetPasswordFormValues {
  password: string
  confirmPassword: string
}

export default function ResetPassword() {
  const params = useParams<{ token: string }>()

  const methods = useForm<ResetPasswordFormValues>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { handleSubmit, trigger, watch } = methods

  const changePasswordToken = params?.token

  const handleChangePassword = (data: ResetPasswordFormValues) => {
    const password = data.password
    console.log(`changePasswordToken: ${changePasswordToken}, password: ${password}`)
  }

  return (
    <main className={cx('wrapper')}>
      <FormProvider {...methods}>
        <form className={cx('form')} onSubmit={handleSubmit(handleChangePassword)}>
          <section className={cx('form__input-section')}>
            <h3 className={cx('form__input-section__title')}>
              새로운 비밀번호를
              <br />
              입력해 주세요
            </h3>
            <div className={cx('form__input-section__inputs')}>
              <TextField
                name="password"
                label="새 비밀번호"
                variant="password"
                options={{
                  required: true,
                  onChange: () => trigger('confirmPassword'),
                  pattern: {
                    value: AUTH_PATTERN.PASSWORD,
                    message: AUTH_ERROR_MESSAGE.PASSWORD_PATTERN,
                  },
                }}
              />
              <TextField
                name="confirmPassword"
                label="새 비밀번호 확인"
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
          <FillButton type="submit" size="large">
            확인
          </FillButton>
        </form>
      </FormProvider>
    </main>
  )
}
