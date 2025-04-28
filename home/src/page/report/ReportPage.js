import '../../css/admin/Report.css';
import ReportListSelector from './ReportListSelector';

function ReportPage() {
    return (
        <div className="report-container" style={{ padding: '20px 40px 0 40px', minWidth: '800px' }}>
            <h3>Admin Page - Report List</h3>
            <ReportListSelector />
        </div>
    );
}

export default ReportPage;