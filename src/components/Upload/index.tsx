import { useRef, type ChangeEventHandler } from "react"

interface UploadProps {
    accept?: string
    children?: React.ReactNode
    onChange?: (ev: React.ChangeEvent<HTMLInputElement>, reader: ProgressEvent<FileReader>) => void
}
const Upload = (props: UploadProps) => {
    const ref = useRef<HTMLInputElement>(null)
    const handleUpload = () => {
        ref.current?.click()
    }
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
        const file = ev.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                props.onChange && props.onChange(ev,e)
            }
            reader.readAsText(file)
        }
    }
    return <>
        <div style={{display: 'inline-block'}} onClick={handleUpload}>
            {props.children}
        </div>
        <input ref={ref} onChange={handleInputChange} style={{display:'none'}} type="file" accept={props.accept} />
    </>
}
export default Upload
