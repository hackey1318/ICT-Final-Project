import '../../css/admin/ReportDetail.css';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReportByNo, updateReportStatus } from "../../js/api/reportApi";
import { handleUserLogout } from '../../js/api/UserLogout';


const reportCategoryMap = {
    ABUSE: "욕설",
    CHEAT: "사기",
    ILLEGALAD: "불법광고",
    PORNOGRAPHY: "음란물게시",
    BADSPORT: "비매너행위",
    ETC: "기타"
}
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
const reportStatusOptions = [
    { value: "PENDING", label: "대기중" },
    { value: "PROCESSING", label: "처리중" },
    { value: "ACCEPTED", label: "처리완료(승인)" },
    { value: "REJECTED", label: "처리완료(반려)" },
];

function ReportDetail() {
    const {no} = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchReportDetail = async () => {
        setIsLoading(true);
        setError(null);
        try{
            const data = await getReportByNo(no);
            setReport(data);
            setCurrentStatus(data.status || '');
        } catch(err) {
            if (err.response.status === 423) {
                handleUserLogout();
            }
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(no) {
            fetchReportDetail();
        }
    }, [no]);

    const handleStatusChange = (e) => {
        setCurrentStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        if(!currentStatus || currentStatus === report?.status) {
            alert("변경할 상태를 선택해주세요.");
            return;
        }
        setIsUpdating(true);
        setError(null);
        try{
            await updateReportStatus(no, currentStatus);
            alert(`신고처리가 ${currentStatus}로 변경되었습니다.`)
            await fetchReportDetail();
        } catch (err) {
            if (err.response.status === 423) {
                    handleUserLogout();
            }
            setError(err.message);
            alert(`신고 처리 중 오류 발생 : ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const backToList = () => {
        navigate('/manager/home/reportPage');
    };

    if(isLoading) return <div className="report-detail-container loading"> 로딩 중... </div>;
    if(error) return <div className="report-detail-container error">오류 : {error}</div>
    if(!report) return <div className="report-detail-container not-found">신고 정보를 찾을 수 없습니다.</div>;

    const formattedDate = report.createdAt ? new Date(report.createdAt).toLocaleString('ko-KR') : 'N/A';
    const isFinished = report.status === 'ACCEPTED' || report.status === 'REJECTED';

    return (
        <div className='m-5'>
            <h3>{report.reporterNickname}님의 신고글</h3>

            <div className="detail-section">
                <div className="detail-row">
                    <span className="detail-label">신고자:</span>
                    <span className="detail-value">{report.reporterNickname || '알 수 없음'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">피신고자:</span>
                    <span className="detail-value">{report.targetNickname || '알 수 없음'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">신고 날짜:</span>
                    <span className="detail-value">{formattedDate}</span>
                </div>
            </div>

            <div className="detail-section">
                <div className="detail-row">
                    <span className="detail-label">게시판 종류:</span>
                    <span className="detail-value">{reportTypeMap[report.type] || report.type}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">게시글 번호:</span>
                    {/* 게시글 번호를 클릭하면 해당 게시글로 이동하는 링크 (선택 사항) */}
                    <span className="detail-value">{report.boardNo}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">신고 분류:</span>
                    <span className="detail-value">{reportCategoryMap[report.category] || report.category}</span>
                </div>
            </div>

            <div className="detail-section report-content-section">
                <div className="detail-label">신고 내용:</div>
                {/* pre 태그를 사용하면 줄바꿈 등이 유지됨 */}
                <pre className="detail-value report-content">{report.content}</pre>
            </div>

            <div className="detail-section report-status-section">
                <div className="detail-row">
                    <label htmlFor="reportStatus" className="detail-label">처리 상태:</label>
                    <div className="status-update-controls">
                        <select
                            id="reportStatus"
                            className="form-select form-select-sm"
                            value={currentStatus}
                            onChange={handleStatusChange}
                            disabled={isUpdating} // 업데이트 중 비활성화
                            style={{ width: '180px', marginRight: '10px' }}
                        >
                            {/* <option value="" disabled>-- 상태 선택 --</option> */}
                            {reportStatusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleUpdateStatus}
                            disabled={isUpdating || currentStatus === report.status} // 업데이트 중이거나 상태 변경 없을 시 비활성화
                            className="btn btn-primary btn-sm"
                        >
                            {isUpdating ? '변경 중...' : '상태 변경'}
                        </button>
                    </div>
                </div>
                <div className='detail-row' style={{marginTop: '5px'}}>
                    <span className='detail-label'></span> {/* 간격 맞춤용 */}
                    <span className={`status-indicator status-${report.status?.toLowerCase()}`}>
                        현재 상태: {reportStatusMap[report.status] || report.status}
                    </span>
                </div>
            </div>

            <div className="detail-actions">
                <button onClick={backToList} className="btn btn-secondary">목록으로</button>
            </div>
        </div>
    )
}

export default ReportDetail;