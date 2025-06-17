'use client'

import { ReactNode } from 'react'

import { DefaultValues, FieldValues, FormProvider, useForm } from 'react-hook-form'

interface FormWrapperProps<T> {
  children: ReactNode
  onSubmit: (data: T) => Promise<void>
  defaultValues?: DefaultValues<T>
  className?: string
}

export default function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({ defaultValues })

  const handleSubmit = methods.handleSubmit(async (data: T) => {
    await onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}
