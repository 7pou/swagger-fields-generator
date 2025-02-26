import { useState, type ReactNode } from "react"
import Card from "~components/Card"
import Flex from "~components/Flex"
interface Props {
  title?: ReactNode
  children?: ReactNode
  onToggle?: (isOpen: boolean) => void
}
const Collapse = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentStyle = {
    display: isOpen ? 'block' : 'none',
    borderTop: '1px solid #eee',
    marginTop: 6,
    paddingTop: 10,
    color: '#666',
  }
  const handleToggle = () => {
    props.onToggle && props.onToggle(!isOpen)
    setIsOpen(!isOpen)
  }
  return (
    <Card>
      <Flex justify="space-between" style={{cursor: 'pointer', fontSize: 15}} onClick={handleToggle}>
        <div style={{textAlign: 'left'}}>{props.title}</div>
        <div >
          {isOpen ? <i className="iconfont icon-down"></i> : <i className="iconfont icon-right"></i>}
        </div>
      </Flex>
      <div style={contentStyle}>{props.children}</div>
    </Card>
  )
}
export default Collapse
