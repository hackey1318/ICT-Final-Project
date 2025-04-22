import { useEffect, useState,useCallback } from "react";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";
import { useNavigate } from "react-router-dom";
import '../../css/admin/InquiryReply.css';
import Pagination from "../../js/public/Pagination";
import apiClient from "../../js/public/axiosConfig";

function InquiryReply() {
    const [inquiryList, setInquiryList] = useState([]);
    const navigate = useNavigate();
    const [updateStatus, setUpdateStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [isLoading, setIsLoading] = useState(false);

    const getInquiryList = useCallback( async (page=0) => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/inquiry/getAllInquiry?page=${page}&size=${pageSize}`);
            if(response.data && response.data.content != null && response.data.totalPages != null) {
                setInquiryList(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(response.data);
            } else {
                console.error("잘못된 API 응답구조", response.data);
                setInquiryList([]);
                setTotalPages(0);
            }
        } catch(error) {
            console.log("관리자 문의 목록 로딩 error발생 : ", error.response?.data);
            setInquiryList([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        getInquiryList(currentPage);
    }, [currentPage, getInquiryList]);

    const handleStatusChangeInList = async (event, inquiryNo, currentStatus) => {
        const newStatus = event.target.value;
        const statusMap = { BEFORE: '처리 전', PROCEEDING: '처리 중', CLOSED: '처리 완료' };
        const confirmMessage = `"${inquiryNo}번 문의"의 상태를 "${statusMap[newStatus] || newStatus}"(으)로 변경하시겠습니까?`;

        if (!window.confirm(confirmMessage)) {
            event.target.value = currentStatus;
            return;
        }
        setUpdateStatus(prevMap => ({ ...prevMap, [inquiryNo]: true }));

        apiClient.patch(`/inquiry/${inquiryNo}/proceedStatus`, {proceed: newStatus})
            .then(response => {
                if (response.data?.result === true) {
                    setInquiryList(prevList =>
                        prevList.map(item =>
                            item.no === inquiryNo
                                ? { ...item, proceed: newStatus, proceedDescription: statusMap[newStatus] }
                                : item
                        )
                    );
            } else {
                alert(response.data?.message || "상태 변경에 실패했습니다.");
            }
        })
    }

    const inquiryReplyView = (no) => {
        navigate(`/manager/home/inquiry/${no}`);
    };

    const handlePageChange = (newPage) => {
        console.log(newPage, "페이지변경$$$$$$$$$$$$$$$");
        setCurrentPage(newPage);
    };

    return (
        <div id="inquiryreply-container">
            <h3>회원 문의 목록</h3>

            <div className="inquiryreply-list">
            <ul>
                <li><div className="inquiryreply-list-title">번호</div></li>
                <li><div className="inquiryreply-list-title">제목</div></li>
                <li><div className="inquiryreply-list-title">작성자</div></li>
                <li><div className="inquiryreply-list-title">작성날짜</div></li>
                <li><div className="inquiryreply-list-title">진행상황</div></li>
                <li><div className="inquiryreply-list-title">상태</div></li>
            </ul>

            {
                inquiryList.map((item) => {
                    return (
                        <ul id="inquiryReplyList">
                            <li>{item.no}</li>
                            <li onClick={() => inquiryReplyView(item.no)}>{item.subject}</li>
                            <li>{item.nickname}</li>
                            <li>{new Date(item.createdAt).toLocaleDateString()}</li>
                            <li>
                                <select
                                    className="form-select form-select-sm"
                                    value={item.proceed || ''}
                                    onChange={(e) => handleStatusChangeInList(e, item.no)}
                                    style={{ minWidth: '100px', lineHeight: '25px', marginTop: '7px' }}
                                >
                                    <option value="BEFORE">처리 전</option>
                                    <option value="PROCEEDING">처리 중</option>
                                    <option value="CLOSED">처리 완료</option>
                                </select>
                            </li>
                            <li>{item.status}</li>
                        </ul>
                    )
                })
            }
            </div>

            <div className="paging-container">
                {currentPage > 0 && (
                    <button className="page-buttons" onClick={() => handlePageChange(currentPage - 1)}>
                        이전
                    </button>
                )}

                <div className="page-buttons">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={currentPage === i ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {currentPage < totalPages - 1 && (
                    <button className="page-buttons" onClick={() => handlePageChange(currentPage + 1)}>
                        다음
                    </button>
                )}
            </div>
        </div>
    );
}

export default InquiryReply;