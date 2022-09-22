import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

function usePublish(type) {

    const { username } = JSON.parse(sessionStorage.getItem('token'))
    const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [username, type])

    const handlePublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            'publishState': 2,
            'publishTime': Date.now()
        }).then(res => {
            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到【发布管理/已发布】中查看您的文章`,
                placement: 'bottomRight',
            });
        })
    }

    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            'publishState': 3,
        }).then(res => {
            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您可以到【发布管理/已下线】中查看您的文章`,
                placement: 'bottomRight',
            });
        })
    }

    const handleDelete = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            // 通知确认框--右下角弹出
            notification.info({
                message: `通知`,
                description: `您已经删除了已下线的文章`,
                placement: 'bottomRight',
            });
        })
    }


    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}
export default usePublish