import { useEffect, useState } from "react";
import MoviePagination from "../../js/public/Pagination"; // 경로가 올바른지 확인하세요
import axios from "axios";
import { Link } from "react-router-dom";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";


export default function MdShop() {
    // 굿즈즈 목록, 현재 페이지, 총 페이지 수를 위한 상태
    const [goods, setGoods] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    function getPageSize(width) {
        if (width < 576) return 4;     // 모바일
        if (width < 768) return 6;     // 태블릿
        if (width < 992) return 9;     // 작은 데스크탑
        return 12;                     // 기본 데스크탑, 큰 화면
    }

    // 페이지 번호가 변경될 때 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    useEffect(() => {
        const fetchCurrentMovies = async () => {
            // 이 컴포넌트에서는 항상 'PRESENT' 타입 영화를 가져옵니다.
            const currentPageSize = getPageSize(window.innerWidth);

            try {
                const response = await apiNoAccessClient.get(`/md-shop/lists`, {
                    params: {
                        page: page,
                        size: currentPageSize,
                        sort: 'createdAt,desc', // 정렬 유지 (원하는 경우), 필요시 조정
                    },
                });

                console.log("API 응답:", response.data); // 디버그 로그

                setGoods(response.data.content || []); // movies가 항상 배열이 되도록 보장
                setTotalPages(response.data.totalPages || 1); // totalPages가 최소 1이 되도록 보장

            } catch (error) {
                console.error('굿즈 정보 불러오는 중 오류 발생:', error);
                setGoods([]);
                setTotalPages(1);
            }
        };

        fetchCurrentMovies();
    }, [page]); // 페이지가 변경될 때만 이펙트 재실행

    return (
        <main className="bg-white min-vh-100">
            <div className="container py-3">
                <div className="mb-4">
                    <h1 className="h2 fw-bold">Merchandise Shop</h1>
                </div>
                <div className="d-flex justify-content-end mb-4" style={{ paddingBottom: '3rem', paddingTop: '1rem' }}>
                    {totalPages > 1 && (
                        <MoviePagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>

                <div className="row g-4">
                    {goods.map((item, idx) => (
                        <div className="col-md-3" key={idx}>
                            <Link to={`/mdshop/${item.id}`} className="Goods_item_links">
                                <div className="card h-100">
                                    <img src={`${apiNoAccessClient.defaults.baseURL}/file-system/download/${item.imageUrls[0]}`} className="card-img-top" style={{ height: "300px", objectFit: "cover" }} alt={item.name} />
                                    <div className="card-body py-1">
                                        <p className="card-title fw-bold text-truncate mb-0">{item.name}</p>
                                        <p className="card-text text-muted mb-0"><strong>Price: </strong>{item.price}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
