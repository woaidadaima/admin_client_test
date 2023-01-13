import React, { useState, forwardRef } from 'react'
import {
    PlusOutlined,
} from '@ant-design/icons';
import { Upload, Modal, message } from 'antd'
import { reqDeleteImg } from '../../api';
import { useEffect } from 'react';
import { BASE_UPLOAD_URL } from '../../utils/constant';

const UpLoad = forwardRef((props, ref) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        const imgNameList = props.value || []
        if (imgNameList !== []) {
            setFileList(imgNameList.map((imgName, index) => ({
                uid: -index,
                name: imgName,
                url: BASE_UPLOAD_URL + imgName
            })))
        }
    }, [props.value])
    // 关闭预览
    const handleCancel = () => setPreviewOpen(false);
    // 处理预览时的回调
    const handlePreview = async (file) => {
        setPreviewImage(file.url);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };
    // 上传图片的回调
    const handleChange = async ({ file, fileList }) => {
        // 如果上传完成则修改信息
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('图片上传成功')
                const { name, url } = result.data
                file.name = name
                file.url = url
            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg({ name: file.name })
            if (result.status === 0) {
                message.success('删除图片成功')
            }
        }

        // 更新照片墙列表
        setFileList(fileList)
    }
    // 添加图片框的HTML结构
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <>
            <Upload
                ref={ref}
                name='image' //请求参数名发给后台的,没设置会导致服务器接受不到
                accept='image/*' // 可接受的文件类型
                action="/manage/img/upload" //上传图片地址
                listType="picture-card"
                fileList={fileList} //照片数组
                onPreview={handlePreview} // 预览时的回调
                onChange={handleChange}  //上传的回调
            >
                {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    )
})

export default UpLoad

// export default function UpLoad(props) {
//     console.log(props);

//     // value = 'test'
//     // onChange((a) => {
//     //     //函数体
//     //     console.log(a);
//     // })
//     // console.log(value);
//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewImage, setPreviewImage] = useState('');
//     const [previewTitle, setPreviewTitle] = useState('');
//     const [fileList, setFileList] = useState([]);
//     // 关闭预览
//     const handleCancel = () => setPreviewOpen(false);
//     // 处理预览时的回调
//     const handlePreview = async (file) => {
//         setPreviewImage(file.url);
//         setPreviewOpen(true);
//         setPreviewTitle(file.name);
//     };
//     // 上传图片的回调
//     const handleChange = async ({ file, fileList }) => {
//         // 如果上传完成则修改信息
//         if (file.status === 'done') {
//             const result = file.response
//             if (result.status === 0) {
//                 message.success('图片上传成功')
//                 const { name, url } = result.data
//                 file.name = name
//                 file.url = url
//                 // 保存图片名称
//                 const ImgName = fileList.map((item) => {
//                     return item.name
//                 })
//                 console.log(ImgName);
//             } else {
//                 message.error('图片上传失败')
//             }
//         } else if (file.status === 'removed') {
//             const result = await reqDeleteImg({ name: file.name })
//             if (result.status === 0) {
//                 message.success('删除图片成功')
//             }
//         }

//         // 更新照片墙列表
//         setFileList(fileList)
//     }
//     // 添加图片框的HTML结构
//     const uploadButton = (
//         <div>
//             <PlusOutlined />
//             <div
//                 style={{
//                     marginTop: 8,
//                 }}
//             >
//                 Upload
//             </div>
//         </div>
//     );
//     return (
//         <>
//             <Upload
//                 name='image' //请求参数名发给后台的,没设置会导致服务器接受不到
//                 accept='image/*' // 可接受的文件类型
//                 action="/manage/img/upload" //上传图片地址
//                 listType="picture-card"
//                 fileList={fileList} //照片数组
//                 onPreview={handlePreview} // 预览时的回调
//                 onChange={handleChange}  //上传的回调
//             >
//                 {fileList.length >= 3 ? null : uploadButton}
//             </Upload>
//             <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//                 <img
//                     alt="example"
//                     style={{
//                         width: '100%',
//                     }}
//                     src={previewImage}
//                 />
//             </Modal>
//         </>
//     )
// }
