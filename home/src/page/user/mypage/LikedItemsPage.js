import { useEffect, useState } from "react"
import axios from "axios"
import "../../../css/user/mypage/LikedItemsPage.css"

const LikedItemsPage = () => {
    const [activeTab, setActiveTab] = useState("movie")
    const [likedItems, setLikedItems] = useState([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const size = 8

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/likes`, {
                    params: {
                        type: activeTab,
                        page,
                        size,
                    },
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                })
                setLikedItems(response.data.content)
                setTotalPages(response.data.totalPages)
            } catch (error) {
                console.error("데이터 불러오기 실패:", error)
            }
        }

        fetchData()
    }, [activeTab, page])

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setPage(0) // 탭 바뀌면 페이지도 초기화
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage)
        }
    }

    return (
        <div className="liked-items-container">
            <h2 className="page-title">영화/굿즈 찜 목록</h2>

            <div className="tab-buttons">
                <button
                    className={activeTab === "movie" ? "active" : ""}
                    onClick={() => handleTabChange("movie")}
                >
                    영화
                </button>
                <button
                    className={activeTab === "goods" ? "active" : ""}
                    onClick={() => handleTabChange("goods")}
                >
                    굿즈
                </button>
                <button
                    className={activeTab === "user" ? "active" : ""}
                    onClick={() => handleTabChange("user")}
                >
                    사용자
                </button>
            </div>

            <div className="cards-grid">
                {likedItems.map((item) => (
                    <div className="like-card" key={item.id}>
                        <img
                            src={
                                item.type === "GOODS"
                                    ? item.imageUrl
                                    : item.type === "MOVIE"
                                        ? item.postImage
                                        : item.profileImageUrl
                            }
                            alt={item.name || item.nickname || item.title}
                        />
                        <div className="like-card-title">
                            {item.name || item.title || item.nickname}
                        </div>
                        {/* 각 항목에 맞는 추가 정보 렌더링 */}
                        {item.type === "GOODS" && (
                            <div className="like-card-details">
                                <p>{item.goodsType}</p>
                                <p>{item.price} 원</p>
                                <p>{item.option}</p>
                                <p>{item.description}</p>
                            </div>
                        )}
                        {item.type === "MOVIE" && (
                            <div className="like-card-details">
                                <p>{item.director}</p>
                                <p>{item.ageGrade} 등급</p>
                            </div>
                        )}
                        {item.type === "USER" && (
                            <div className="like-card-details">
                                <p>닉네임: {item.nickname}</p>
                                <img src={item.profileImageUrl} alt={`${item.nickname} 프로필`} className="user-profile-image" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="pagination">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className={page === 0 ? 'disabled' : ''}
            >
                이전
            </button>
            <span>{page + 1} / {totalPages}</span>
            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages - 1}
                className={page === totalPages - 1 ? 'disabled' : ''}
            >
                다음
            </button>
        </div>
        </div>
    )
}

export default LikedItemsPage
