export const Collapse = (preState = { isClollapse: false }, action) => {
    // 从action对象中解构出获取：type、data
    let { type } = action
    switch (type) {
        // 变成英文
        case 'change_collapsed':
            let newstate = { ...preState }  //复制老的状态
            newstate.isClollapse = !newstate.isClollapse
            return newstate
        default:
            return preState;

    }
}