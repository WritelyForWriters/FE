/**
 * 비밀번호 찾기 페이지
 * @author 선우
 */
import { FormProvider, useForm } from 'react-hook-form'

import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function FindPasswordPage() {
  const methods = useForm()

  return (
    <main className={cx('wrapper')}>
      <section className={cx('inner-container')}>
        <div className={cx('form-section')}>
          <FormProvider {...methods}>
            <form>
              <h3 className={cx('form-section__title')}>
                가입할 때 사용했던
                <br />
                이메일을 입력해 주세요
              </h3>
              <TextField
                name="email"
                label="이메일"
                options={{
                  required: true,
                }}
              />
            </form>
          </FormProvider>
        </div>
        <div className={cx('action-section')}></div>
      </section>
    </main>
  )
}
