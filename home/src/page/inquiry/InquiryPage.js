import styled from 'styled-components';
import '../../css/inquiry/inquiry.css';
import { Link, useNavigate } from 'react-router-dom';
import InquiryWrite from './InquiryWrite';
import { useCallback, useEffect, useState } from 'react';
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess';
import apiClient from '../../js/public/axiosConfig';
import InquiryPwdModal from '../../js/inquiry/InquiryPwdModal';
import Pagination from '../../js/public/Pagination';
import { handleUserLogout } from 'js/api/UserLogout';

function InquiryPage() {
    let [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    let [writeModalOpen, setWriteModalOpen] = useState(false);
    let [inquiryList, setInquiryList] = useState([]);
    let navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentItemForPassword, setCurrentItemForPassword] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(9);


    const StyledLink = styled(Link)`
        text-decoration: none;
        &:link, &:visited, &:active {color: blue;}
        &:hover {color: yellowgreen;}`;

    const getInquiryList = useCallback(async (page=0) => {
        try {
            const response = await apiNoAccessClient.get(`/inquiry/getInquiry?page=${page}&size=${pageSize}`);
            if(response.data && response.data.content) {
                setInquiryList(response.data.content || []);
                setTotalPages(response.data.totalPages);
            } else {
                console.error("잘못된 API구조", response.data);
                setInquiryList([]);
                setTotalPages(0);
            }
        } catch(error) {
            console.log("error발생 : ", error);
            setInquiryList([]);
            setCurrentPage(0);
        }
    }, [pageSize]);

    //문의리스트 호출
    useEffect (() => {
        getInquiryList(currentPage);
    }, [currentPage, getInquiryList]);

    // 모달 닫는 함수
    const closeWriteModal = useCallback(() => {
        setWriteModalOpen(false);
    }, []);

    const closeInquiryModal = useCallback(() => {
        setInquiryModalOpen(false);
    }, []);

    //딤처리
    const DimmedOverlay = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 5;
        `;

    //비밀글 클릭 핸들러(사용자 본인 확인 후 실행)
    const handleInquiryClick = useCallback(async (item) => {
        if(!item || item.no == null) return;

        let loginUserId = null;
        const loginUserInfo = sessionStorage.getItem("userInfo");
        if(loginUserInfo) {
            const userInfoObject = JSON.parse(loginUserInfo);
            loginUserId = userInfoObject.userNo;
        } else {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        if(item.private) {
            if(loginUserId != null && item.userNo != null && String(loginUserId) === String(item.userNo)) {
                setCurrentItemForPassword(item);
                setShowPasswordModal(true);
            } else {
                alert("비밀글은 작성자만 접근가능합니다.");
            }
        } else {
            navigate(`/inquiryView/${item.no}`);
        }
    }, [navigate]);

    const handlePasswordConfirm = useCallback(async (item, password) => {
        setShowPasswordModal(false);
        setCurrentItemForPassword(null);
        
        if(!item || !password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        try{
            const response = await apiClient.post(`/inquiry/checkPwd/${item.no}`, {password});
            if(response.data === true) {
                navigate(`/inquiryView/${item.no}`);
            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        } catch(error) {
            console.error("비밀번호 확인 오류 : ", error.response || error);
            let errorMsg = "비밀번호 확인 중 에러 발생";
            if(error.response?.status === 401) {
                errorMsg = "비밀번호가 일치하지않습니다.";
            } else if (error.response.status === 423) {
                handleUserLogout();
            } else if(error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            alert(errorMsg);
        }
    }, [navigate]);

    // 비밀번호 모달닫기
    const handlePasswordCancel = useCallback(() => {
        setShowPasswordModal(false);
        setCurrentItemForPassword(null);
    }, []);

    //인터셉터
    const handleWriteClick = () => {
        const accessToken = sessionStorage.getItem("accessToken");
        if(accessToken) {
            setWriteModalOpen(true);
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return(
        <div className="inquiry-container">
            <h3 style={{margin: '30px auto'}}>1:1문의하기</h3>
            <div className="container mt-3">
                <table className="table table-hover" style={{width: '100%'}}>
                    <thead style={{borderBottom: '1px solid #ddd'}}>
                        <tr>
                            <th style={{width:'7%', textAlign:'center', background: '#f1f3f5'}}>번호</th>
                            <th style={{width:'48%', textAlign:'center', background: '#f1f3f5'}}>제목</th>
                            <th style={{width:'15%', textAlign:'center', background: '#f1f3f5'}}>작성자</th>
                            <th style={{width:'20%', textAlign:'center', background: '#f1f3f5'}}>작성날짜</th>
                            <th style={{width:'10%', textAlign:'center', background: '#f1f3f5'}}>진행상황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(inquiryList) && inquiryList.length > 0 ? (
                                inquiryList
                                    .filter(item => item.status === "ACTIVE")
                                    .map((item) => {
                                        console.log(inquiryList);
                                    return (
                                        <tr className="td-container" key={item.no}>
                                            <td style={{width:'7%', textAlign:'center'}}>{item.no}</td>
                                            <td style={{width:'48%', textAlign: 'left'}}>
                                                <a href='#' id='toDetail' onClick={(e) => {e.preventDefault(); handleInquiryClick(item)}}>
                                                    {item.private && <span style={{ marginRight: '5px', position: 'absolute'}}>🔒</span>}
                                                    <span style={{paddingLeft: '30px'}}>{item.subject}</span>
                                                </a>
                                            </td>
                                            <td style={{width:'15%', textAlign:'center'}}>{item.nickname}</td>
                                            <td style={{width:'20%', textAlign:'center'}}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td style={{width:'10%', textAlign:'center'}}>{item.proceedDescription}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td className='noInquiryMsg' >
                                        문의 내역이 없습니다.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {  
                writeModalOpen &&
                <>
                    <DimmedOverlay/>
                    <div id="inquiryModal">
                        <InquiryWrite onClose={closeWriteModal}
                                      onSuccess={getInquiryList}/>
                    </div>
                </>
            }
            {   
                <InquiryPwdModal
                    show={showPasswordModal}
                    item={currentItemForPassword}
                    onConfirm={handlePasswordConfirm}
                    onCancel={handlePasswordCancel}/>
            }
            <div>
                <div id="paging">
                    {totalPages > 0 && ( 
                        <Pagination
                            page={currentPage}       
                            totalPages={totalPages}   
                            onPageChange={handlePageChange} 
                        />
                    )}
                </div>
                <div style={{textAlign: 'right', 
                             minWidth: '850px',
                             marginTop: (inquiryList.length === 0 || !inquiryList.some(item => item.status === "ACTIVE")) ? '70px' : 0}}>
                    <button id="write" 
                        title='문의하기' 
                        onClick={handleWriteClick}
                        disabled={writeModalOpen || inquiryModalOpen}
                        style={{pointerEvents: (writeModalOpen||inquiryModalOpen) ? 'none' : 'auto'}}>
                        문의하기
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InquiryPage;