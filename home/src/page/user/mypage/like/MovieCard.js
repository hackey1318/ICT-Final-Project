import { Heart, Link } from 'lucide-react';
import { unlikeItem } from '../../../../js/api/LikeCardAPI';
import "../../../../css/user/mypage/LikedItemsPage.css";

const MovieCard = ({ item, onRefresh }) => {

    function getAgeBadgeColor(grade) {
        switch (grade) {
            case "15": return "#f39c12"  // 주황
            case "12": return "#3498db"  // 파랑
            case "All": return "#2ecc71" // 초록
            case "18": return "#e74c3c" // 빨강
            default: return "#7f8c8d"     // 회색
        }
    }

    const handleClick = async () => {
        try {
            await unlikeItem(item.likeNo);
            onRefresh();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <a href={`/movies/${item.id}`} className="text-decoration-none text-dark">

            <div className="like-card">
                <div className="like-card-heart" onClick={handleClick}>
                    <Heart color="red" fill="red" />
                </div>
                <div className="like-card-badge text-white" style={{ backgroundColor: getAgeBadgeColor(item.ageGrade) }}>{item.ageGrade}</div>
                <img src={item.postImage} alt={item.name} />
                <div className="like-card-title">{item.name}</div>

            </div>
        </a>
    );
};

export default MovieCard;