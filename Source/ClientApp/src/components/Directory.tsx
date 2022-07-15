import { useContext, useEffect, useState } from 'react'
import { Col, Progress, Row, Space, Table, Tag } from 'antd';
import { DiskInfo } from '../bindings/disk';
import React from 'react';
import { DiskContext } from '../App';
import { DirectoryInfo } from '../bindings/directory';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';


const Directory: React.FC<{ directoryPath: string }> = ({ directoryPath }) => {
    const [directoryValues, setDirectoryValues] = useState<DirectoryInfo[]>([]);

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
                <Table dataSource={directoryValues}  
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0, textAlign: "center" }}>{record.files?.map(x => x.name)}</p>,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}>
                    <Column title="Directory" dataIndex="name" key="name" />
                    <Column title="Size" dataIndex="size" key="size" />                    
                </Table>
                {/* <h2>Directory</h2>
        <p>{directoryValues?.name + "\n"}</p>
        <p>{directoryValues?.path + "\n"}</p>
        <p>{directoryValues?.files ? directoryValues?.files?.toString() + "\n" : null}</p>
        <p>{directoryValues?.size + "\n"}</p> */}
            </Col>
        </Row>
    </div>
}

export default Directory;