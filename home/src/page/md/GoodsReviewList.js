import { useEffect, useState } from 'react';
import axios from '../../js/public/axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './../../css/md/GoodsReviewSection.css';
import './../../css/md/GoodsReportModal.css';
import { createReport } from "../../js/api/reportApi";
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess';
import apiClient from '../../js/public/axiosConfig';

const currentUserNo = JSON.parse(sessionStorage.getItem('userInfo'))?.userNo;

export default function GoodsReviewList({
	goodsId,
	refreshKey,
	onReviewsLoad,  // 리뷰 목록 로드 콜백
	onSelectReview  // 리뷰 선택 콜백 추가
}) {
	const [reviews, setReviews] = useState([]);
	const [dropdownOpen, setDropdownOpen] = useState(null); // 드롭다운 상태 관리
	const [showReportModal, setShowReportModal] = useState(false); // 신고 모달 상태 관리
	const [reportData, setReportData] = useState({ category: '', content: '' }); // 신고 데이터 관리
	const [currentReviewId, setCurrentReviewId] = useState(null); // 현재 리뷰 ID 관리

	useEffect(() => {
		fetchReviews(); // goodsId나 refreshKey가 바뀔 때마다 리뷰를 다시 불러옴
	
		// 모달 열릴 때 body 스크롤 비활성화
		if (showReportModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto'; // 모달 닫힐 때 스크롤 복원
		}
	
		return () => {
			document.body.style.overflow = 'auto'; // 컴포넌트가 언마운트될 때 스크롤 복원
		};
	  }, [goodsId, refreshKey, showReportModal]); // 의존성 배열에 showReportModal 추가
	

	const fetchReviews = async () => {
		try {
			const { data } = await apiNoAccessClient.get(`/goods/${goodsId}/reviews`);
			console.log("리뷰 데이터 상세:", {
				전체_데이터: data,
				첫번째_리뷰_상세: data[0],
				리뷰_필드목록: data[0] ? Object.keys(data[0]) : []
			});

			const reviewsWithUrls = data.map(r => ({
				...r,
				imageUrls: r.imageIds.map(id => `/file-system/download/${id}`)
			}));

			setReviews(reviewsWithUrls);
			if (onReviewsLoad) {
				onReviewsLoad(data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	// 리뷰 삭제 함수 추가
	const handleDeleteReview = async (reviewId) => {
		if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
			return;
		}

		try {
			await apiClient.delete(`/goods/${goodsId}/reviews/${reviewId}`);
			alert('리뷰가 삭제되었습니다.');
			fetchReviews(); // 리뷰 목록 새로고침
		} catch (err) {
			console.error('리뷰 삭제 오류', err);
			alert('리뷰 삭제에 실패했습니다.');
		}
	};

	const handleReportReview = (reviewId) => {
		setCurrentReviewId(reviewId);
		setShowReportModal(true);
		setDropdownOpen(null);
	};

	const handleReportChange = (e) => {
		const { name, value } = e.target;

		// 카테고리가 '기타'일 경우, 내용은 빈 값으로 초기화
		if (name === 'category' && value !== '기타') {
			setReportData((prevData) => ({
				...prevData,
				[name]: value,
				content: getDefaultReportContent(value),  // 기본 내용으로 채움
			}));
		} else if (name === 'category' && value === '기타') {
			setReportData((prevData) => ({
				...prevData,
				[name]: value,
				content: '',  // '기타' 선택 시 content를 빈 값으로 초기화
			}));
		} else {
			setReportData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

	const handleReportSubmit = async () => {
		if (!window.confirm('정말로 이 리뷰를 신고하시겠습니까?')) {
			return;
		}

		if (!reportData.category || !reportData.content) {
			alert('신고 내용을 모두 입력해주세요.');
			return;
		}

		try {
			const reportRequest = {
				boardNo: currentReviewId,
				category: reportData.category,
				content: reportData.content,
				type: "GOODSREVIEW",
			};
			await createReport(reportRequest);
			alert("신고가 접수되었습니다.");
			setShowReportModal(false); // 신고 후 모달 닫기
		} catch (err) {
			console.error('리뷰 신고 오류', err);
			alert('리뷰 신고에 실패했습니다.');
		}
	};

	const toggleDropdown = (index) => {
		setDropdownOpen(dropdownOpen === index ? null : index);
	}

	const getDefaultReportContent = (category) => {
		switch (category) {
			case 'ABUSE':
				return '해당 리뷰에는 욕설이 포함되어 있습니다.';
			case 'CHEAT':
				return '해당 리뷰는 사기성 내용입니다.';
			case 'ILLEGALAD':
				return '해당 리뷰는 불법광고를 포함하고 있습니다.';
			case 'PORNOGRAPHY':
				return '해당 리뷰는 음란물을 포함하고 있습니다.';
			case 'BADSPORT':
				return '해당 리뷰는 비매너적인 내용을 포함하고 있습니다.';
			case 'ETC':
				return '';
			default:
				return '';
		}
	};

	return (
		<div className="goods-review-list">
			{reviews.map((r, index) => (
				<div key={r.id} className="review-item">
					<div className="review-header">
						<h3>{r.title} ({r.rating}점)</h3>
						<div className="review-actions">
							{currentUserNo && currentUserNo === r.userNo && ( // 로그인한 사용자가 작성한 리뷰일 경우만 수정/삭제 버튼 표시
								<>
									<button
										className="btn btn-sm btn-outline-primary me-2"
										onClick={() => onSelectReview && onSelectReview(r)}
									>
										수정
									</button>
									<button
										className="btn btn-sm btn-outline-danger"
										onClick={() => handleDeleteReview(r.id)}
									>
										삭제
									</button>
								</>
							)}
							<button
								className="btn btn-sm btn-outline-secondary"
								onClick={() => toggleDropdown(index)}  // 드롭다운 토글
							>
								⋮
							</button>
							{dropdownOpen === index && (
								<div
									className={`dropdown-menu ${dropdownOpen === index ? 'open' : ''}`}  // dropdownOpen에 따라 'open' 클래스 추가
								>
									<button className="dropdown-item" onClick={() => handleReportReview(r.id)}>리뷰 신고</button>
								</div>
							)}
							{/* 신고하기 모달 */}
							{showReportModal && (
								<div className="modal goods-review-modal">
									<div className="report-modal-content">
										<h4>리뷰 신고</h4>
										<div className="review-details">
											<p><strong>리뷰 제목:</strong> {reviews.find(r => r.id === currentReviewId)?.title}</p>
											<p><strong>리뷰 내용:</strong></p>
											<div className="review-content">
												{reviews.find(r => r.id === currentReviewId)?.content}
											</div> {/* 리뷰 내용 그대로 표시 */}
										</div>
										<label htmlFor="category">신고 사유:</label>
										<select
											id="category"
											name="category"
											value={reportData.category}
											onChange={handleReportChange}
										>
											<option value="">선택하세요</option>
											<option value="ABUSE">욕설</option>
											<option value="CHEAT">사기</option>
											<option value="ILLEGALAD">불법광고</option>
											<option value="PORNOGRAPHY">음란물게시</option>
											<option value="BADSPORT">비매너행위</option>
											<option value="ETC">기타</option>
										</select>

										<label htmlFor="content">신고 내용:</label>
										<textarea
											className='report-textarea'
											id="content"
											name="content"
											value={reportData.category === '기타' ? reportData.content : getDefaultReportContent(reportData.category)}
											onChange={handleReportChange}
											placeholder="신고 사유를 자세히 작성해 주세요."
											disabled={reportData.category !== '기타'} // '기타' 선택시만 수정 가능
											style={{
												height: 'auto', // 자동 높이 조정
												resize: 'none', // 사용자가 크기를 수정할 수 없도록
											}}
										></textarea>

										<div className='report-button-group'>
											<button onClick={handleReportSubmit} className="btn btn-danger">신고하기</button>
											<button onClick={() => setShowReportModal(false)} className="btn btn-secondary">취소</button>
										</div>
									</div>
								</div>
							)}

						</div>
					</div>
					{r.imageUrls.length > 0 && (
						<Swiper
							modules={[Navigation, Pagination]}
							navigation
							pagination={{ clickable: true }}
							className="review-swiper"
						>
							{r.imageUrls.map((url, idx) => (
								<SwiperSlide key={idx}>
									<img src={url} alt={`리뷰 이미지 ${idx + 1}`} className="review-image" />
								</SwiperSlide>
							))}
						</Swiper>
					)}
					<p>{r.content}</p>
				</div>
			))}
		</div>
	);
}
