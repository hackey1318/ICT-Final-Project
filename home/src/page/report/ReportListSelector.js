import { useState } from "react";
import ReportList from "./ReportList";
import ReporterList from "./ReporterList";
import "../../css/admin/ReportList.css";

function ReportListSelector() {
    const [viewMode, setViewMode] = useState('reporters');

    return (
        <div className="report-list-selector__container">
            <div className="report-list-selector__tab-container">
                <button
                    className={`report-list-selector__tab-button ${viewMode === 'reporters' ? 'active' : ''}`}
                    onClick={() => setViewMode('reporters')}
                >
                    신고자 조회
                </button>
                <button
                    className={`report-list-selector__tab-button ${viewMode === 'reports' ? 'active' : ''}`}
                    onClick={() => setViewMode('reports')}
                >
                    신고 목록 조회
                </button>
            </div>

            {viewMode === 'reports' ? <ReportList /> : <ReporterList />}
        </div>
    );
}

export default ReportListSelector;
