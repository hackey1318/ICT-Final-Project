import { Heart } from 'lucide-react';
import { unlikeItem } from '../../../../js/api/LikeCardAPI';
import "../../../../css/user/mypage/LikedItemsPage.css";

const GoodsCard = ({ item, onRefresh }) => {
    const handleClick = async () => {
        try {
            await unlikeItem(item.id);
            onRefresh();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <a href={`/mdshop/${item.id}`} className="text-decoration-none text-dark">
            <div className="like-card">
                <div className="like-card-heart" onClick={handleClick}>
                    <Heart color="red" fill="red" />
                </div>
                <img src={`/file-system/download/${item.imageIdList?.[0]}`} alt={item.name} />
                <div className="like-card-title">{item.name}</div>
                <p>{item.price.toLocaleString()} 원</p>
            </div>
        </a>
    );
};

export default GoodsCard;