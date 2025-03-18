'use client'

/**
 * 로그인 페이지
 * @author 선우
 */
import { FieldValues, FormProvider, useForm } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import Checkbox from '@components/checkbox/Checkbox'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function LoginPage() {
  const methods = useForm()

  const { handleSubmit } = methods

  // 로그인 하기
  const handleLogin = (data: FieldValues) => {
    console.log(data)
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
          <FillButton size="large" onClick={handleSubmit(handleLogin)}>
            로그인
          </FillButton>
          {/* NOTE(선우)
            - Outlined 버튼은 공통 컴포넌트에 정의되어 있지 않아 디자이너분께 문의드린 상황입니다.
            */}
          <FillButton size="large">회원가입 하기</FillButton>
          <TextButton size="small">비밀번호 찾기</TextButton>
        </section>
      </div>
    </main>
  )
}
