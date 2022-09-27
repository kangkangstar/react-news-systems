import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "./newseditor.css"

const NewsEditor = forwardRef((props, ref) => {
    const [editorState, seteditorState] = useState("")
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        clearMessage
    }))

    // 将输入的文本清空
    const clearMessage = () => {
        seteditorState('')
    }
    // 将文本转化为draft对象存储,content就是需要展示的html文本
    useEffect(() => {
        const html = props.content
        if (html === undefined) return
        // 将htlm转为 draft对象,输入不能为空才能转换
        const contentBlock = htmlToDraft(html);
        // 如果有数据
        if (contentBlock) {
            // 
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            // 转为了draft格式
            const editorState = EditorState.createWithContent(contentState);
            // 存储转化好的数据
            seteditorState(editorState)
        }
    }, [props.content])

    // 设置图片上传的处理函数
    // const uploadImageCallBack = (file) => {
    //     return new Promise((resolve, reject) => {
    //         (async () => {
    //             const base64 = await getBase64(file);
    //             const data = {
    //                 base64: base64.split(',')[1],
    //                 fileName: file.name,
    //                 fileCode: 'material',
    //             }
    //             //  这里的 UploadBase64 是我的图片上传接口
    //             const res = await UploadBase64(data);
    //             // 这里的 IMG_URL 图片的 Host， 因为上面的接口上传成功返回的是一个相对路径 页面展示时需要自行拼接 Host。 这两处， 大家可根据实际情况自行修改
    //             if (res && res.data) {
    //                 resolve({
    //                     data: {
    //                         link: `link:${res.data}`,
    //                     },
    //                 });
    //             } else {
    //                 reject();
    //             }
    //         })();
    //     })
    // }

    const test = (editorState) => {
        seteditorState(editorState)
    }


    return (
        <div>
            {/* 失去焦点将文本转换为html片段 
            localization={{
                    locale: 'zh',
                }}  ——中文区域设置           
            */}
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                localization={{
                    locale: 'zh',
                }}
                onEditorStateChange={test.bind(this)}
                onBlur={() => {
                    // 失焦的时候将输入的文本转为html格式然后传递给父组件,好展示出来
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
                mention={{
                    separator: ' ',
                    trigger: '@',
                    suggestions: [
                        { text: 'admin', value: 'admin', url: 'admin' },
                        { text: '铁锤', value: '铁锤', url: '铁锤' },
                        { text: '钢蛋', value: '钢蛋', url: '钢蛋' }
                    ],
                }}
                hashtag={{}}
            // toolbar={{
            //     image: {
            //         uploadCallback: uploadImageCallBack,
            //         alt: { present: true, mandatory: false },
            //     },
            // }}
            />
        </div>
    )
})

export default NewsEditor

// function getBase64(img, callback) {
//     return new Promise((res, rej) => {
//         const reader = new FileReader();
//         reader.addEventListener('load', () => res(reader.result));
//         reader.readAsDataURL(img);
//     })
// }