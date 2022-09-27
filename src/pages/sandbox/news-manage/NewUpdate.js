import React, { useState } from 'react'
import { notification } from 'antd';
import axios from 'axios'
import NewTable from "./NewsTable"


export default function NewUpdate(props) {
    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState('')

    // 保存草稿或提交审核的回调--补丁更新【不同】
    const handlesave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            'content': content,
            "auditState": auditState,
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
        // title不一样,props形式传递
        <div>
            <NewTable title="修改新闻" handlesave={handlesave} setformInfo={setformInfo} setContent={setContent} content={content}></NewTable>
        </div>
    )
}

