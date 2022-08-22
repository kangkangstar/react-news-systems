export const Collapse = (preState = { isClollapse: false }, action) => {
    let { type } = action
    switch (type) {
        case 'change_collapsed':
            let newstate = { ...preState }  //复制老的状态
            newstate.isClollapse = !newstate.isClollapse
            return newstate
        default:
            return preState;

    }
}