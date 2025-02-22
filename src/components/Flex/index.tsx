import type { CSSProperties, ReactNode } from "react"

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    style?: CSSProperties
    children?: ReactNode
    if?: boolean
    justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly"
    align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline"
}
const Flex = (props: FlexProps) => {
  const {if: condition = true , style, ...restProps} = props
    const styles: CSSProperties = {
        display: "flex",
        justifyContent: props.justify,
        alignItems: props.align
    }
    if (!condition) return null
    return <div {...restProps} style={{...styles, ...style}}>{props.children}</div>
}
export default Flex
