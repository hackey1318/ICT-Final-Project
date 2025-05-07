import { useState } from "react";

const ReporterDetail = ({ reports }) => {
    const [displayedReports, setDisplayedReports] = useState(4); // 4개씩 표시
    const [showMore, setShowMore] = useState(true); // '더보기' 버튼 상태

    const handleShowMore = () => {
        if (displayedReports + 4 >= reports.length) {
            setShowMore(false); // 끝까지 다 보이면 '더보기' 버튼 숨기기
        }
        setDisplayedReports(prev => prev + 4); // 4개씩 더 보여주기
    };

    const reportCategoryMap = {
        ABUSE: "욕설",
        CHEAT: "사기",
        ILLEGALAD: "불법광고",
        PORNOGRAPHY: "음란물게시",
        BADSPORT: "비매너행위",
        ETC: "기타"
    };

    const visibleReports = reports.slice(0, displayedReports);

    return (
        <div>
            <h4>신고 내역</h4>
            <div className="reporter-details">
                {reports ? (
                    reports.length > 0 ? (
                        visibleReports.map((report) => (
                            <div key={report.no} className="report-detail-item" style={{
                                backgroundColor: 'white',
                                padding: '12px',
                                margin: '8px 0',
                                borderRadius: '4px',
                                border: '1px solid #dee2e6'
                            }}>
                                <p>신고 번호: {report.no}</p>
                                <p>게시글 번호: {report.boardNo}</p>
                                <p>신고 카테고리: {reportCategoryMap[report.category]}</p>
                                <p>신고 내용: {report.content}</p>
                                <p>신고 대상: {report.targetNickname}</p>
                            </div>
                        ))
                    ) : (
                        <div>신고 내역이 없습니다.</div>
                    )
                ) : (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        로딩 중...
                    </div>
                )}

                {showMore && reports.length > displayedReports && (
                    <div id="show-more-container">
                        <button onClick={handleShowMore} id="show-more" title="더보기">
                            ▼
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReporterDetail;