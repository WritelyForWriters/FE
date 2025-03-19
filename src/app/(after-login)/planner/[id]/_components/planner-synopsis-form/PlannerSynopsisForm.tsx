import Dropdown from '@components/dropdown/Dropdown'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerSynopsisForm() {
  return (
    <div className={cx('synopsis-form')}>
      <div className={cx('synopsis-form__title')}>시놉시스</div>
      <Dropdown
        name="synopsis.genre"
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
        name="synopsis.length"
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
      <TextField name="synopsis.purpose" label="기획 의도" />
      <TextField
        name="synopsis.logline"
        label="로그 라인"
        options={{ required: { value: true, message: 'required' } }}
      />
      <TextField name="synopsis.example" label="예시 문장" />
    </div>
  )
}
