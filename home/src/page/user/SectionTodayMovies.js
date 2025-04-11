import React, { useState, useEffect } from 'react';
import './../../css/user/TodayMovies.css';

const dummyGridMovies = [
  {
    no: 59,
    name: '[승부]',
    postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000089/89485/89485_320.jpg',
    rating: 4.55,
    genre: '드라마',
    description: `세계 최고 바둑 대회에서 국내 최초 우승자가 된 조훈현. 전 국민적 영웅으로 대접받던 그는 바둑 신동이라 불리는 이창호를 제자로 맞는다. 
    “실전에선 기세가 8할이야” 제자와 한 지붕 아래에서 먹고 자며 가르친 지 수년. 모두가 스승의 뻔한 승리를 예상했던 첫 사제 대결에서 조훈현은 전 국민이 지켜보는 가운데,
     기세를 탄 제자에게 충격적으로 패한다. 오랜만에 패배를 맛본 조훈현과 이제 승부의 맛을 알게 된 이창호 조훈현은 타고난 승부사적 기질을 되살리며 다시 한번 올라갈 결심을 하게 되는데…`,
     movieUrl: `/movies/59`
  },
  {
    no: 23,
    name: '[로비]',
    postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000089/89519/89519_320.jpg',
    rating: 4.55,
    genre: '드라마, 코미디', 
    description: `"더럽게 싸움을 걸면, 어떻게 더럽게 싸우죠?" 연구밖에 모르는 스타트업 대표 창욱(하정우)은 라이벌 회사 대표 광우(박병은)의 뒷거래 때문에 기회도, 
    기술도 번번히 빼앗긴다. 그의 회사의 유일한 탈출구는 4조 원에 달하는 국책사업을 따내어, 한방에 자본을 확보하는 것! 하지만 로비에 있어선 한수 위인 광우는 조장관(강말금)을 일찌감치 포섭한 상황, 
    창욱은 눈을 돌려 조장관의 최측근이자 실무를 쥐고 있는 남편 최실장(김의성)에게 접근해 더러운 싸움에 참전하게 되는데... 마침내 뒷거래가 이뤄지는 골프장에 한날 한시 각자의 목적을 위해 모인 로비팀들, 이들의 진흙탕 로비가 펼쳐진다!`,
    movieUrl: `/movies/59`
  },
  
   {
    no: 46,
    name: '[아마추어]',
    postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000089/89546/89546_320.jpg',
    rating: 4.55,
    genre: '액션, 스릴러', 
    description: `아카데미 남우주연상 <보헤미안 랩소디> 라미 말렉의 2025년 가장 치밀한 지능적 스파이 스릴러 어느 날, 
    사랑하는 아내가 살해당했다 내가 소속된 CIA는 침묵했고 진실은 묻혔다 나는 프로 킬러도, 현장 요원도 아니다 암호를 풀던 내가 이제는 복수를 설계한다 
    놈들을 반드시 찾아내서 똑같이 갚아줄 것이다 컴퓨터나 두들기는 범생이 총 한 발 못 쏘는 ‘아마추어’라고 생각했겠지만, 내가 잘하는 게 뭔지 알기나 해? 4월 9일, 복수를 위한 설계가 시작된다!`,
    movieUrl: `/movies/59`
  },
  {
    no: 1,
    name: '[미스터 로봇]',
    postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000089/89417/89417_320.jpg',
    rating: 4.55,
    genre: 'SF, 액션', 
    description: `인공지능 로봇으로 자동화된 근 미래. K-ROBOT 인더스트리의 쇼케이스 현장에서 새로 출시된 로봇 ‘맥스’가 치명적인 사고를 일으키고, 
    로봇 관리대 대원(RCC) ‘한태평’은 그 과정에서 혼수상태에 빠지게 된다. 이후, '한태평'은 폐기 직전에 놓인 '맥스'의 몸으로 눈을 뜨게 되는데... 
    한편, K-ROBOT 인더스트리의 부사장이자 삼촌 '강민'에 의해 위험에 처한 소녀 '나나'. 그 순간 등장한 '맥스'에 의해 '강민'의 위협에서 탈출하고 두 사람의 특별한 여정이 시작된다!`,
    movieUrl: `/movies/59`
  },
  {
    no: 11,
    name: '[배러맨]',
    postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000089/89517/89517_320.jpg', 
    rating: 4.55,
    genre: '뮤지컬, 드라마', 
    description: `“나는 나를 넘어선다” 더 나은 나, IT’S SHOWTIME 어릴 때부터 노래에 남다른 재능을 보인 로비는 보이밴드 ‘테이크 댓’으로 데뷔해 영국 전역에서 최고의 인기를 누린다. 
    하지만 인기가 커질수록 각종 사건사고로 멤버들과 갈등을 빚고 결국 팀을 탈퇴한다. 화려한 솔로 복귀에 성공하지만, 내면의 상처와 불안은 점점 커져만 간다. 
    로비는 ‘더 나은 나’가 되기 위한 싸움을 시작하는데... <위대한 쇼맨>감독의 뮤직 판타지 비틀즈 이후 가장 성공한 슈퍼스타가 온다!`, 
    movieUrl: `/movies/59`
  },
  {
    no: 13,
    name: '[드라이브 인 타이페이]',
    postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000089/89451/89451_320.jpg',
    rating: 4.55,
    genre: '액션, 범죄', 
    description: `타이페이의 도심을 뒤흔드는 폭발적 카체이싱! 목숨을 건 브레이크 없는 추격전이 시작된다! 
    최강의 마약단속국 블랙 요원, 존 롤러(루크 에반스). 익명의 정보원으로부터 극비 밀고를 받은 그는 대만 최대의 마약왕 Mr.강(성 강)을 잡기 위해 타이페이 한복판으로 잠입한다. 
    모든 것이 계획대로 진행되던 순간 그의 앞에 나타난 전설의 레이서, 조이(계륜미) 15년 전, 누구보다 뜨겁게 사랑했던 그녀 하지만 이젠 마약왕 강의 아내로 그 앞에 서 있다. 
    완전히 뒤바뀐 운명! 마약왕 강을 잡기 위해 모든 것을 건 남자! 가족을 지키기 위해 다시 핸들을 잡은 여자! 최대 마약 조직의 운명을 위해 폭주하는 Mr.강! 거대한 조직이 그들을 쫓고, 
    도시 전체가 폭발할 듯한 총격전이 펼쳐진다! 터질듯한 RPM! 브레이크는 필요 없다! 지금, 전속력으로 질주하라!`,
    movieUrl: `/movies/59`
  },
];

// 초기 FeaturedMovie는 그대로 두거나, 첫 번째 그리드 아이템으로 설정 가능
const initialFeaturedMovie = {
  no: 49,
  name: '엑시트',
  postImage: 'https://img.cgv.co.kr/Movie/Thumbnail/Poster/000082/82012/82012_1000.jpg?_gl=1*1g7cr93*_ga*OTM5MDQwOTU4LjE3NDQyNjM4MjY.*_ga_559DE9WSKZ*MTc0NDI2MzgyNi4xLjEuMTc0NDI2MzgzNC41Mi4wLjA.',
  genre: '재난, 액션, 코미디',
  description: '짠내 폭발 청년백수, 전대미문의 진짜 재난을 만나다! 산악 동아리 시절 쌓아 왔던 모든 체력과 스킬을 동원해 탈출을 향한 기지를 발휘하기 시작하는데…',
  movieUrl: `/movies/59`
};
// -----------------------------------

// ⭐ MovieGridItem 수정: onClickItem prop 받도록 추가
const MovieGridItem = ({ movie, onClickItem }) => (
  // ⭐ 최상위 div에 onClick 이벤트 추가
  <div className="TodayMovies_item" onClick={() => onClickItem(movie)}>
    <div className="TodayMovies_poster-container">
      <img src={movie.postImage} alt={movie.name} className="TodayMovies_poster" />
    </div>
    <div className="TodayMovies_info">
      <div className="TodayMovies_rating">★ {movie.rating.toFixed(2)}</div>
      <div className="TodayMovies_title">{movie.name}</div>
      {/* shortDesc 대신 description을 사용하고 CSS로 말줄임 처리하는 것이 더 일반적 */}
      {/* CSS에서 .TodayMovies_shortDesc 스타일 유지 */}
      <div className="TodayMovies_shortDesc">{movie.description}</div>
    </div>
  </div>
);

// 하단 추천 영화 컴포넌트 (수정 없음)
const FeaturedMovie = ({ movie }) => (
  <div className="FeaturedMovie_container">

    {/* ⭐ 상세 보기 링크 추가 */}
    {movie.movieUrl && ( // movieUrl이 있을 때만 링크 표시
      <a href={movie.movieUrl} className="TodayMovies_info_detail" title={`${movie.name} 상세 보기`}>
        {'>'}
      </a>
    )}

    <div className="FeaturedMovie_poster-container">
      <img src={movie.postImage} alt={movie.name} className="FeaturedMovie_poster" />
    </div>
    <div className="FeaturedMovie_details">
      {/* 장르가 있을 때만 표시 (선택 사항) */}
      {movie.genre && (
        <>
          <h3>장르</h3>
          <p>{movie.genre}</p>
        </>
      )}
      <h3>스토리</h3>
      <p className="FeaturedMovie_story">{movie.description}</p>
    </div>
  </div>
);


function SectionTodayMovies() {
  const [gridMovies, setGridMovies] = useState(dummyGridMovies);
  
  const [featuredMovie, setFeaturedMovie] = useState(initialFeaturedMovie);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(true);

  // --- API 로딩 로직 (주석 처리됨) ---
  /* useEffect(() => { ... }, []); */

  // ⭐ 그리드 아이템 클릭 시 호출될 핸들러
  const handleGridItemClick = (clickedMovie) => {
    setFeaturedMovie(clickedMovie); // featuredMovie 상태를 클릭된 영화로 업데이트
    setIsFeaturedVisible(true); // 클릭 시 무조건 보이도록 설정 (토글 상태와 연동)
  };

  // 토글 버튼 핸들러 (수정 없음)
  const handleToggleFeatured = () => {
    setIsFeaturedVisible(prev => !prev);
  };

  if (isLoading) {
    return <div className="TodayMovies_section">로딩 중...</div>;
  }

  return (
    <section className="Main_section TodayMovies_section">
      <div className="TodayMovies_header">
            오늘의 추천 영화!
      </div>

      <div className="TodayMovies_grid">
        {/* ⭐ map 내부에서 onClickItem prop 전달 */}
        {gridMovies.map((movie) => (
          <MovieGridItem
            key={movie.no}
            movie={movie}
            onClickItem={handleGridItemClick} // 핸들러 함수 전달
          />
        ))}
      </div>

      <div className="TodayMovies_controls">
        <button
          className="TodayMovies_toggleButton"
          onClick={handleToggleFeatured}
        >
          {isFeaturedVisible ? '추천 영화 접기 ^' : '추천 영화 보기 v'}
        </button>
      </div>

      {isFeaturedVisible && featuredMovie && <FeaturedMovie movie={featuredMovie} />}
    </section>
  );
}

export default SectionTodayMovies;