import "../index.css"

interface Props {
  disabled?: boolean
  value?: string | number
  onChange?: (value: string) => void
}

const Input = (props: Props) => {
  const handleChange = (e) => {
    props.onChange?.(e.target.value)
  }
  return (
    <input
      disabled={props.disabled}
      className="swagger-fields-generator_input"
      type="text"
      value={props.value || ""}
      onChange={handleChange}
    />
  )
}
export default Input
