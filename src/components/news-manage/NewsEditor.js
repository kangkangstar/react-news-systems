import React, { useState, useEffect } from 'react'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState('')

    useEffect(() => {
        const html = props.content
        if (html === undefined) return
        const contentBlock = htmlToDraft(html);//转换为dradt对象
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
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
                onBlur={() =>
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
            />
        </div>
    )
}
