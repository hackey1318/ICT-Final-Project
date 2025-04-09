import React, { useCallback, useState } from 'react';
import QuillEditor from '../../js/inquiry/InquiryEditor.js';
import '../../css/inquiry/inquiry.css';
import axios from 'axios';

const InquiryWrite = ({onClose}) => {
    let [subject, setSubject] = useState();
    let [content, setContent] = useState();

    const setSubjectValue = useCallback((e) => {
        setSubject(e.target.value);
        console.log("제목:", subject);
    }, [subject]);

    const handleGetContent = useCallback((value) => {
        setContent(value);
        console.log("에디터 내용 (InquiryWrite): ", value);
    }, [setContent]);

    const submitInquiry = useCallback(() => {
        if(!subject) {
            alert("제목을 입력해주세요.");
            return;
        }

        let inquiryData = {
            subject: subject,
            content: content
        }

        axios.post('http://localhost:9988/inquiry/inquiryWrite', inquiryData)
        .then(function (response) {
            console.log("문의 전송 성공 : ", response.data);
            alert("문의 작성이 완료되었습니다.");
            if(onClose) {
                onClose();
            }
        })
        .catch(function (error) {
            console.log("문의전송실패 = ", error);
        })
    }, [subject, content, onClose])

    const closeInquiry = useCallback(() => {
        if(onClose) {
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
            <QuillEditor onChange={handleGetContent}/>
            {/* <button onClick={handleGetContent}>에디터 내용 가져오기</button> */}
            <div style={{textAlign: 'right'}}>
                <input type='submit' value='작성하기' id='inquiry-submit' onClick={submitInquiry} />
                <input type='button' value='취소하기' id='inquiry-cancel' onClick={closeInquiry}/>
            </div>
        </div>
    );
};

export default InquiryWrite;