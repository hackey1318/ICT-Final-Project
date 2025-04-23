export default function BannerDetailModal({ show, banner, onClose, onEdit }) {
    if (!show || !banner) return null;

    return (
        <div className="custom-modal-wrapper" onClick={onClose}>
            <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h5 className="modal-title">배너 상세 정보</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">배너 제목</label>
                        <input type="text" className="form-control" value={banner.targetName} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">타입</label>
                        <input type="text" className="form-control" value={banner.type} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">배경 색상</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    backgroundColor: banner.color,
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            />
                            <span>{banner.color}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">시작 날짜</label>
                        <input type="text" className="form-control" value={new Date(banner.startDate).toLocaleDateString()} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">종료 날짜</label>
                        <input type="text" className="form-control" value={new Date(banner.endDate).toLocaleDateString()} readOnly />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline-primary" onClick={() => onEdit(banner)}>수정</button>
                    <button className="btn btn-secondary" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}
