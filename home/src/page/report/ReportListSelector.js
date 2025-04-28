import { useState } from "react";
import ReportList from "./ReportList";
import ReporterList from "./ReporterList";


function ReportListSelector() {
    const [viewMode, setViewMode] = useState('reporters');

    return (
        <div className="report-container" style={{padding: '20px 40px 0 40px', minWidth: '800px'}}>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value)}
                    style={{
                        padding: '8px',
                        fontSize: '16px',
                        borderRadius: '4px'
                    }}
                >
                    <option value="reports">신고 목록 조회</option>
                    <option value="reporters">신고자 조회</option>
                </select>
            </div>

            {viewMode === 'reports' ? (
                <ReportList />
            ) : (
                <ReporterList />
            )}
        </div>
    );
}

export default ReportListSelector;