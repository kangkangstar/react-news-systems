import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, } from 'antd';
import moment from 'moment'
import axios from 'axios';
import { HeartTwoTone } from '@ant-design/icons'

export default function Detail(props) {
    const [newsInfo, setnewsInfo] = useState(null)

    // 请求新闻的详细数据，通过id查找
    useEffect(() => {
        // console.log(props.match.params);
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            // 同步后端
            return res.data
        }).then(res => {
            axios.patch(`/news/${props.match.params.id}`, {
                view: res.view + 1
            })
        })
    }, [props.match.params.id])

    const handleStart = () => {
        setnewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        })
    }

    return (
        <div>
            <>
                {
                    newsInfo && <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div style={{}}>
                            {newsInfo.category.title}
                            <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStart()} />

                        </div>}

                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>

                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                        {/* 直接放内容会直接html格式的，有p标签等，不是解析后的*/}
                        {/* <div>{newsInfo.content}</div> */}
                        {/* 下面的代码可以解决问题 */}
                        <div dangerouslySetInnerHTML={{
                            __html: newsInfo.content
                        }} style={{ border: '1px solid', marginTop: '10px' }}>
                        </div>
                    </PageHeader>
                }
            </>

        </div>
    )
}
