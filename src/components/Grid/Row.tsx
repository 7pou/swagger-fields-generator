
const Row = (props: any) => {
    const styles = {
        display: 'flex'
    }
    return (
        <div style={styles}>
            {props.children}
        </div>
    )
}
export default Row