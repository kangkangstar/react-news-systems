import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, } from 'antd';
import moment from 'moment'
import axios from 'axios';

export default function NewPreview(props) {
    const [newsInfo, setnewsInfo] = useState(null)

    // 请求新闻的详细数据，通过id查找
    useEffect(() => {
        // console.log(props.match.params);
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo(res.data)
        })
    }, [props.match.params.id])

    // 设置状态数据,根据响应得状态值从数组中取数
    const audiList = ['待审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['black', 'orange', 'green', 'red']

    return (
        <div>
            <>
                {
                    newsInfo && <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}

                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态" >
                                <span style={{ color: colorList[newsInfo.auditState] }}>
                                    {audiList[newsInfo.auditState]}
                                </span>

                            </Descriptions.Item>
                            <Descriptions.Item label="发布状态">
                                <span style={{ color: colorList[newsInfo.publishState] }}>
                                    {publishList[newsInfo.publishState]}
                                </span>
                            </Descriptions.Item>
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
