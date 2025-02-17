import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import "./index.scss"
interface Props {
    title?: ReactNode
    footer?: ReactNode
    open?: boolean
    children?: ReactNode
}
const Modal = (props: Props) => {
    if (props.open) {
        return (
            createPortal(
                <div className="modal">
                    <div className="modal-content" style={{paddingBottom: !!props.footer ? 60 : 0}}>
                        {!!props.title && <div className="title">{props.title}</div>}
                        <div>{props.children}</div>
                        {!!props.footer && <div className="footer">{props.footer}</div>}
                    </div>
                </div>
                , document.body
            )
        )
    }
    return null
}

export default Modal