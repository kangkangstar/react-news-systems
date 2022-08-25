import React, { useEffect, useState } from 'react'
import { Table, Button, notification } from 'antd'
import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import axios from 'axios'
import confirmMethod from "../../../utils/cofirmDeleteMethod"
import { useNavigate } from 'react-router-dom';

export default function NewDraft(props) {
    const [dataSource, setDataSource] = useState([])
    const navigate = useNavigate()

    // 解构当前用户的用户名
    const { username } = JSON.parse(localStorage.getItem('token'))
    // 获取到当前登录用户，未审核状态的所有新闻
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            setDataSource(list)
        })
    }, [username])

    // 表格标题
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            // 带当前id跳转到对应的预览页面
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            render: (author) => {
                return <b>{author}</b>
            }
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        {/* 删除按钮 */}
                        <Button danger shape="circle" icon={<DeleteOutlined />}
                            onClick={() => confirmMethod(item, deleteMethod)} />
                        {/* 更新按钮 */}
                        <Button shape="circle" icon={<EditOutlined />}
                            style={{ marginLeft: '5px' }}
                            onClick={() => {
                                navigate(`/news-manage/update/${item.id}`)
                            }} />
                        {/* 提交审核到审核列表 */}
                        <Button type="primary" shape="circle" icon={<VerticalAlignTopOutlined />}
                            style={{ marginLeft: '5px' }}
                            onClick={() => { handleCheck(item.id) }} />
                    </div>
                )
            }

        }
    ]

    // 删除-确定方法
    // const confirmMethod = (item) => {
    //     confirm({
    //         title: '确定要删除吗?',
    //         icon: <ExclamationCircleOutlined />,
    //         okText: '确认',
    //         cancelText: '取消',
    //         // content: 'Some descriptions',
    //         onOk() {
    //             deleteMethod(item)
    //         },
    //         onCancel() {
    //             // console.log('Cancel');
    //         },
    //     });
    // }

    // 删除草稿的回调
    const deleteMethod = (item) => {
        // 更新数据
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 通知数据库删除
        axios.delete(`/news/${item.id}`)
    }

    // 更新的方法
    const handleCheck = (id => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            // 如果状态为0跳草稿箱，状态为1跳审核列表
            navigate('/audit-manage/list')

            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到'审核列表'中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    })


    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}
                rowKey={item => item.id} />
        </div>
    )
}
