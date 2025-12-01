import type { ReactNode } from "react";
import Flex from "~components/Flex";
import './index.css'
interface FormItemProps {
    label?: ReactNode;
    width?: number;
    required?: boolean;
    children: ReactNode;
    direction?: 'row' | 'column';
}
const FormItem = (props: FormItemProps) => {
    return (
        <Flex gap={10} className="swagger-fields-generator_form-item" direction={props.direction || 'row'}>
            <label className={"swagger-fields-generator_label " + (props.required ? 'required' : '')} style={ props.direction === 'row' ? {flex: '0 0 ' + (props.width || 80) + 'px'} : {width: '100%'}}>{props.label}</label>
            {props.children}
        </Flex>
    )
}
export default FormItem
