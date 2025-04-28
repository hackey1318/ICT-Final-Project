import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../js/public/Pagination";
import { getReportList, updateReportStatus } from "../../js/api/reportApi";

const reportCategoryMap = {
    ABUSE: "욕설",
    CHEAT: "사기",
    ILLEGALAD: "불법광고",
    PORNOGRAPHY: "음란물게시",
    BADSPORT: "비매너행위",
    ETC: "기타"
};

const reportTypeMap = {
    MOVIEREVIEW: "영화리뷰",
    GOODSREVIEW: "굿즈리뷰",
    CINEMATE: "시네메이트"
};

const reportStatusMap = {
    PENDING: "대기중",
    PROCESSING: "처리중",
    ACCEPTED: "처리완료",
    REJECTED: "처리완료"
};

function ReportList() {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [isLoading, setIsLoading] = useState(false);
    const [reportList, setReportList] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchReports = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getReportList(currentPage, pageSize);
            setReportList(data.content || []);
            setTotalPages(data.totalPages || 0);
            console.log("Fetched reports : ", data.content);
        } catch (err) {
            console.error("Failed to fetch reports : ", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const reportView = (reportNo) => {
        navigate(`/manager/home/report/${reportNo}`);
    }

    const handleReportAction = async (reportNo, action) => {
        const actionText = action === 'accept' ? '승인' : '반려';
        if (!window.confirm(`해당 신고를 ${actionText}하시겠습니까?`)) {
            return;
        }
    
        try {
            const status = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
            const response = await updateReportStatus(reportNo, status);
            
            if (response && response.isBlacklisted) {
                alert("신고가 3회 누적되어 해당 사용자가 블랙리스트 처리되었습니다.");
            }
            await fetchReports();
        } catch (err) {
            console.error(`Failed to ${action} report:`, err);
            setError(err.message);
        }
    };

            return (
                <div>
                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>오류 : {error}</div>}
                    <div id="report-info-container">
                        <ul style={{ fontWeight: 'bold' }}>
                            <li>번호</li>
                            <li style={{ cursor: 'auto' }}>신고종류</li>
                            <li>게시판</li>
                            <li>게시글번호</li>
                            <li>신고날짜</li>
                            <li>진행상황</li>
                            <li>관리</li>
                        </ul>

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
                        ) : reportList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>신고 내역이 없습니다.</div>
                        ) : (
                            reportList.map((item) => {
                                const formattedDate = new Date(item.createdAt).toLocaleDateString('ko-KR');
                                const isFinished = (item.status === 'ACCEPTED' || item.status === 'REJECTED');

                                return (
                                    <ul key={item.no} className='report-item-row'>
                                        <li>{item.no}</li>
                                        <li onClick={() => reportView(item.no)} style={{ cursor: 'pointer' }}>{reportCategoryMap[item.category] || item.category}</li>
                                        <li>{reportTypeMap[item.type || item.type]}</li>
                                        <li>{item.boardNo}</li>
                                        <li>{formattedDate}</li>
                                        <li style={{ color: isFinished ? 'blue' : 'orange', fontWeight: 'bold' }}>
                                            {reportStatusMap[item.status] || item.status}
                                        </li>
                                        <li>
                                            {!isFinished ? (
                                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                    <button className="accept" onClick={() => handleReportAction(item.no, 'accept')}>
                                                        승인
                                                    </button>
                                                    <button className="deny" onClick={() => handleReportAction(item.no, 'reject')}>
                                                        거절
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{
                                                    color: item.status === 'ACCEPTED' ? '#28a745' : '#dc3545',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {item.status === 'ACCEPTED' ? '승인' : '반려'}
                                                </span>
                                            )}
                                        </li>
                                    </ul>
                                )
                            })
                        )}

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            {totalPages > 0 && !isLoading && (
                                <Pagination
                                    page={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            );
        }

export default ReportList;