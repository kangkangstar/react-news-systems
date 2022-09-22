export const Lang = (preState = { langname: 'en' }, action) => {
    // 语言默认值是英文
    let { type } = action
    switch (type) {
        // 改成中文
        case 'change_de':
            preState = { langname: 'de' }
            return preState
        // 改成英文
        case 'change_en':
            preState = { langname: 'en' }
            return preState
        default:
            return preState;

    }
}