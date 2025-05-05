import { useEffect, useState } from "react";
import Pagination from "../../js/public/Pagination";
import { deactiveBadReporter, getReporterList, getReporterReports } from "../../js/api/reportApi";
import { FaSearch } from 'react-icons/fa';
import '../../css/admin/ReportDetail.css';
import ReporterDetail from "./ReporterDetail";
import { handleUserLogout } from "../../js/api/UserLogout";

const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('날짜 변환 중 오류:', error);
        return '날짜 없음';
    }
};

const statusMap = {
    ACTIVE: "활성",
    PENDING: "대기",
    DELETE: "삭제",
    DEACTIVE: "비활성 상태"
};

function ReporterList() {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [reporterList, setReporterList] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userReports, setUserReports] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReporters();
    }, [currentPage, pageSize]);

    const fetchReporters = async () => {
        setIsLoading(true);
        try {
            const data = await getReporterList(currentPage, pageSize);
            setReporterList(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleExpandUser = async (reporterNo) => {
        if (expandedUser === reporterNo) {
            setExpandedUser(null);
            return;
        }

        setExpandedUser(reporterNo);
        if (!userReports[reporterNo]) {
            try {
                const reports = await getReporterReports(reporterNo);
                setUserReports(prev => ({...prev, [reporterNo]: reports}));
            } catch (err) {
                if (err.response.status === 423) {
                    handleUserLogout();
                }
                console.error('신고 내역을 불러오는데 실패했습니다:', err);
            }
        }
    };

    const handleDeactiveUser = (reporterNo) => {
        const confirmed = window.confirm("해당 계정을 비활성화하시겠습니까?");
        if(confirmed) {
            deactiveBadReporter(reporterNo)
                .then(() => {
                    setReporterList(prev => prev.map(reporter => 
                        reporter.reporterNo === reporterNo ? {...reporter, status: 'DEACTIVE'} : reporter
                    ));
                    alert("해당 계정이 비활성화되었습니다.");
                })
                .catch((err) => {
                    alert(`비활성화 처리 중 오류가 발생했습니다 : ${err.message}`);
                });
        }
    }

    return (
        <div className="reporter-list-container">
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>오류 : {error}</div>}
            <div id="reporter-info-container">
                <ul style={{ fontWeight: 'bold' }}>
                    <li>신고자 ID</li>
                    <li>이메일</li>
                    <li>신고횟수</li>
                    <li>최근 신고일</li>
                    <li>신고자상태</li>
                    <li>상세보기
                        {
                            <div id="reporter-detail"></div>
                        }
                    </li>
                </ul>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
                ) : reporterList.map((reporter) => (
                    <div key={reporter.reporterNo}>
                        <ul className="reporter-item-row">
                            <li>
                                <span id="bad-report" title="부적절한 신고" onClick={() => handleDeactiveUser(reporter.reporterNo)}>
                                    🚨
                                </span>{reporter.userId}
                            </li>
                            <li>{reporter.email}</li>
                            <li>{reporter.reportCount}</li>
                            <li>{formatDate(reporter.lastReportDate)}</li>
                            <li style={{color: reporter.status==='ACTIVE' ? 'skyblue' : 'orange', fontWeight: 'bold'}}>
                                {statusMap[reporter.status] || reporter.status}
                            </li>
                            <li>
                                <FaSearch
                                    className="search-icon"
                                    onClick={() => handleExpandUser(reporter.reporterNo)}
                                />
                            </li>
                        </ul>

                        {expandedUser === reporter.reporterNo && userReports[reporter.reporterNo] && (
                            <ReporterDetail reports={userReports[reporter.reporterNo]} />
                        )}
                    </div>
                ))}

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

export default ReporterList;
