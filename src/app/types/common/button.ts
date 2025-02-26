import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonShapeType = 'square' | 'pill'
export type ButtonVariantType = 'primary' | 'secondary'
export type ButtonIconPositionType = 'leading' | 'trailing' | 'only'
export type ButtonSizeType = 'large' | 'medium' | 'small' | 'xsmall'
export type ButtonPropsBase = {
  size: Exclude<ButtonSizeType, 'xsmall'>
  shape?: ButtonShapeType
  variant?: ButtonVariantType
} & ButtonHTMLAttributes<HTMLButtonElement> &
  (
    | {
        // 아이콘 + 텍스트
        iconPosition: ButtonIconPositionType
        iconType: ReactNode
        children: ReactNode
      }
    | {
        // 단일 아이콘
        iconPosition: ButtonIconPositionType
        iconType: ReactNode
        children?: never
      }
    | {
        // 단일 텍스트
        iconPosition?: never
        iconType?: never
        children: ReactNode
      }
  )
