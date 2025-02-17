import type { CSSProperties, ReactNode } from "react"

export interface FlexProps {
    className?: string
    style?: CSSProperties
    children?: ReactNode
    justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly"
    align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
}
const Flex = (props: FlexProps) => {
    const styles: CSSProperties = {
        display: "flex",
        justifyContent: props.justify,
        alignItems: props.align
    }
    return <div style={{...styles, ...props.style}} className={props.className}>{props.children}</div>
}
export default Flex