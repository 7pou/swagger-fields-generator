import type { ReactNode } from "react"

interface Column<T> {
    title: string
    dataIndex: string
    width?: number
    render?: (text: any, data: T, index: number) => ReactNode
}
interface Props<T = any> {
    columns: Column<T>[]
    dataSource: T[]
}
const Table = (props: Props) => {
    return (
        <div>
            <table border={1} cellSpacing={0} cellPadding={8} style={{borderCollapse: 'collapse', borderColor: '#f1f1f1', borderRadius: 10, width: '100%'}}>
                <thead style={{textAlign: 'left',backgroundColor: '#f5f5f5'}}>
                    <tr>
                        {props.columns.map((column) => <th key={column.dataIndex} style={{width: column.width}}>{column.title}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.dataSource.map((data,index) => <tr key={index}>
                        {props.columns.map((column) => <td key={column.dataIndex}>{column.render ? column.render(data[column.dataIndex],data, index) : data[column.dataIndex]}</td>)}
                    </tr>)}
                </tbody>
            </table>
            {props.dataSource?.length === 0 && <div style={{textAlign: 'center', color: '#999', padding: 20}}>暂无数据</div>}
        </div>
    )
}
export default Table