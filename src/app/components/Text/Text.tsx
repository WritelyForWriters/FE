import { AllHTMLAttributes, JSX, PropsWithChildren } from 'react'

// TODO: 디자인 시스템 나오면 다시 정의
interface BaseProps {
  fontWeight?: 400 | 500 | 600 | 700
  color?: string
  fontSize?: string
}

type Props<Element extends keyof JSX.IntrinsicElements = 'span'> = BaseProps & {
  as?: Element
} & Omit<AllHTMLAttributes<Element>, 'as'>

export default function Text({
  children,
  fontWeight,
  color,
  fontSize,
  as: Component = 'span',
}: PropsWithChildren<Props>) {
  return <Component style={{ fontWeight, color, fontSize }}>{children}</Component>
}
