import { HTMLAttributes } from 'react'

import Text from '@components/Text/Text'

export default function TextButton({ children, ...rest }: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest}>
      <Text fontWeight={500} color="#1A1A1A" fontSize="14px">
        {children}
      </Text>
    </button>
  )
}
