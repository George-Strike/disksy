import { useEffect, useState } from 'react'
import { Col, Dropdown, Menu, Row, Table } from 'antd';
import React from 'react';
import { DirectoryInfo } from '../bindings/directory';
import Column from 'antd/lib/table/Column';
import { TableRowSelection } from 'antd/lib/table/interface';


const Directory: React.FC<{ directoryPath: string }> = ({ directoryPath }) => {
    const [directoryValues, setDirectoryValues] = useState<DirectoryInfo[]>([]);

    const Item = Menu.Item
    const menu = (value: any) =>
        <Menu>
            <Item>{value}</Item>
            <Item>Like it</Item>
            <Item>Bookmark</Item>
        </Menu>

    const render = (value: any) =>
        <Dropdown overlay={menu(value)} trigger={[`contextMenu`]}>
            <div>{value}</div>
        </Dropdown>

    const rowSelection: TableRowSelection<DirectoryInfo> = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record: any, selected: any, selectedRows: any) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
            console.log(selected, selectedRows, changeRows);
        },
    };


    const getData = () => {
        fetch(`http://localhost:9876/directory/${directoryPath}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    const dirArr: DirectoryInfo[] = [result]
                    setDirectoryValues(dirArr);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    useEffect(() => {
        getData()

    }, []);


    return <div style={{ paddingTop: "2em" }}>
        <Row>
            <Col span={20}>
                <Table
                    childrenColumnName='files'
                    dataSource={directoryValues}
                    rowSelection={{ ...rowSelection }}
                >
                    <Column title="Directory" dataIndex="name" key="name" render={render} />
                    <Column title="Size" dataIndex="size" key="size" render={render} />
                </Table>
            </Col>
        </Row>
    </div>
}

export default Directory;