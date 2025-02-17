import type { ReactNode } from "react";
import Flex from "~components/Flex";
import './index.css'
interface FormItemProps {
    label?: ReactNode;
    width?: number;
    required?: boolean;
    children: ReactNode
}
const FormItem = (props: FormItemProps) => {
    return (
        <Flex className="swagger-fields-generator_form-item">
            <label className={"swagger-fields-generator_label " + (props.required ? 'required' : '')} style={{flex: '0 0 ' + (props.width || 80) + 'px'}}>{props.label}</label>
            {props.children}
        </Flex>
    )
}
export default FormItem