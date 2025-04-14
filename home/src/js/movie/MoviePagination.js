import { useEffect, useState } from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
    const [inputValue, setInputValue] = useState(page + 1); // 1-based 표기

    useEffect(() => {
        setInputValue(page + 1); // 외부 page 값이 바뀌면 inputValue도 동기화
    }, [page]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(inputValue, 10);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber - 1);
        }
    };

    const goToFirst = () => onPageChange(0);
    const goToLast = () => onPageChange(totalPages - 1);
    const goToPrev = () => onPageChange(Math.max(0, page - 1));
    const goToNext = () => onPageChange(Math.min(totalPages - 1, page + 1));

    return (
        <div className="d-flex align-items-center justify-content-center gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={goToFirst} disabled={page === 0}>
                &laquo;
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={goToPrev} disabled={page === 0}>
                &lsaquo;
            </button>

            <form onSubmit={handleInputSubmit} className="d-flex align-items-center gap-1">
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                    style={{ width: "60px", textAlign: "center" }}
                />
                <span>/ {totalPages}</span>
            </form>

            <button className="btn btn-outline-secondary btn-sm" onClick={goToNext} disabled={page === totalPages - 1}>
                &rsaquo;
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={goToLast} disabled={page === totalPages - 1}>
                &raquo;
            </button>
        </div>
    );
}