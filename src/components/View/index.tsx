import type { ReactNode } from "react"

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
    if?: boolean
    children?: ReactNode
}
   
const View = ({ if: condition = true, children, ...rest }: ViewProps) => {
    if (!condition) return null;
    return <div {...rest}>{children}</div>;
};
export default View