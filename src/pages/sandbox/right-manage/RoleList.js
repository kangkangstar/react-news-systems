import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal

export default function RoleList() {
    // 表格数据
    const [dataSource, setDataSource] = useState([])
    // 权限数据
    const [rightList, setRightList] = useState([])
    // 当前点击的角色的权限和id
    const [currentRights, setCurrentRights] = useState([])
    const [currentID, setCurrentID] = useState(0)
    // 设置Modal显示或隐藏
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 请求角色列表--dataSource数据
    useEffect(() => {
        axios.get('/roles').then(res => {
            setDataSource(res.data);
        })
    }, [])

    // 请求权限列表--rightList数据
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setRightList(res.data);
        })
    }, [])

    // 表格标题
    const columns = [
        // dataIndex要和后端对应的key相同
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            render: (roleName) => {
                return <span>{roleName}</span>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        {/* 删除按钮 */}
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                        {/* 权限分配按钮 */}
                        {/*  setCurrentRights(item.rights) //初始化当前角色的rights */}
                        <Button type="primary" shape="circle" icon={<UnorderedListOutlined />}
                            onClick={() => {
                                setIsModalVisible(true)
                                setCurrentRights(item.rights)
                                setCurrentID(item.id)
                            }} />
                    </div>
                )

            }
        }

    ]

    // 删除-确定方法
    const confirmMethod = (item) => {
        confirm({
            title: '确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    // 删除方法
    const deleteMethod = (item) => {
        // 更新页面显示,过滤掉删除的项
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 通知数据库删除
        axios.delete(`/roles/${item.id}`)
    }

    //  Moldal权限分配【取消】的回调--关闭模态框
    const handleCancel = () => {
        setIsModalVisible(false);//模态框不可见
    };

    // Moldal权限分配【确认】的回调
    const handleOk = () => {
        setIsModalVisible(false);//模态框不可见
        // 同步dataSource
        setDataSource(dataSource.map((item) => {
            if (item.id === currentID) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        // 通知数据库更新角色权限
        axios.patch(`/roles/${currentID}`, {
            rights: currentRights
        })
    };

    //  Moldal权限分配【树形控件】的回调--点击复选框触发
    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked)
    };


    return (
        <div>
            {/* rowKey:表格行 key 的取值，可以是字符串或一个函数 */}
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
            {/* 
               visible ：对话框是否可见
               通过modal内嵌tree结构实现编辑按钮的响应布局
            */}
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认"
                cancelText="取消">
                {/*  
                    checkStrictly：（父子节点选中状态不再关联）方便初始化渲染角色的rights
                    checkedKeys：（受控）选中复选框的树节点，当前角色默认选中的rights
                    onCheck：选中项的节点信息，点击复选框触发
                    treeData：tree全部的rights数据  
                 */}
                <Tree
                    checkable
                    checkStrictly
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
