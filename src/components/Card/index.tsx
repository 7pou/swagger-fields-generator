import type { ReactNode } from "react";
import Flex from "~components/Flex";

interface Props {
    children: ReactNode;
    title?: ReactNode;
    action?: ReactNode;
}
const Card = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 4,
      marginBottom: 16,
    }}
  >
    <Flex justify="space-between" style={{paddingBottom: 10}}>
        {props.title && <div style={{fontWeight: 'bold', fontSize: '1.3em'}}>{props.title}</div>}
        {props.action && <div>{props.action}</div>}
    </Flex>
    {props.children}
  </div>
);
export default Card;