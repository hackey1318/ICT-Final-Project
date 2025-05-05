import { createReport } from "js/api/reportApi";
import { handleUserLogout } from "js/api/UserLogout";
import { useEffect, useState } from "react";

function ReportMovieReview({ isOpen, onClose, targetType, targetContentId, targetTitle }) {
    const reportCategory = {
        ABUSE: "욕설",
        CHEAT: "사기",
        ILLEGALAD: "불법광고",
        PORNOGRAPHY: "음란물게시",
        BADSPORT: "비매너행위",
        ETC: "기타"
    };
    const [selectedCategory, setSelectedCategory] = useState("");
    const [reportedContent, setReportedContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(!isOpen) {
            setSelectedCategory('');
            setReportedContent('');
            setErrorMessage('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        if(e.target.value !== "ETC") {
            setErrorMessage("");
        }
    };

    const handleContentChange = (e) => {
        setReportedContent(e.target.value);
        if(selectedCategory === "ETC" && e.target.value.trim() !== "") {
            setErrorMessage("");
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrorMessage("");

        if(!selectedCategory) {
            setErrorMessage("신고사유를 선택해주세요.");
            return;
        }
        if(selectedCategory === 'ETC' && reportedContent.trim() === "") {
            setErrorMessage("기타 사유는 내용을 입력해야합니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            const reportData = {
                type: targetType,
                boardId: targetContentId,
                category: selectedCategory,
                content: reportedContent,
            };

            await createReport(reportData);
            alert("신고가 성공적으로 접수되었습니다.");
            onClose();
        } catch(error) {
            setErrorMessage(error.message || "신고 처리 중 오류가 발생했습니다.");
            if (error.response.status === 423) {
                handleUserLogout();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if(!isOpen) {
        return null;
    }

    const stopPropagation = e => e.stopPropagation();

    return (
        <div className="report-modal-overlay" onClick={onClose}>
            <div className="report-modal-container">

            </div>
        </div>
    )
}

export default ReportMovieReview;
