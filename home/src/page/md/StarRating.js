import { useState } from 'react';
import './../../css/md/StarRating.css'; // 아래 CSS 예시 참고

export default function StarRating({ rating, onChange }) {
  // hover: 마우스 올린 별 인덱스
  const [hover, setHover] = useState(0);
  // painting: 마우스 버튼이 눌린 상태
  const [painting, setPainting] = useState(false);

  const handleMouseDown = (star) => {
    setPainting(true);
    onChange(star);
  };
  const handleMouseMove = (star) => {
    if (painting) {
      onChange(star);
    }
  };
  const stopPainting = () => {
    setPainting(false);
  };

  return (
    <div
      className="star-rating"
      // 마우스를 영역 밖으로 빼거나 뗄 때 painting 해제
      onMouseUp={stopPainting}
      onMouseLeave={stopPainting}
    >
      {[1, 2, 3, 4, 5].map(star => {
        const filled = (hover || rating) >= star;
        return (
          <span
            key={star}
            className={`star ${filled ? 'filled' : ''}`}
            // 클릭으로 별점 결정
            onClick={() => onChange(star)}
            // hover 효과
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            // painting 모드 진입
            onMouseDown={() => handleMouseDown(star)}
            // painting 상태에서 드래그하면서 칠하기
            onMouseMove={() => handleMouseMove(star)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
