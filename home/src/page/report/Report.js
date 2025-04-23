import { useState } from 'react';
import '../../css/admin/Report.css';
import Pagination from '../../js/public/Pagination';
import { Link, useNavigate } from 'react-router-dom';

function Report() {
    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0);   
    const [pageSize, setPageSize] = useState(9);
    const [isLoading, setIsLoading] = useState(false);
    const [reportList, setReportList] = useState([]);
    const navigate = useNavigate();

    const handlePageChange = (newPage) => {
        console.log(newPage, "페이지변경$$$$$$$$$$$$$$$");
        setCurrentPage(newPage);
    };

    function reportView() {

    }

    return (
        <div className="report-container" style={{padding: '20px 40px 0 40px'}}>
            <h3>Admin Page - Report List</h3>
            <div id="report-info-container">
                <ul style={{fontWeight: 'bold'}}>
                    <li>번호</li>
                    <li style={{cursor: 'auto'}}>신고 종류</li>
                    <li>게시판</li>
                    <li>게시글번호</li>
                    <li>신고날짜</li>
                    <li>진행상황</li>
                </ul>

                {
                    reportList.map((item) => {
                        // const isUpdating = updateStatus[item.no] || false;
                        const isDeleted = item.status === 'DELETE';
    
                        return (
                            <ul id="inquiryReplyList" onClick={() => reportView(item.no)}>
                                <li>{item.no}</li>
                                <li>{item.subject}</li>
                                <li>{item.nickname}</li>
                                <li>{new Date(item.createdAt).toLocaleDateString()}</li>
                                <li>
                                    {/* <select
                                        className="form-select form-select-sm"
                                        value={isDeleted ? 'CLOSED' : (item.proceed || '')}
                                        onChange={(e) => handleStatusChangeInList(e, item.no, item.proceed)}
                                        disabled={isDeleted || isUpdating}
                                        style={{ minWidth: '100px', lineHeight: '25px', marginTop: '7px',
                                                 cursor: isDeleted ? 'not-allowed' : 'pointer',
                                                 backgroundColor: isDeleted ? '#e9ecef' : ''}}
                                    >
                                        <option value="BEFORE">처리 전</option>
                                        <option value="PROCEEDING">처리 중</option>
                                        <option value="CLOSED">처리 완료</option>
                                    </select> */}
                                </li>
                                <li style={{ color: isDeleted ? 'red' : 'inherit' }}>{item.status}</li>
                            </ul>
                        )
                    })
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

export default Report;