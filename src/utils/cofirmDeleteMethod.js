import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

function confirmMethod(item, func) {
    confirm({
        title: '确定要删除吗?',
        icon: <ExclamationCircleOutlined />,//自定义图标
        okText: '确认',//确认按钮文字
        cancelText: '取消',//设置 Modal.confirm 取消按钮文字
        content: '温馨提示：删除操作不可撤销',
        onOk() {
            func(item)
        },//点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
        onCancel() {
        },//取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭
    });
}

export default confirmMethod
