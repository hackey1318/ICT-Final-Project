import React, { useState, useEffect } from 'react';
import apiNoAccessClient from '../js/public/axiosConfigNoAccess';

// --- 설정 ---
// 실제 백엔드 서버 주소 및 API 경로로 변경해야 합니다.
const BACKEND_BASE_URL = `${apiNoAccessClient.defaults.baseURL}`; // 예: 실제 백엔드 주소
const BANNER_API_ENDPOINT = `${BACKEND_BASE_URL}/banner/ALL`; // 배너 조회 API 엔드포인트
const IMAGE_DOWNLOAD_BASE_URL = `${BACKEND_BASE_URL}/file-system/download/`; // 이미지 다운로드 API 기본 경로

function MainPage() {
    // 상태 관리: 배너 목록, 로딩 상태, 에러 상태
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트가 마운트될 때 배너 데이터를 가져오는 효과
    useEffect(() => {
        // 데이터를 비동기적으로 가져오는 함수
        const fetchBanners = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null); // 이전 에러 초기화

            try {
                const response = await fetch(BANNER_API_ENDPOINT);

                // HTTP 응답 상태 확인
                if (!response.ok) {
                    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
                }

                const data = await response.json(); // JSON 데이터 파싱
                setBanners(data); // 상태 업데이트

            } catch (err) {
                console.error("배너 데이터 로딩 중 에러 발생:", err);
                setError(err.message || '배너 정보를 불러오는 데 실패했습니다.'); // 에러 상태 설정
            } finally {
                setIsLoading(false); // 로딩 종료 (성공/실패 무관)
            }
        };

        fetchBanners(); // 데이터 가져오는 함수 호출

    }, []); // 빈 배열을 의존성으로 전달하여 마운트 시 1회만 실행

    // --- 렌더링 로직 ---

    // 로딩 중일 때 표시할 내용
    if (isLoading) {
        return <div>배너 정보를 불러오는 중입니다...</div>;
    }

    // 에러 발생 시 표시할 내용
    if (error) {
        return <div>오류가 발생했습니다: {error}</div>;
    }

    // 배너 데이터가 없을 때 표시할 내용
    if (banners.length === 0) {
        return <div>표시할 배너가 없습니다.</div>;
    }

    // 배너 데이터가 있을 때 실제 배너 목록 렌더링
    return (
        <div>
            <h2>추천 배너</h2>
            {/* 배너 컨테이너: 스타일링은 필요에 따라 추가/수정하세요 */}
            <div id="banner-container" style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '15px', border: '1px solid #eee', minHeight: '100px' }}>
                {banners.map((banner) => {
                    // 각 배너 이미지의 완전한 URL 생성 (ID가 있을 경우)
                    const imageUrl = banner.fileId
                        ? `${IMAGE_DOWNLOAD_BASE_URL}${banner.fileId}`
                        : '/path/to/fallback-image.jpg'; // fileId가 없으면 기본 이미지로 대체

                    // 배너 클릭 시 이동할 링크 URL 결정 (예시 로직)
                    let linkUrl = '#'; // 기본값: 링크 없음 또는 현재 페이지
                    if (banner.targetNo) {
                        // banner.type 에 따라 다른 경로로 분기
                        if (banner.type === 'MOVIE') {
                            linkUrl = `/movie/${banner.targetNo}`; // 영화 상세 페이지 경로 (라우터 설정 필요)
                        } else if (banner.type === 'GOODS') {
                            linkUrl = `/goods/${banner.targetNo}`; // 굿즈 상세 페이지 경로 (라우터 설정 필요)
                        }
                        // 필요시 다른 타입 추가
                    }

                    // 각 배너 항목 렌더링
                    return (
                        <div key={banner.no} style={{ flexShrink: 0 }}> {/* 고유 key로 banner.no 사용 */}
                            {imageUrl && ( // 이미지 URL이 있을 때만 img 태그 렌더링
                                <a href={linkUrl} target="_blank" rel="noopener noreferrer"> {/* 새 탭에서 열기 예시 */}
                                    <img
                                        src={imageUrl}
                                        alt={`배너 ${banner.no} (${banner.type})`} // alt 텍스트 추가
                                        style={{ width: 'auto', height: '150px', display: 'block' }} // 예시 스타일
                                    />
                                </a>
                            )}
                            {/* 필요하다면 여기에 배너 색상(banner.color) 등의 다른 정보 표시 가능 */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MainPage;
