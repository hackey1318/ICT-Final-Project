import React, { useState, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../css/inquiry/inquiry.css';

function InquiryPwdModal({ show, item, onConfirm, onCancel }) {
    const [password, setPassword] = useState('');

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
    }, []);

    const handleConfirm = useCallback(() => {
        // 입력된 비밀번호와 아이템 정보를 부모에게 전달
        onConfirm(item, password);
        setPassword(''); // 입력 필드 초기화
    }, [item, password, onConfirm]);

    const handleCancel = useCallback(() => {
        onCancel();
        setPassword(''); // 입력 필드 초기화
    }, [onCancel]);

    // Enter 키로 확인 버튼 클릭되도록 처리 (선택 사항)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    return (
        <Modal show={show} onHide={handleCancel} centered size="sm" dialogClassName='pwd-modal-dialog' contentClassName='pwd-modal-content'>
            <Modal.Header closeButton>
                <Modal.Title>비밀번호 입력</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>'{item?.subject}' 글은 비밀글입니다.<br/>4~8자리의 숫자비밀번호를 입력해주세요.</p>
                <Form.Control
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown} // Enter 키 처리
                    autoFocus // 모달 열릴 때 자동 포커스
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleConfirm} disabled={!password.trim()}> {/* 비밀번호 입력 시 활성화 */}
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InquiryPwdModal;
