import { InputHTMLAttributes, ReactNode, createContext, useContext } from 'react'

const TextFieldContext = createContext({
  name: '',
  type: 'text',
})

interface TextFieldProps {
  name: string
  children: ReactNode
  type?: string
}

export default function TextField({ name, children, type = 'text' }: TextFieldProps) {
  const contextValue = { name: name, type }

  return <TextFieldContext.Provider value={contextValue}>{children}</TextFieldContext.Provider>
}

interface TextFieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function TextFieldInput({ label, error, ...props }: TextFieldInputProps) {
  const { name, type } = useContext(TextFieldContext)
  return (
    <div>
      <fieldset>
        <legend>{label}</legend>
        <input id={name} type={type} {...props} />
      </fieldset>
      {error && <span>{error}</span>}
    </div>
  )
}

TextField.Input = TextFieldInput
