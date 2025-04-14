import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../css/inquiry/inquiry.css';
import axios from 'axios';
import addFile from '../../img/plus.jpg';
import InquiryEditor from '../../js/inquiry/InquiryEditor.js';
import apiClient from '../../js/public/axiosConfig.js';
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess.js';

const InquiryWrite = ({ onClose }) => {
    let [subject, setSubject] = useState();
    let [content, setContent] = useState();
    let [addedImg, setAddedImg] = useState([]);
    const runfile = useRef([]);  //file실행 준비 및 사진 갯수제한용

    const setSubjectValue = useCallback((e) => {
        setSubject(e.target.value);
        //console.log("[InquiryWrite] setSubjectValue - subject : ", e.target.value);
    }, []);

    const handleGetContent = useCallback((value) => {
        //console.log("[InquiryWrite] hadleGetContent - 받은 value(정확히) : ", value);
        setContent(value);
        //console.log("[InquiryWrite] hadleGetContent - content 최신화 : ", value);
    }, [setContent]);

    const submitInquiry = useCallback(() => {
        if (!subject) {
            alert("제목을 입력해주세요.");
            return;
        } else if(!content) {
            alert("내용을 입력해주세요.");
            return;
        }

        //console.log("최종 content값 : ", content);

        let inquiryData = {
            subject: subject,
            content: content,
            imageList: addedImg
        }

        apiClient.post('/inquiry/inquiryWrite', inquiryData)
            .then(function (response) {
                //console.log("문의 전송 성공 : ", response.data);
                alert("문의 작성이 완료되었습니다.");
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
        submitInquiry(); // content 업데이트를 유발하여 useEffect에서 submitInquiry 실행
    }, [submitInquiry]);

    const addImg = useCallback((event) => {  //type=file 실행
        if(runfile.current) {
            runfile.current.click();  //file 선택창 열기
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
    
                const file = files[i]; // 각 파일을 변수에 할당하여 안전하게 접근
                if (file) { // 파일 객체가 존재하는지 확인
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
                        setAddedImg((prevAddedImg) => [...prevAddedImg, file.name]);
                    };
                    reader.readAsDataURL(file);
                }
            }
            event.target.value = ""; // 파일 선택 후 input 값 초기화
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
            const clickedImageIndex = Array.from(imgList.children).indexOf(imgDiv); // 클릭된 이미지의 인덱스 찾기
    
            if (clickedImageIndex !== -1) {
                setAddedImg((prevAddedImg) => {
                    const newAddedImg = [...prevAddedImg];
                    newAddedImg.splice(clickedImageIndex, 1); // 해당 인덱스의 이미지 이름 제거
                    return newAddedImg;
                });
                imgList.removeChild(imgDiv); // DOM에서 이미지 제거
            }
        }
    }

    const closeInquiry = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className='inquiry-container'>
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
                    {/* <div id='addImgDiv' onClick={addImg}><img src={addFile} id='addFile' style={{ cursor: 'pointer', width: '20px' }} /></div> */}
                    <div id='addImgDiv' onClick={addImgClick}><img src={addFile} id='addFile' style={{ cursor: 'pointer', width: '20px' }} /></div>
                    <div className='imgList'></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {/* <input type='submit' value='작성하기' id='inquiry-submit' onClick={submitInquiry} /> */}
                    <input type='submit' value='작성하기' id='inquiry-submit' onClick={handleRealSubmit} />
                    <input type='button' value='취소하기' id='inquiry-cancel' onClick={closeInquiry} />
                </div>
            </div>
        </div>
    );
};

export default InquiryWrite;