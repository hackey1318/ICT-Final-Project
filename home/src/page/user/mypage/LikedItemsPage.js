// LikedItemsPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./like/MovieCard";
import GoodsCard from "./like/GoodsCard";
import UserCard from "./like/UserCard";
import "../../../css/user/mypage/LikedItemsPage.css";

const LikedItemsPage = () => {
    const [activeTab, setActiveTab] = useState("movie");
    const [likedItems, setLikedItems] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(12);

    useEffect(() => {
        const updateSizeByScreen = () => {
            const width = window.innerWidth;
            if (width >= 1200) setSize(12);
            else if (width >= 768) setSize(6);
            else setSize(2);
        };

        updateSizeByScreen();
        window.addEventListener("resize", updateSizeByScreen);
        return () => window.removeEventListener("resize", updateSizeByScreen);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/likes`, {
                    params: { type: activeTab, page, size },
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                });
                setLikedItems(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            }
        };
        fetchData();
    }, [activeTab, page, size]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    };

    const handleUnlike = (id) => {
        setLikedItems((prev) => prev.filter((item) => item.id !== id));
    };

    const renderCard = (item) => {
        switch (item.type) {
            case "MOVIE":
                return <MovieCard key={item.id} item={item} onRefresh={() => handleUnlike(item.id)} />;
            case "GOODS":
                return <GoodsCard key={item.id} item={item} onRefresh={() => handleUnlike(item.id)} />;
            case "USER":
                return <UserCard key={item.id} item={item} onRefresh={() => handleUnlike(item.id)} />;
            default:
                return null;
        }
    };

    return (
        <div className="liked-items-container">
            <h2 className="page-title">영화/굿즈 찜 목록</h2>
            <div className="tab-pagination-container">
                <div className="tab-buttons">
                    <button className={activeTab === "movie" ? "active" : ""} onClick={() => handleTabChange("movie")}>영화</button>
                    <button className={activeTab === "goods" ? "active" : ""} onClick={() => handleTabChange("goods")}>굿즈</button>
                    {/* <button className={activeTab === "user" ? "active" : ""} onClick={() => handleTabChange("user")}>사용자</button> */}
                </div>
                <div className="pagination">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 0} className={page === 0 ? "disabled" : ""}>이전</button>
                    <span>{page + 1} / {totalPages}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} className={page === totalPages - 1 ? "disabled" : ""}>다음</button>
                </div>
            </div>
            <div className="cards-grid">
                {likedItems.map(renderCard)}
            </div>

        </div>
    );
};

export default LikedItemsPage;