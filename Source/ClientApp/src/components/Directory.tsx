import { useContext, useEffect, useRef, useState } from 'react'
import { Col, Dropdown, Form, FormInstance, Input, InputRef, Menu, Row, Select, Table } from 'antd';
import React from 'react';
import { DirectoryInfo } from '../bindings/directory';
import Column from 'antd/lib/table/Column';
import { TableRowSelection } from 'antd/lib/table/interface';
import './Directory.css'
import { DirectoryEvent } from '../bindings/events';
import { FileInfo } from '../bindings/file';
import { json } from 'stream/consumers';


// TODO: This component is wayyyy to full and needs to be refactored into smaller components. 
const Directory: React.FC<{ directoryPath: string }> = ({ directoryPath }) => {
    const [directoryValues, setDirectoryValues] = useState<DirectoryInfo[]>([]);
    const [editingKey, setEditingKey] = useState('');
    const [data, setData] = useState(directoryValues);
    const EditableContext = React.createContext<FormInstance<any> | null>(null);

    const Item = Menu.Item
    const menu = (value: string) =>
        <Menu>
            <Item key={value}>{value}</Item>
            <Item key={DirectoryEvent.Delete} onClick={() => onMenuItemClick(value, DirectoryEvent.Delete)}>{DirectoryEvent.Delete}</Item>
            <Item key={DirectoryEvent.Rename} onClick={() => onMenuItemClick(value, DirectoryEvent.Rename)}>{DirectoryEvent.Rename}</Item>
        </Menu>

    const onMenuItemClick = async (path: string, event: string) => {
        let response = await fetch(`http://localhost:9876/directory/${event.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path: path })
        });

        if (response.status === 200) {
            if (event === DirectoryEvent.Delete) handleDelete(path);
            //if (event === DirectoryEvent.Rename) handleEdit(path);
        }
        else {
            console.log("Something went wrong");
        }
    }

    //Temp Method until rename button is activated
    const handleRename = async (fromPath: string, toPath: string, event: string) => {
        let response = await fetch(`http://localhost:9876/directory/${event.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from_path: fromPath, to_path: toPath })
        });

        if (response.status === 200) {
            console.log("renamed!");
            //if (event === DirectoryEvent.Rename) handleEdit(path);
        }
        else {
            console.log("Something went wrong");
        }
    }



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

    /// Edit
    interface EditableRowProps {
        name: string;
    }

    const EditableRow: React.FC<EditableRowProps> = ({ name, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    interface EditableCellProps {
        title: React.ReactNode;
        editable: boolean;
        children: React.ReactNode;
        dataIndex: keyof DirectoryInfo;
        record: DirectoryInfo;
        handleSave: (record: DirectoryInfo) => void;
    }

    const EditableCell: React.FC<EditableCellProps> = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef<InputRef>(null);
        const form = useContext(EditableContext)!;

        useEffect(() => {
            if (editing) {
                inputRef.current!.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            console.log("record is: " + record)
            form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();

                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    type EditableTableProps = Parameters<typeof Table>[0];
    type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

    const handleSave = (row: DirectoryInfo | FileInfo) => {
        const newData = [...directoryValues];
        let item: DirectoryInfo | FileInfo;
        let index: number = newData.findIndex(item => row.path === item.path);
        if (index === -1) {
            for (let i = 0; i < newData.length; i++) {
                index = newData[i].files?.findIndex(item => row.path === item.path)!;
                if (index !== undefined && index > -1) {
                    item = newData[i].files![index];
                    newData[i].files!.splice(index, 1, {
                        ...item,
                        ...(row as FileInfo),
                    });
                    handleRename(item.name, row.name, DirectoryEvent.Rename)              
                    break;
                }
            }
        } else {    
            item = newData[index];
            handleRename(item.name, row.name, DirectoryEvent.Rename)          
            newData.splice(index, 1, {
                ...item,
                ...(row as DirectoryInfo),
              });
        }
        console.log(JSON.stringify(newData));
        setDirectoryValues(newData);
      };

     
      const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };
      
    // const handleEdit = (path: string) => {
    //     let editValue: DirectoryInfo | FileInfo | undefined = directoryValues.find(value => value.path === path);
    //     if (!editValue) {

    //         directoryValues.map(value => {
    //             let file = value.files?.find(file => file.name === path)
    //             if (file) {
    //                 editValue = file;
    //             }
    //         })
    //     }
    //     editValue ? edit(editValue) : null;
    // }

    return <div style={{ paddingTop: "2em" }}>
        <Row>
            <Col span={20}>
                    <Table
                        components={components}
                        childrenColumnName='files'
                        dataSource={directoryValues}
                        rowSelection={{ ...rowSelection }}
                        rowKey="name"
                    >

                        <Column title="Name" dataIndex="name" key="name" render={render} onCell={record => {
                            return {
                                record,
                                editable: true,
                                dataIndex: "name",
                                title: "Name",
                                handleSave,
                            }
                        }} />
                        <Column title="Size" dataIndex="size" key="size" render={render} />
                    </Table>
            </Col>
        </Row>
    </div>
}

export default Directory;