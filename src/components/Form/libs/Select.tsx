import type { ReactNode } from "react";
import "../index.css"
interface Props {
    value?: number | string
    options?: Array<{label: ReactNode, value: number | string}>  
    onChange?: (value: number | string, index: number) => void
}
const Select = (props: Props) => {
    
    const handleChange = (e) => {
        const index = e.target.selectedIndex
        const value = e.target.value
        props.onChange?.(value, index)
    }
    return <select value={props.value} className="swagger-fields-generator_select" onChange={handleChange}>
        {props.options?.map((option, index) => <option key={index} value={option.value}>{option.label}</option>)}
    </select>
}
export default Select