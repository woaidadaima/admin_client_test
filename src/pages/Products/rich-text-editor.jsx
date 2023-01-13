import React, { useState, forwardRef } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useEffect } from 'react';

const RichTextEditor = forwardRef((props, ref) => {
    // 设置编辑器初始值
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    useEffect(() => {
        const rowHtml = props.value
        // 如果传进来有原生Html值，则将原生Html转化为富文本编辑器可以识别的Draft格式
        if (rowHtml) {
            // 将收集rowHTml先保存在组件身上供form表单收集
            setRowHtml(rowHtml)
            const contentBlock = htmlToDraft(rowHtml)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
        }
    }, [props.value])

    let [rowHtml, setRowHtml] = useState('')
    const onEditorStateChange = (editorState) => {
        // 将输入文本转化为原生的HTML
        setRowHtml(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        setEditorState(editorState)
    }
    const uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url // 得到图片的url
                    resolve({ data: { link: url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    return (
        <>
            <Editor
                contentState={rowHtml}
                ref={ref}
                editorStyle={{
                    border: '1px solid black',
                    minHeight: 200,
                    paddingLeft: 10
                }}
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    image: {
                        urlEnabled: true,
                        uploadEnabled: true,
                        uploadCallback: uploadImageCallBack,
                        previewImage: true,
                        inputAccept: 'image/*',
                        alt: { present: false, mandatory: false, previewImage: true }
                    }
                }}
            />
        </>
    )
})

export default RichTextEditor

// export default function RichTextEditor() {
//     const onEditorStateChange = (editorState) => {
//         setEditorState(editorState)
//     }
//     const uploadImageCallBack = (file) => {
//         return new Promise(
//             (resolve, reject) => {
//                 const xhr = new XMLHttpRequest()
//                 xhr.open('POST', '/manage/img/upload')
//                 const data = new FormData()
//                 data.append('image', file)
//                 xhr.send(data)
//                 xhr.addEventListener('load', () => {
//                     const response = JSON.parse(xhr.responseText)
//                     const url = response.data.url // 得到图片的url
//                     resolve({ data: { link: url } })
//                 })
//                 xhr.addEventListener('error', () => {
//                     const error = JSON.parse(xhr.responseText)
//                     reject(error)
//                 })
//             }
//         )
//     }
//     const [editorState, setEditorState] = useState(EditorState.createEmpty())
//     return (
//         <>
//             <Editor
//                 editorStyle={{
//                     border: '1px solid black',
//                     minHeight: 200,
//                     paddingLeft: 10
//                 }}
//                 editorState={editorState}
//                 toolbarClassName="toolbarClassName"
//                 wrapperClassName="wrapperClassName"
//                 editorClassName="editorClassName"
//                 onEditorStateChange={onEditorStateChange}
//                 toolbar={{
//                     image: {
//                         urlEnabled: true,
//                         uploadEnabled: true,
//                         uploadCallback: uploadImageCallBack,
//                         previewImage: true,
//                         inputAccept: 'image/*',
//                         alt: { present: false, mandatory: false, previewImage: true }
//                     }
//                 }}
//             />
//         </>
//     )
// }
