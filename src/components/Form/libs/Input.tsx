
interface Props {
    value?: string | number
    onChange?: (value: string) => void
}
import '../index.css'
const Input = (props: Props) => {
    const handleChange = (e) => {
        props.onChange?.(e.target.value)
    }
    return (
        <input className='swagger-fields-generator_input' type="text" value={props.value || ''} onChange={handleChange} />
    )
}
export default Input