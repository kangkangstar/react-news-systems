import React, { useState, useEffect } from 'react'
// 引入富文本编辑器相关的插件
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
// 格式互相转化的插件
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// 需要使用的样式文件
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState('')

    // 获取传递过来的内容，便于add或草稿箱使用组件
    useEffect(() => {
        const html = props.content
        // 新增新闻的时候内容是空的，不需要做转化，直接返回即可
        if (html === undefined) return
        // 有内容转化格式展示出来
        const contentBlock = htmlToDraft(html);//转换为dradt对象
        if (contentBlock) {
            // 两部转换格式
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            // 转换成draft格式的状态值再设置回去
            seteditorState(editorState)
        }
    }, [props.content])

    return (
        <div>
            {/* 失去焦点将文本转换为html片段 */}
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { seteditorState(editorState) }}
                // 子组件NewsEditor调用父组件的函数传递数据
                onBlur={() =>
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
            />
        </div>
    )
}
