import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

function confirmMethod(item, func) {
    confirm({
        title: '你确定要删除此项吗?',
        icon: <ExclamationCircleOutlined />,
        // content: 'Some descriptions',
        onOk() {
            func(item)
        },
        onCancel() {
            // console.log('Cancel');
        },
    });
}

export default confirmMethod
