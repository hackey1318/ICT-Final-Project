import { useEffect, useState,useCallback } from "react";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";
import { useNavigate } from "react-router-dom";
import '../../css/admin/InquiryReply.css';
import apiClient from "../../js/public/axiosConfig";
import Pagination from "../../js/public/Pagination";
import Button from "../../js/common/Buttons";

function InquiryReply() {
    const [inquiryList, setInquiryList] = useState([]);
    const navigate = useNavigate();
    const [updateStatus, setUpdateStatus] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [isLoading, setIsLoading] = useState(false);

    // 검색어 예시
    const handleSearch = e => {
        e.preventDefault();
        //setPage(0);
        //getUserList();
      };

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
        <div className="inquiryreply-wrap">
            <h3 className="inquiryreply-title">회원 문의 목록</h3>

            {/* 검색어 예시 */}
            <form className="d-flex justify-content-end mb-3" onSubmit={handleSearch}>
                <div className="inquiryreply_search-container">
                    <select /*value={searchType}
                            onChange={(e) => setSearchType(e.target.value)} */
                            style={{ padding: '12px' }}
                            className="inquiryreply_dropdown">
                        <option value="inquiryreplySubject">제목</option>
                        <option value="inquiryreplyNickname">작성자</option>
                    </select>
                    <input
                        type="text"
                        /*value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}*/
                        style={{ padding: '10px' }}
                        placeholder="검색어를 입력하세요"
                    />
                    <Button variant='primary'
                            /*onClick={() => { setPage(0); getUserList(); }}*/
                    >
                        검색
                    </Button>
                </div>
            </form>

            <div className="inquiryreply-container">
                <table className="inquiryreply-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성날짜</th>
                            <th>진행상황</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            inquiryList.map((item) => {
                                return (
                                    <tr className="inquiryreplylist">
                                        <td>{item.no}</td>
                                        <td onClick={() => inquiryReplyView(item.no)}>{item.subject}</td>
                                        <td>{item.nickname}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td>
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
                                        </td>
                                        <td>{item.status}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
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