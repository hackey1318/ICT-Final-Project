import { useEffect, useState } from 'react';
import '../../css/admin/Report.css';
import Pagination from '../../js/public/Pagination';
import { useNavigate } from 'react-router-dom';
import { getReportList } from '../../js/api/reportApi';

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
    ACCEPTED: "처리완료(승인)",
    REJECTED: "처리완료(반려)"
};

function ReportPage() {
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
        } catch(err) {
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

    return (
        <div className="report-container" style={{padding: '20px 40px 0 40px', minWidth: '800px'}}>
            <h3>Admin Page - Report List</h3>
            {error && <div style={{color:'red', marginBottom:'10px'}}>오류 : {error}</div>}
            <div id="report-info-container">
                <ul style={{fontWeight: 'bold'}}>
                    <li>번호</li>
                    <li style={{cursor: 'auto'}}>신고종류</li>
                    <li>게시판</li>
                    <li>게시글번호</li>
                    <li>신고날짜</li>
                    <li>진행상황</li>
                </ul>

                {   isLoading ? (
                    <div style={{textAlign:'center', padding:'20px'}}>로딩 중...</div>
                ) : reportList.length === 0 ? (
                    <div style={{textAlign:'center', padding:'20px'}}>신고 내역이 없습니다.</div>
                ) : (
                        reportList.map((item) => {
                            const formattedDate = new Date(item.createdAt).toLocaleDateString('ko-KR');
                            const isFinished = (item.status === 'ACCEPTED' || item.status === 'REJECTED');
        
                            return (
                                <ul key={item.no} className='report-item-row'>
                                    <li>{item.no}</li>
                                    <li onClick={() => reportView(item.no)} style={{cursor:'pointer'}}>{reportCategoryMap[item.category] || item.category}</li>
                                    <li>{reportTypeMap[item.type || item.type]}</li>
                                    <li>{item.boardNo}</li>
                                    <li>{formattedDate}</li>
                                    <li style={{color:isFinished?'blue':'orange', fontWeight:'bold'}}>
                                        {reportStatusMap[item.status] || item.status}
                                    </li>
                                </ul>
                            )
                        })
                    )
                }

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

export default ReportPage;