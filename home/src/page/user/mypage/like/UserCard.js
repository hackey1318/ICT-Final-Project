import { Heart } from 'lucide-react';
import { unlikeItem } from '../../../../js/api/LikeCardAPI';
import "../../../../css/user/mypage/LikedItemsPage.css";

const UserCard = ({ item, onRefresh }) => {
    const handleClick = async () => {
        try {
            await unlikeItem(item.id);
            onRefresh();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="like-card">
            <div className="like-card-heart" onClick={handleClick}>
                <Heart color="red" fill="red" />
            </div>
            <img src={item.profileImageUrl} alt={item.nickname} className="user-profile-image" />
            <div className="like-card-title">{item.nickname}</div>
        </div>
    );
};

export default UserCard;