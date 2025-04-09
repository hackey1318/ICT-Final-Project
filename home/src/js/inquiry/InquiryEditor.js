import React, { useRef, useEffect, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Quill Editor 스타일
import '../../css/inquiry/inquiry.css';

const InquiryEditor = ({onChange}) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);

    // 외부에서 에디터 내용을 가져오는 함수 (선택 사항)
    const handleContentChange = useCallback(() => {
        if(quillInstance.current && onChange) {
            const currentContent = quillInstance.current.root.innerHTML;
            onChange(currentContent);
        }
    }, [onChange]);

    useEffect(() => {
        let currentQuillInstance = null;

        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ],
                },
                theme: 'snow',
                placeholder: '내용을 입력하세요...',
            });
            quillInstance.current = currentQuillInstance;
            
            if(quillInstance.current) {
                quillInstance.current.on('text-change', (delta, oldDelta, source) => {
                    if (source === 'user') {
                        handleContentChange();
                    }
                });
            }
        }

        return () => {
            if (quillInstance.current) {
                quillInstance.current = null;
            }
        };
    }, [handleContentChange]);

    return (
        <div className='inquiry-write-page'>
            <div id="inquiry-box" ref={editorRef} style={{height: '400px', fontSize: '1.2em'}} onChange={handleContentChange} />
            {/* 필요하다면 에디터 내용 미리보기 */}
            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        </div>
    );
};

export default InquiryEditor;