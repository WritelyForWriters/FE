'use client'

import Dropdown from '@components/dropdown/Dropdown'
import FormWrapper from '@components/form-wrapper/FormWrapper'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsysForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerSynopsysForm() {
  return (
    <div className={cx('synopsys-form-wrapper')}>
      <FormWrapper onSubmit={async () => {}}>
        <div className={cx('synopsys-form')}>
          <div className={cx('synopsys-form__title')}>시놉시스</div>
          <Dropdown
            name="장르"
            type="outlined"
            placeholder="장르"
            label="장르"
            options={[
              {
                label: '장르1',
                value: '1',
              },
              {
                label: '장르2',
                value: '2',
              },
            ]}
            rules={{
              required: {
                value: true,
                message: '필수 입력 사항입니다.',
              },
            }}
            isRequired={true}
          />
          <Dropdown
            name="분량"
            type="outlined"
            placeholder="분량"
            label="분량"
            options={[
              {
                label: '분량1',
                value: '1',
              },
              {
                label: '분량2',
                value: '2',
              },
            ]}
            isRequired={false}
          />
          <TextField name="기획 의도" label="기획 의도" />
          <TextField
            name="로그 라인"
            label="로그 라인"
            options={{ required: { value: true, message: 'required' } }}
          />
          <TextField name="예시 문장" label="예시 문장" />
        </div>
      </FormWrapper>
    </div>
  )
}
