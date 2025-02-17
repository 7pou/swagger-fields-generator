import type { CSSProperties, ReactNode } from "react"

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    type?: 'ghost' | 'primary' | 'link'
    size?: 'small' | 'default' | 'large'
    disabled?: boolean
    children?: ReactNode
}
const Button = (props: Props) => {
    const {type, children, style, ...restProps} = props
    const styles: CSSProperties = {
        outline: 'none',
        border: 'none',
        padding: '5px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    }
    if (props.disabled) {
        styles.opacity = 0.5
    }
    if (type === 'primary' || !type) {
        styles.backgroundColor = '#1677ff'
        styles.border = '1px solid #fff'
        styles.color = '#fff'
    }
    if (type === 'ghost') {
        styles.backgroundColor = '#fff'
        styles.color = '#1677ff'
        styles.border = '1px solid #1677ff'
        styles.boxSizing = 'border-box'
    }
    if (type === 'link') {
        styles.backgroundColor = 'transparent'
        styles.color = '#1677ff'
        styles.padding = 0
    }
    if (props.size === 'small') {
        styles.fontSize = '12px'
        styles.padding = '2px 7px'
    }
    if (props.size === 'large') {
        styles.fontSize = '16px'
        styles.padding = '10px 20px'
    }
    
    return <button style={{...styles, ...style}} {...restProps}>{children}</button>
}
export default Button