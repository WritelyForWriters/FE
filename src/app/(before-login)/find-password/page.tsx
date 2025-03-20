'use client'

/**
 * 비밀번호 찾기 페이지
 * @author 선우
 */
import Link from 'next/link'

import { FormProvider, useForm } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

interface FindPasswordFormValue {
  email: string
}

export default function FindPasswordPage() {
  const methods = useForm<FindPasswordFormValue>({
    defaultValues: {
      email: '',
    },
  })

  const { handleSubmit } = methods

  // 비밀번호 변경 링크 받기
  const sendPasswordResetLink = (data: FindPasswordFormValue) => {
    console.log(data)
  }

  return (
    <main className={cx('wrapper')}>
      <FormProvider {...methods}>
        <form className={cx('form')} onSubmit={handleSubmit(sendPasswordResetLink)}>
          <section className={cx('form__input-section')}>
            <h3 className={cx('form__input-section__title')}>
              가입할 때 사용했던
              <br />
              이메일을 입력해 주세요
            </h3>
            <TextField
              name="email"
              label="이메일"
              // TODO: 타 브랜치 머지 후 수정
              options={{
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '이메일 주소를 정확히 입력해 주세요.',
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
