'use client'

/**
 * 로그인 페이지
 * @author 선우
 */
import { FormProvider, useForm } from 'react-hook-form'
import { login } from 'service/auth/auth'
import { LoginFormFieldValues } from 'types/auth/join'

import FillButton from '@components/buttons/FillButton'
import OutLinedButton from '@components/buttons/OutLinedButton'
import TextButton from '@components/buttons/TextButton'
import Checkbox from '@components/checkbox/Checkbox'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function LoginPage() {
  const methods = useForm<LoginFormFieldValues>()

  const { handleSubmit } = methods

  // 로그인 하기
  const handleLogin = async (data: LoginFormFieldValues) => {
    const { email, password } = data

    const result = await login({ email, password })
    console.log(result)
  }

  // 로그인 유지하기
  const handleRememberMe = async () => {}

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
                <Checkbox label="로그인 유지하기" name="rememberMe" onChange={handleRememberMe} />
              </div>
            </form>
          </FormProvider>
        </section>
        <section className={cx('btn-section')}>
          <FillButton type="submit" size="large" onClick={handleSubmit(handleLogin)}>
            로그인
          </FillButton>
          <OutLinedButton type="button" size="large">
            회원가입
          </OutLinedButton>
          <div className={cx('btn-section__find-password')}>
            <TextButton type="button" size="small">
              비밀번호 찾기
            </TextButton>
          </div>
        </section>
      </div>
    </main>
  )
}
