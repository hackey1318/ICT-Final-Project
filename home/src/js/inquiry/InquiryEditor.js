import React, { useRef, useEffect, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Quill Editor 스타일
import '../../css/inquiry/inquiry.css';

const InquiryEditor = ({onChange, initialContent}) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const quillEditorRef = useRef(null); // .ql-editor에 대한 ref

    // 외부로 에디터 내용을 보내는 함수(직접 .ql-editor 참조)
    const handleContentChange = useCallback(() => {
        if(quillEditorRef.current && onChange) {
            const currentContent = quillEditorRef.current.innerHTML;
            //console.log("[QuillEditor] handleContentChange (직접 참조) - currentContent:", currentContent); // 확인 로그
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
                        ['link'],
                        ['clean']
                    ],
                },
                theme: 'snow',
                placeholder: '내용을 입력하세요...',
            });
            currentQuillInstance = quillInstance.current;

            // .ql-editor 요소에 ref 연결
            quillEditorRef.current = editorRef.current.querySelector('.ql-editor');
            //console.log("[QuillEditor] useEffect - quillEditorRef:", quillEditorRef.current);

            if(initialContent && quillEditorRef.current) {
                quillEditorRef.current.innerHTML = initialContent;
                if(onChange) {
                    onChange(initialContent);
                }
            }

            if(currentQuillInstance) {
                currentQuillInstance.on('text-change', (delta, oldDelta, source) => {
                    if(source === 'user') {
                        // 직접 .ql-editor의 innerHTML을 사용하여 handleContentChange 호출
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
    }, [handleContentChange, initialContent]);

    return (
        <div className='inquiry-write-page'>
            <div id="inquiry-box" ref={editorRef} style={{height: '270px', fontSize: '1.2em'}} onChange={handleContentChange} />
            {/* 필요하다면 에디터 내용 미리보기 */}
            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        </div>
    );
};

export default InquiryEditor;