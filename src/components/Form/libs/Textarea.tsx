
interface Props {
    value?: string
    onChange?: (value: string) => void
}
import '../index.css'
const Textarea = (props: Props) => {
    const handleChange = (e) => {
        props.onChange?.(e.target.value)
    }
    return (
        <textarea className='swagger-fields-generator_textarea' value={props.value} onChange={handleChange} />
    )
}
export default Textarea