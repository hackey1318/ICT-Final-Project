import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import "../../css/md/MdList.css"
import { debounce } from "lodash"
import GoodsDescription from './GoodsDescription';
import apiClient from "../../js/public/axiosConfig";

function MdRegisterModal({ closeModal, refreshList, editTarget }) {
	const accessToken = sessionStorage.getItem("accessToken")

	const [form, setForm] = useState({
		name: "",
		movieNo: "",
		type: "",
		price: 0,
		options: "",
		count: 0,
		description: "",
	})

	const [movieSearch, setMovieSearch] = useState("")
	const [movieList, setMovieList] = useState([])
	const [showDropdown, setShowDropdown] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const [isInitialLoad, setIsInitialLoad] = useState(true)

	const [deletedImages, setDeletedImages] = useState([])
	const [existingImageUrls, setExistingImageUrls] = useState([])
	const [newImages, setNewImages] = useState([])
	const [newPreviews, setNewPreviews] = useState([])
	const fileInputRef = useRef()
	const optionRefs = useRef([])

	const fetchMovieList = async (search) => {
		try {
			const response = await apiClient.get(
				`/movies/titles?movieSearch=${encodeURIComponent(search)}`,
			)
			setMovieList(response.data)
			setHighlightedIndex(0)
		} catch (err) {
			console.error("영화 리스트 가져오기 실패:", err)
		}
	}

	const debouncedFetchMovieList = useCallback(debounce(fetchMovieList, 700), [])

	useEffect(() => {
		if (isInitialLoad) {
			// 초기 로딩이면 드롭다운 열지 않음
			setIsInitialLoad(false)
			return
		}
		if (movieSearch.length > 0) {
			debouncedFetchMovieList(movieSearch)
			setShowDropdown(true)
		} else {
			setShowDropdown(false)
			setMovieList([])
		}
	}, [movieSearch, debouncedFetchMovieList])

	useEffect(() => {
		if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
			optionRefs.current[highlightedIndex].scrollIntoView({ behavior: "smooth", block: "nearest" })
		}
	}, [highlightedIndex])

	useEffect(() => {
		if (editTarget) {
			setForm({
				name: editTarget.name,
				movieNo: editTarget.movieNo,
				type: editTarget.type,
				price: editTarget.price,
				options: editTarget.options || "",
				count: editTarget.count,
				description: editTarget.description || "",
			})
			setMovieSearch(editTarget.movieName || "")
			setExistingImageUrls(editTarget.imageUrls || [])
			setIsInitialLoad(true) // 초기 로딩 플래그 ON
		}
	}, [editTarget])

	const handleMovieSelect = (movie) => {
		setForm({ ...form, movieNo: movie.no })
		setMovieSearch(movie.name)
		setShowDropdown(false)
	}

	const handleKeyDown = (e) => {
		if (!showDropdown || movieList.length === 0) return
		if (e.key === "ArrowDown") {
			e.preventDefault()
			setHighlightedIndex((prev) => (prev + 1) % movieList.length)
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setHighlightedIndex((prev) => (prev === 0 ? movieList.length - 1 : prev - 1))
		} else if (e.key === "Enter") {
			e.preventDefault()
			if (highlightedIndex >= 0) {
				handleMovieSelect(movieList[highlightedIndex])
				document.activeElement.blur()
			}
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm({ ...form, [name]: value })
	}

	const handleSubmit = async () => {
		if (!form.name || !form.type || form.price < 0 || !form.movieNo || form.count < 0){
			alert("굿즈이름, 종류, 가격, 영화선택은 필수입력입니다.")
			return
		}

		let imageIdList = []

		if (newImages.length > 0) {
			const formData = new FormData()
			newImages.forEach((file) => formData.append("files", file))
			try {
				const res = await apiClient.post("/file-system/upload", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
				})
				imageIdList = res.data.map((img) => img.imageId)
			} catch (err) {
				console.error("이미지 업로드 실패", err)
				alert("이미지 업로드 중 오류 발생")
				return
			}
		}

		const payload = {
			...form,
			imageIdList,
			deletedImages,
		}

		try {
			if (editTarget) {
				await apiClient.put(`/md-shop/items?id=${editTarget.id}`, payload, )
				alert("수정 완료!")
			} else {
				await apiClient.post("/md-shop/items", payload, )
				alert("등록 완료!")
			}

			setForm({ name: "", movieNo: "", type: "", price: 0, options: "", count: 0, description: "" })
			setMovieSearch("")
			setExistingImageUrls([])
			setNewImages([])
			setNewPreviews([])
			refreshList()
			closeModal()
		} catch (err) {
			console.error("등록/수정 실패", err)
			alert("작업 실패")
		}
	}

	const handleImageUpload = (e) => {
		const selectedFile = Array.from(e.target.files)
		if (newImages.length + selectedFile.length + existingImageUrls.length > 5) {
			alert("이미지는 최대 5개까지 업로드 가능합니다.")
			return
		}
		const previews = selectedFile.map((file) => URL.createObjectURL(file))
		setNewImages((prev) => [...prev, ...selectedFile])
		setNewPreviews((prev) => [...prev, ...previews])
	}

	const handleRemoveExistingImage = (index) => {
		const removed = existingImageUrls[index]
		setDeletedImages((prev) => [...prev, removed])
		setExistingImageUrls((prev) => prev.filter((_, i) => i !== index))
	}

	const handleRemoveNewImage = (index) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index))
		setNewPreviews((prev) => prev.filter((_, i) => i !== index))
	}

	return (
		<div className="md_modal-overlay">
			<div className="md_modal-wrapper" style={{ maxWidth: "800px" }}>
				<div className="md_modal-content">
					<div className="md_modal-header">
						<h2 className="md_modal-title">굿즈 {editTarget ? "수정" : "등록"}</h2>
						<button className="md_close-btn" onClick={closeModal}>
							&times;
						</button>
					</div>

					<div className="md_modal-body" style={{ display: "flex", gap: "20px" }}>
						{/* 왼쪽 컬럼 - 나머지 필드들 */}
						<div style={{ flex: "1" }}>
							<div className="md_form-group">
								<label>굿즈명</label>
								<input type="text" name="name" className="md_form-input" value={form.name} onChange={handleChange} />
							</div>

							<div className="md_form-group movie-search-container">
								<label>영화 선택</label>
								<input
									type="text"
									className="md_form-input"
									value={movieSearch}
									onChange={(e) => setMovieSearch(e.target.value)}
									onFocus={() => {
										if (movieSearch.length > 0) {
											fetchMovieList(movieSearch)
											setShowDropdown(true)
										}
									}}
									onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
									onKeyDown={handleKeyDown}
									placeholder="영화명을 입력하세요"
								/>
								{form.movieNo && <div className="selected-movie">선택된 영화: {movieSearch}</div>}
								{showDropdown && (
									<div className="movie-dropdown">
										{movieList.length > 0 ? (
											movieList.map((item, index) => (
												<div
													key={item.no}
													ref={(el) => (optionRefs.current[index] = el)}
													className={`movie-option ${highlightedIndex === index ? "highlighted" : ""}`}
													onMouseDown={(e) => {
														e.preventDefault()
														handleMovieSelect(item)
													}}
												>
													{item.name}
												</div>
											))
										) : (
											<div className="movie-option">검색 결과 없음</div>
										)}
									</div>
								)}
							</div>

							<div className="md_form-group">
								<label>종류</label>
								<select name="type" className="md_form-input" value={form.type} onChange={handleChange}>
									<option value="">종류를 선택하세요</option>
									<option value="포스터">포스터</option>
									<option value="인형">인형</option>
									<option value="머그컵">머그컵</option>
									<option value="기타">기타</option>
								</select>
							</div>

							<div className="md_form-group">
								<label>가격</label>
								<input
									type="number"
									name="price"
									className="md_form-input"
									value={form.price}
									onChange={handleChange}
								/>
							</div>

							<div className="md_form-group">
								<label>수량</label>
								<input
									type="number"
									name="count"
									className="md_form-input"
									value={form.count}
									onChange={handleChange}
								/>
							</div>

							<div className="md_form-group">
								<label>옵션</label>
								<input
									type="text"
									name="options"
									className="md_form-input"
									value={form.options}
									onChange={handleChange}
								/>
							</div>

							<div className="md_option-buttons">
								<input
									type="file"
									accept="image/*"
									multiple
									style={{ display: "none" }}
									ref={fileInputRef}
									onChange={handleImageUpload}
								/>
								<button
									className="md_add-option-btn"
									onClick={() => fileInputRef.current && fileInputRef.current.click()}
								>
									+
								</button>
							</div>
							<div className="image-preview-list">
								{existingImageUrls.map((src, index) => (
									<div key={`existing-${index}`} className="image-preview-box">
										<img
											src={`/file-system/download/${src}`}
											alt={`기존-${index}`}
											onClick={() => handleRemoveExistingImage(index)}
										/>
									</div>
								))}
								{newPreviews.map((src, index) => (
									<div key={`new-${index}`} className="image-preview-box">
										<img src={src || "/placeholder.svg"} alt={`새-${index}`} onClick={() => handleRemoveNewImage(index)} />
									</div>
								))}
							</div>
						</div>

						{/* 오른쪽 컬럼 - 설명 필드 */}
						<div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
							<div className="md_form-group" style={{ height: "100%" }}>
								<label>설명</label>
								<GoodsDescription
									value={form.description}
									onChange={(html) =>
										setForm((prev) => ({ ...prev, description: html }))
									}
								/>
							</div>
						</div>
					</div>

					<div className="md_modal-footer">
						<button className="md_register-btn" onClick={handleSubmit}>
							{editTarget ? "수정" : "등록"}
						</button>
						<button className="md_cancel-btn" onClick={closeModal}>
							취소
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MdRegisterModal
