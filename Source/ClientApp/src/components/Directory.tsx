import { useEffect, useState } from 'react'
import { Col, Row, Table } from 'antd';
import React from 'react';
import { DirectoryInfo } from '../bindings/directory';
import Column from 'antd/lib/table/Column';
import { TableRowSelection } from 'antd/lib/table/interface';
import ContextEventMenu, { MenuEvent } from './ContextEventMenu';
import './Directory.css'

const Directory: React.FC<{ directoryPath: string }> = ({ directoryPath }) => {
    const [directoryValues, setDirectoryValues] = useState<DirectoryInfo[]>([]);

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


    return <div style={{ paddingTop: "2em" }} id="directoryDataTable" className="directoryDataTable">
         <ContextEventMenu
          targetId='directoryDataTable'
          options={[MenuEvent.Delete, MenuEvent.Update]}
          classes={{
            listWrapper: 'directoryDataTableListWrapper',
            listItem: 'directoryDataTableListItem'
          }}
        />
        <Row>
            <Col span={20}>
                <Table 
                    childrenColumnName='files'
                    dataSource={directoryValues}
                    rowSelection={{ ...rowSelection}}
                >
                    <Column title="Directory" dataIndex="name" key="name" />
                    <Column title="Size" dataIndex="size" key="size" />                    
                </Table>
            </Col>
        </Row>
    </div>
}

export default Directory;