import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Bookmark, Share2 } from "lucide-react"
import "./../../css/movie/MovieDetail.css" // CSS 파일 경로는 실제 프로젝트 구조에 맞게 조정하세요

const BASE_URL = 'http://localhost:9988/file-system/download/';


function MovieDetail() {
  // URL 경로에서 영화 ID를 가져옵니다 (예: /movies/10 -> id는 "10")
  const { id } = useParams()
  // 영화 상세 정보를 저장할 상태
  const [movie, setMovie] = useState(null)
  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true)
  // 에러 정보를 저장할 상태
  const [error, setError] = useState(null)

  // 관련 상품 데이터 (임시 데이터 - 실제로는 API에서 가져와야 함)
  const relatedItems = [
    { id: 1, name: "팝업 손거울", imageId: 'e3445feb46cd4b88', price: 7000, productUrl: '#' },
    { id: 2, name: "폭싹 손거울", imageId: 'e3445feb46cd4b88', price: 9000, productUrl: '#' },
    { id: 3, name: "폭싹 손거울", imageId: 'e3445feb46cd4b88', price: 6000, productUrl: '#' },
    { id: 4, name: "팝업 포스터", imageId: 'e3445feb46cd4b88', price: 7000, productUrl: '#' },
  ]

  // 비슷한 영화 데이터 (임시 데이터 - 실제로는 API에서 가져와야 함)
  const similarMovies = [
    { id: 1, name: "오늘의 연애", image: "/placeholder.jpg" },
    { id: 2, name: "너의 결혼식", image: "/placeholder.jpg" },
  ]

  // 컴포넌트가 마운트되거나 URL의 id 값이 변경될 때 실행됩니다.
  useEffect(() => {
    // 영화 상세 정보를 비동기적으로 가져오는 함수
    const fetchMovieDetail = async () => {
      try {
        setLoading(true) // 로딩 시작
        setError(null) // 이전 에러 상태 초기화
        const backendApiUrl = `http://localhost:9988/movies/detail/${id}` // '/detail' 추가!

        // fetch API를 사용하여 백엔드에 GET 요청을 보냅니다.
        const response = await fetch(backendApiUrl)

        // 응답 상태 확인
        if (!response.ok) {
          // 404 Not Found 에러 처리
          if (response.status === 404) {
            throw new Error("해당 영화 정보를 찾을 수 없습니다.")
          }
          // 그 외 서버 에러 처리
          throw new Error(`영화 정보를 불러오는데 실패했습니다 (상태 코드: ${response.status})`)
        }

        // 응답 데이터를 JSON 형태로 파싱합니다.
        const data = await response.json() // 백엔드에서 보낸 MovieDetailResponse DTO 데이터

        // 받아온 데이터를 movie 상태에 저장합니다.
        setMovie(data)

      } catch (err) {
        // 네트워크 오류 또는 위에서 발생시킨 에러를 처리합니다.
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
        setMovie(null) // 에러 발생 시 movie 데이터를 null로 설정합니다.

      } finally {
        // 요청 성공/실패 여부와 관계 없이 로딩 상태를 종료합니다.
        setLoading(false)
      }
    }

    // URL 파라미터 'id' 값이 존재할 때만 API 호출 함수를 실행합니다.
    if (id) {
      fetchMovieDetail()
    } else {
      // id 값이 없는 경우 (예: URL이 잘못된 경우)
      setError("영화 ID가 유효하지 않습니다.")
      setLoading(false)
    }

    // useEffect의 dependency array에 id를 넣어주면, id 값이 바뀔 때마다 이 effect가 다시 실행됩니다.
  }, [id])

  // --- 로딩 상태 UI ---
  if (loading) {
    return <div className="movie_detail_loading">로딩 중...</div>
  }

  // --- 에러 상태 UI ---
  // 에러가 발생했고, movie 데이터가 없는 경우 에러 메시지를 표시합니다.
  if (error && !movie) {
    return <div className="movie_detail_error">오류: {error}</div>
  }

  // --- 데이터 없음 UI ---
  // 로딩이 끝났고 에러도 없는데 movie 데이터가 없는 경우 (예: 404 Not Found 후 에러 처리된 경우)
  if (!movie) {
    return <div className="movie_detail_not_found">영화 정보를 찾을 수 없습니다.</div>
  }

  // --- 성공 상태 UI ---
  // 로딩이 끝나고 에러 없이 movie 데이터가 성공적으로 로드된 경우
  return (
    <div className="movie_detail_container container">
      {/* 헤더 섹션 */}
      <header className="movie_detail_header">
        <div className="movie_detail_top_nav row">
          <div className="movie_detail_logo col-4">영화 상세페이지</div>
          <div className="movie_detail_menu col-8">
            {/* 필요한 메뉴 항목 추가 */}
          </div>
        </div>
        <div className="movie_detail_sub_header row align-items-center">
          <div className="col-1">
            {/* 뒤로가기 버튼 (영화 목록 페이지로 이동한다고 가정) */}
            <Link to="/movies" className="movie_detail_back_btn">
              <ArrowLeft className="movie_detail_icon" />
            </Link>
          </div>
          <div className="col-9">
            {/* 백엔드에서 받은 영화 제목 표시 */}
            <h1 className="movie_detail_title">{movie.name}</h1>
          </div>
          <div className="movie_detail_actions col-2 d-flex justify-content-end">
            {/* 북마크 및 공유 아이콘 (기능 구현 필요) */}
            <Bookmark className="movie_detail_icon" />
            <Share2 className="movie_detail_icon ms-2" />
          </div>
        </div>
      </header>

      {/* 영화 상세 정보 섹션 */}
      <div className="movie_detail_content row mt-4">
        <div className="movie_detail_poster col-md-4">
          {/* 백엔드에서 받은 포스터 이미지 표시 (없으면 기본 이미지) */}
          <img
            src={movie.postImage || "/placeholder.jpg"} // placeholder 이미지는 public 폴더 등에 위치해야 함
            alt={`${movie.name} 포스터`}
            className="movie_detail_poster_img img-fluid rounded" // 부트스트랩 클래스 추가
          />
        </div>
        <div className="movie_detail_info col-md-8">
          <h2 className="movie_detail_section_title mb-3">줄거리</h2>
          {/* 백엔드에서 받은 영화 설명 표시 */}
          <p className="movie_detail_description">{movie.description}</p>
          <div className="movie_detail_buttons mt-4">
            {/* 백엔드에서 받은 영화 링크로 이동하는 버튼 */}
            <a
              // DTO 필드 이름을 externalLink로 변경했으므로 여기도 수정
              href={movie.externalLink}
              target="_blank" // 새 탭에서 열기
              rel="noopener noreferrer" // 보안 권장 사항
              className={`movie_detail_btn_secondary btn btn-outline-secondary ${!movie.externalLink ? 'disabled' : ''}`} // 링크 없으면 비활성화 (선택 사항)
              aria-disabled={!movie.externalLink} // 접근성
            >
              자세히 보기
            </a>
          </div>
        </div>
      </div>

      {/* === 관련 상품 섹션 수정 === */}
      <div className="movie_detail_related_section mt-5">
        {/* --- 헤더: 오른쪽 링크 제거 --- */}
        <div className="movie_detail_section_header row mb-3 align-items-center">
          <div className="col-12"> {/* 전체 너비 사용 */}
            <h2 className="movie_detail_section_title">Relative Merchandise</h2>
          </div>
          {/* <div className="col-4 text-end">...기존 링크 제거...</div> */}
        </div>
        {/* --- 상품 목록 --- */}
        <div className="movie_detail_items row">
          {relatedItems.map((item) => (
            // 각 상품 아이템의 최상위 div는 그대로 둡니다.
            <div key={item.id} className="movie_detail_item col-6 col-sm-3 mb-3">

              {/* --- 오직 <img> 태그만 <a> 태그로 감싸줍니다 --- */}
              <a
                href={item.productUrl || '#'} // 상품 URL 링크
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={item.imageId ? `${BASE_URL}${item.imageId}` : "/placeholder.svg"} // 이미지 소스 URL
                  alt={item.name}
                  className="movie_detail_item_img img-fluid rounded mb-2" // 기존 이미지 스타일 유지
                  onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.svg"; }}
                />
              </a>
              {/* --- 상품 이름과 가격은 <a> 태그 밖에 둡니다 --- */}
              <span className="movie_detail_item_name d-block">{item.name}</span>
              <span className="movie_detail_item_price fw-bold">{item.price.toLocaleString()}원</span>
            </div>
          ))}
        </div>
        {/* --- "굿즈 보기" 버튼 추가 (오른쪽 정렬) --- */}
        <div className="text-end mt-3"> {/* 오른쪽 정렬 및 상단 여백 */}
          <Link to="/merchandise" className="btn btn-outline-secondary"> {/* Link 태그 사용 */}
            굿즈 보기
          </Link>
        </div>
        {/* <div className="movie_detail_see_all_container text-center mt-3">...기존 버튼 제거...</div> */}
      </div>

      {/* === 비슷한 영화 섹션 수정 === */}
      <div className="movie_detail_similar_section mt-5 mb-5">
        {/* --- 헤더: 오른쪽 링크 수정 --- */}
        <div className="movie_detail_section_header row mb-3 align-items-center">
          <div className="col-8"> {/* 필요시 너비 조정 */}
            <h2 className="movie_detail_section_title">Similar Movies</h2>
          </div>
          {/* --- "Similar Movies" 링크 추가 --- */}
          <div className="col-4 text-end"> {/* 오른쪽 정렬 */}
            <Link to="/movies" className="movie_detail_see_more"> {/* 영화 목록 페이지로 가정 */}
              <span>Similar Movies</span> {/* 텍스트 변경 */}
              <ArrowLeft className="movie_detail_icon movie_detail_icon_rotate" /> {/* 아이콘 유지 */}
            </Link>
          </div>
          {/* <div className="col-4 text-end">...기존 "더 보기" 링크 제거...</div> */}
        </div>
        {/* --- 비슷한 영화 목록 --- */}
        <div className="movie_detail_items row">
          {similarMovies.map((movieItem) => (
            <div key={movieItem.id} className="movie_detail_item col-6 col-sm-3 mb-3">
              <img src={movieItem.image || "/placeholder.svg"} alt={movieItem.name} className="movie_detail_item_img img-fluid rounded mb-2" />
              <span className="movie_detail_item_name d-block">{movieItem.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieDetail