import React, {
    useEffect, useState
} from 'react'
import axios from 'axios'
import { Table, Button, notification } from 'antd'

// 此模块是所有需要审核的文章，admin==> 所有人 区域管理员 ==> 自己的+同一区域编辑的文章
export default function Audit() {
    const [dataSource, setDataSource] = useState([])
    const { roleId, region, username } = JSON.parse(sessionStorage.getItem('token'))

    // 将待审核的数据筛选出来(联表查询是为了获取分类名称。item是每一条文章)
    useEffect(() => {
        const roleObj = {
            "1": 'superadmin',
            "2": 'admin',
            "3": 'editor'
        }
        axios.get('/news?auditState=1&_expand=category').then(res => {
            const list = res.data
            // 如果是admin全都可以看到，如果不是，只能看到自己的和区域编辑的数据
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ])

        })
    }, [roleId, region, username])


    // 表格的标题
    const columns = [
        // dataIndex的值要和后端对应的key相同
        {
            title: '文章标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '文章分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            //  render：生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
            render: (item) => {
                return (
                    <div>
                        {/* 根据审核状态显示不同得按钮，传递3个参数 */}
                        <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
                        <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
                    </div>
                )

            }
        }
    ];
    // 通过和驳回按钮的回调，通过参数区分
    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState, publishState
        }).then(res => {
            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到【审核管理/审核列表】中查看当前文章的审核状态`,
                placement: 'bottomRight',
            });

        })
    }


    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{ pageSize: 5 }} rowKey={item => item.id}
            />
        </div>
    )
}
