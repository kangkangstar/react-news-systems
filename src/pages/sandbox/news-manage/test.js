import React, { useState } from 'react'
import NewTable from './news'
import axios from 'axios'
import { notification } from 'antd';

export default function NewAdd(props) {
    const User = JSON.parse(sessionStorage.getItem('token'))
    const [formInfo, setformInfo] = useState({})
    // 存储从子组件获取到的文章信息
    const [content, setContent] = useState('')
    // 保存草稿或提交审核的回调
    const handlesave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            'content': content,
            "region": User.region ? User.region : '全球',
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            // 如果状态为0跳草稿箱，状态为1跳审核列表
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的文章`,
                placement: 'bottomRight',
            });
        })
    }

    return (
        <NewTable title="撰写新闻" handlesave={handlesave} setformInfo={setformInfo} setContent={setContent} content={content}></NewTable>
    )
}