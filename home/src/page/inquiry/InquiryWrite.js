import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../css/inquiry/inquiry.css';
import addFile from '../../img/plus.jpg';
import InquiryEditor from '../../js/inquiry/InquiryEditor.js';
import  apiClient from '../../js/public/axiosConfig.js';
import axios from 'axios';

const InquiryWrite = ({ onClose, onSuccess }) => {
    let [subject, setSubject] = useState();
    let [content, setContent] = useState();
    let [addedImg, setAddedImg] = useState([]);
    const runfile = useRef([]);
    const accessToken = sessionStorage.getItem("accessToken");

    const setSubjectValue = useCallback((e) => {
        setSubject(e.target.value);
    }, []);

    const handleGetContent = useCallback((value) => {
        setContent(value);
    }, [setContent]);

    const submitInquiry = useCallback(async () => {
        if (!subject) {
            alert("제목을 입력해주세요.");
            return;
        } else if(!content) {
            alert("내용을 입력해주세요.");
            return;
        }        

        let inquiryData = {
            subject: subject,
            content: content,
            imageList: []
        }

        let formData = new FormData();
        addedImg.forEach((img) => {
            formData.append("files", img);
        })

        const fileUpload = await axios.post("http://192.168.1.252:9988/file-system/upload", formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    
        inquiryData.imageList = fileUpload.data.map(item => item.imageId);

        apiClient.post('/inquiry/inquiryWrite', inquiryData)
            .then(function (response) {
                alert("문의 작성이 완료되었습니다.");
                console.log(inquiryData);
                if (onSuccess) {
                    onSuccess();
                }

                if (onClose) {
                    onClose();
                }
            })
            .catch(function (error) {
                console.log("문의전송실패 = ", error);
                alert("문의작성을 실패하였습니다.")
                return;
            })
    }, [subject, content, addedImg, onClose]);

    const handleRealSubmit = useCallback(() => {
        submitInquiry(); 
    }, [submitInquiry]);

    const addImg = useCallback((event) => {
        if(runfile.current) {
            runfile.current.click();  
        }

        const files = event.target.files;
        const imgList = document.querySelector('.imgList');
        const maxImage = 5;
        const existingImages = imgList ? imgList.querySelectorAll('div').length : 0;

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (existingImages + i >= maxImage) {
                    alert('이미지는 5개까지 첨부해주세요.');
                    event.target.value = "";
                    break;
                }
    
                const file = files[i];
                if (file) { 
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const div = document.createElement('div');
                        div.style.backgroundImage = `url(${e.target.result})`;
                        div.style.backgroundSize = 'contain';
                        div.style.cursor = 'pointer';
                        div.addEventListener('click', delImg);
                        if (imgList) {
                            imgList.appendChild(div);
                        }
                        setAddedImg((prevAddedImg) => [...prevAddedImg, file]);
                    };
                    reader.readAsDataURL(file);
                }
            }
            event.target.value = ""; 
        }
    }, [addedImg, setAddedImg, delImg]);

    useEffect(() => {
        const fileInput = runfile.current;
        if (fileInput) {
            fileInput.addEventListener('change', addImg);
        }
        return () => {
            if (fileInput) {
                fileInput.removeEventListener('change', addImg);
            }
        };
    }, [addImg]);

    const addImgClick = useCallback(() => {
        if (runfile.current) {
            runfile.current.click();
        }
    }, []);

    function delImg(event) {
        const imgDiv = event.target;
        const imgList = document.querySelector('.imgList');
    
        if (imgList && imgList.contains(imgDiv)) {
            const clickedImageIndex = Array.from(imgList.children).indexOf(imgDiv); 
    
            if (clickedImageIndex !== -1) {
                setAddedImg((prevAddedImg) => {
                    const newAddedImg = [...prevAddedImg];
                    newAddedImg.splice(clickedImageIndex, 1); 
                    return newAddedImg;
                });
                imgList.removeChild(imgDiv); 
            }
        }
    }

    const closeInquiry = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className='inquiry-modal'>
            <input type='text'
                placeholder='문의 제목을 입력해주세요.'
                className="inquiry-title"
                value={subject}
                onChange={setSubjectValue}
            />
            <InquiryEditor onChange={handleGetContent}/>
            {/* <div dangerouslySetInnerHTML={{ __html: content }} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }} /> */}
            {/* <button onClick={handleGetContent}>에디터 내용 가져오기</button> */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div style={{ display: 'flex', textAlign: 'left' }}>
                    <input type='file' multiple ref={runfile} style={{ display: 'none' }} />
                    <div id='addImgDiv' onClick={addImgClick}><img src={addFile} id='addFile' style={{ cursor: 'pointer', width: '20px' }} /></div>
                    <div className='imgList'></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <input type='submit' value='작성하기' id='inquiry-submit' onClick={handleRealSubmit} />
                    <input type='button' value='취소하기' id='inquiry-cancel' onClick={closeInquiry} />
                </div>
            </div>
        </div>
    );
};

export default InquiryWrite;