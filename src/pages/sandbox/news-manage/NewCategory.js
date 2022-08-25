import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Form, Input } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios'
import confirmMethod from "../../../utils/cofirmDeleteMethod"

const EditableContext = React.createContext(null);

export default function NewCategory() {

    // 指定表格的数据源
    const [dataSource, setDataSource] = useState([])

    // 挂载后请求表格的数据源
    useEffect(() => {
        axios.get('/categories').then(res => {
            const list = res.data
            setDataSource(list)
        })
    }, [])

    // 可编辑单元格的保存回调
    const handleSave = (record) => {
        // 1.遍历数据，找到修改的那条，然后重新设置title和value
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.value
                }
            }
            // 未修改的直接返回即可
            return item
        }));
        // 2.通知数据库根据id同步修改后的最新数据
        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.value
        })
    }

    // 表格的标题
    const columns = [
        // dataIndex的值要和后端对应的key相同
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            // 可编辑单元格
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: 'title',
                handleSave: handleSave,
            })
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        {/* 删除按钮 */}
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                            onClick={() => confirmMethod(item, deleteMethod)} />
                    </div>
                )
            }
        }
    ];


    // 删除-确定方法
    // const confirmMethod = (item) => {
    //     // 调用Modal对话框的Modal.confirm方法
    //     confirm({
    //         title: '确定要删除吗?',
    //         icon: <ExclamationCircleOutlined />,//自定义图标
    //         okText: '确认',//确认按钮文字
    //         cancelText: '取消',//设置 Modal.confirm 取消按钮文字
    //         content: '温馨提示：删除操作不可撤销',
    //         onOk() {
    //             deleteMethod(item)
    //         },//点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
    //         onCancel() {
    //         },//取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
    //     });
    // }

    // 删除-确定-删除方法
    const deleteMethod = (item) => {
        // 过滤掉删除的项，更新页面显示
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 通知数据库删除
        axios.delete(`/categories/${item.id}`)
    }

    // 可编辑行
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    // 可编辑单元格
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
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
                    style={{
                        margin: 0,
                    }}
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
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };



    return (
        <div>
            {/* 
                dataSource:数据数组
                columns:表格列的配置描述，具体项见下表
                pagination:分页器，设为 false 时不展示和进行分页。每页条数：pageSize:5
                树形数据展示：当数据中有children字段时会自动展示为树形表格
            */}
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5 }} rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
            />

        </div>
    )
}
