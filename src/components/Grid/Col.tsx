import type { ReactNode } from "react"

interface Props {
    span?: number  
    offset?: number
    children?: ReactNode 
}
const span = 24
const Col = (props: Props) => {
    const span2ratio = (v) => `${v / span * 100}%`
    const styles = {
        width: span2ratio(props.span || 24),
        marginLeft: span2ratio(props.offset),
    }
    return (
        <div style={styles}>{props.children}</div>
    )
}
export default Col