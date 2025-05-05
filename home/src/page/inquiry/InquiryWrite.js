import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../css/inquiry/inquiry.css';
import addFile from '../../img/plus.jpg';
import InquiryEditor from '../../js/inquiry/InquiryEditor.js';
import  apiClient from '../../js/public/axiosConfig.js';
import axios from 'axios';
import { handleUserLogout } from 'js/api/UserLogout';

const InquiryWrite = ({ onClose, onSuccess }) => {
    let [subject, setSubject] = useState();
    let [content, setContent] = useState();
    let [addedImg, setAddedImg] = useState([]);
    const runfile = useRef([]);
    const accessToken = sessionStorage.getItem("accessToken");
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passwordInputStyle = {
        marginLeft: '15px',
        height: '35px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        fontSize: '14px'
    };

    const setSubjectValue = useCallback((e) => {
        setSubject(e.target.value);
    }, []);

    const handleGetContent = useCallback((value) => {
        setContent(value);
    }, [setContent]);

    const handlePrivateChange = useCallback((e) => {
        const checked = e.target.checked;
        setIsPrivate(checked);

        if(!checked) {
            setPassword('');
            setPasswordConfirm('');
        }
    }, []);

    const handlePasswordChange = useCallback((e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPassword(value);
    }, []);

    const handlePasswordConfirmChange = useCallback((e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPasswordConfirm(value);
    }, []);

    const submitInquiry = useCallback(async () => {
        if (!subject) {
            alert("제목을 입력해주세요.");
            return;
        } else if(!content || content.trim() === '') {
            alert("내용을 입력해주세요.");
            return;
        }        

        if(isPrivate && !password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if(isPrivate) {
            const passwordRegex = /^\d{4,8}$/;
            if(!passwordRegex.test(password)) {
                alert("비밀번호는 4~8자리의 숫자로 입력해주세요.");
                return;
            }

            if(password !== passwordConfirm) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        if(isSubmitting) return;
        setIsSubmitting(true);

        let inquiryData = {
            subject: subject,
            content: content,
            imageList: [],
            password: password,
            isPrivate: isPrivate
        }

        if(isPrivate) {
            inquiryData.password = password;
        }

        let formData = new FormData();
        if(addedImg.length > 0) {
            addedImg.forEach((img) => {
                formData.append("files", img);
            })

            const fileUpload = await apiClient.post("/file-system/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
    
            inquiryData.imageList = fileUpload.data.map(item => item.imageId);
        } else {
            inquiryData.imageList = [];
        }

        apiClient.post('/inquiry/inquiryWrite', inquiryData)
            .then(function (response) {
                alert("문의 작성이 완료되었습니다.");
                console.log(inquiryData);
                if (onSuccess) {
                    onSuccess();
                }

                setIsSubmitting(false);

                if (onClose) {
                    onClose();
                }
            })
            .catch(function (error) {
                console.log("문의전송실패 = ", error);
                if (error.response.status === 423) {
                    handleUserLogout();
                }
                alert("문의작성을 실패하였습니다.")
                return;
            })
    }, [subject, content, addedImg, isPrivate, password, passwordConfirm, onSuccess, onClose, accessToken, isSubmitting]);

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
            <InquiryEditor onChange={handleGetContent} initialValue={content}/>
            {/* <div dangerouslySetInnerHTML={{ __html: content }} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }} /> */}
            {/* <button onClick={handleGetContent}>에디터 내용 가져오기</button> */}

            <div id="secret-select">
                <div style={{display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        id="isPrivateCheckbox"
                        checked={isPrivate}
                        onChange={handlePrivateChange}
                        style={{ marginRight: '5px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isPrivateCheckbox" style={{ cursor: 'pointer', marginRight: '10px' }}>비밀글 설정</label>
                    {/* isPrivate가 true일 때만 비밀번호 입력 필드 표시 */}
                    {isPrivate && (
                        <>
                            <input
                                type="password"
                                placeholder="4~8자리의 숫자 입력"
                                value={password}
                                onChange={handlePasswordChange}
                                style={passwordInputStyle}
                                maxLength={8} // 비밀번호 길이 제한 (선택 사항)
                                autoComplete="new-password"
                            />
                            <input
                                type="password"
                                placeholder='비밀번호 확인'
                                value={passwordConfirm}
                                onChange={handlePasswordConfirmChange}
                                style={passwordInputStyle} // 동일 스타일 적용
                                maxLength={8} // 최대 길이 제한
                                autoComplete="new-password"
                            />
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <div style={{ display: 'flex', textAlign: 'left' }}>
                    <input type='file' multiple ref={runfile} style={{ display: 'none' }} accept='image/*'/>
                    <div id='addImgDiv' onClick={addImgClick}><img src={addFile} id='addFile' style={{ cursor: 'pointer', width: '20px' }} /></div>
                    <div className='imgList'></div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <input type='submit' value='작성하기' id='inquiry-submit' onClick={handleRealSubmit} disabled={isSubmitting} />
                    <input type='button' value='취소하기' id='inquiry-cancel' onClick={closeInquiry} />
                </div>
            </div>
        </div>
    );
};

export default InquiryWrite;