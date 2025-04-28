import { useEffect, useState } from "react";
import LikeChart from "../../../js/common/LikeChart";
import axios from "axios";

const accessToken = sessionStorage.getItem("accessToken");

function MovieLikeChart() {
    const [movieLikeData, setMovieLikeData] = useState({ labels: [], data: [] });
    // 영화 관련 데이터를 가져오는 예시 (이것은 API에서 데이터를 받아오는 코드로 변경 가능)
    useEffect(() => {
        const fetchMovieLikes = async () => {
            try {
                const response = await axios.get('http://192.168.1.252:9988/likes/statistics/movie',{
                    headers: { Authorization: `Bearer ${accessToken}` }
                });  // 서버에서 데이터 받아오기
                const likeStatisticsList = response.data;

                // 라벨과 데이터를 분리하여 상태에 설정
                const labels = likeStatisticsList.map(item => item.name);
                const data = likeStatisticsList.map(item => item.count);

                setMovieLikeData({ labels, data });

            } catch (error) {
                console.error('Error fetching goods like data:', error);
            }

        };

        fetchMovieLikes();
    }, []);

    return (
        <div>
            <h2>영화 좋아요 차트</h2>
            <LikeChart
                labels={movieLikeData.labels} 
                data={movieLikeData.data} 
                chartId="movieLikeChart"
            />
        </div>
    );
}

export default MovieLikeChart;