import { useEffect, useState } from 'react'
import { Col, Dropdown, Menu, Row, Table } from 'antd';
import React from 'react';
import { DirectoryInfo } from '../bindings/directory';
import Column from 'antd/lib/table/Column';
import { TableRowSelection } from 'antd/lib/table/interface';
import './Directory.css'
import { DirectoryEvent } from '../bindings/events';


const Directory: React.FC<{ directoryPath: string }> = ({ directoryPath }) => {
    const [directoryValues, setDirectoryValues] = useState<DirectoryInfo[]>([]);

    const Item = Menu.Item
    const menu = (value: string) =>
        <Menu>
            <Item key={value}>{value}</Item>
            <Item key={DirectoryEvent.Delete} onClick={() => onMenuItemClick(value, DirectoryEvent.Delete)}>{DirectoryEvent.Delete}</Item>
            <Item key={DirectoryEvent.Rename} onClick={() => onMenuItemClick(value, DirectoryEvent.Rename)}>{DirectoryEvent.Rename}</Item>
        </Menu>

    const render = (value: string) =>
        <Dropdown overlay={menu(value)} trigger={[`contextMenu`]}>
            <div>{value}</div>
        </Dropdown>

    const handleDelete = (key: React.Key) => {
        console.log(key.toString());
        let remove;
        directoryValues.map(directory => {
            remove = directory.files?.map(file => file.name).indexOf(key.toString());

            if (remove !== undefined && remove >= 0) {
                directory.files?.splice(remove, 1);
            }
        });
        const newValues = [...directoryValues];
        setDirectoryValues(newValues);
    };

    const onMenuItemClick = async (path: string, event: string) => {
        // alert(`${path}, ${event}`);
        let response = await fetch(`http://localhost:9876/directory/${event.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path: path })
        });

        if (response.status === 200) {
            handleDelete(path);
        }
        else {
            console.log("Something went wrong");
        }
        
    }

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
        fetch(`http://localhost:9876/directory/${encodeURIComponent(directoryPath)}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);                 
                    const dirArr: DirectoryInfo[] = result;
                    dirArr.map((dir) => dir.files?.forEach((file) => (file.size as any) = `${file.size}mb`))
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
                    rowKey="name"
                >
                    
                    <Column title="Name" dataIndex="name" key="name" render={render} />
                    <Column title="Size" dataIndex="size" key="size" render={render} />
                </Table>
            </Col>
        </Row>
    </div>
}

export default Directory;