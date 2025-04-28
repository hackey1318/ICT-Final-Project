import React, { useEffect, useState } from 'react';
import LikeChart from '../../../js/common/LikeChart';
import axios from 'axios';

const accessToken = sessionStorage.getItem("accessToken");

function GoodsLikeChart() {
    const [goodsLikeData, setGoodsLikeData] = useState({ labels: [], data: [] });

    // 굿즈 관련 데이터를 가져오는 예시 (이것은 API에서 데이터를 받아오는 코드로 변경 가능)
    useEffect(() => {
        const fetchGoodsLikes = async () => {

            try {
                const response = await axios.get('http://192.168.1.252:9988/likes/statistics/goods', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });  // 서버에서 데이터 받아오기
                const likeStatisticsList = response.data;

                // 라벨과 데이터를 분리하여 상태에 설정
                const labels = likeStatisticsList.map(item => item.name);
                const data = likeStatisticsList.map(item => item.count);

                setGoodsLikeData({ labels, data });

            } catch (error) {
                console.error('Error fetching goods like data:', error);
            }

        };

        fetchGoodsLikes();
    }, []);

    return (
        <div>
            <h2>굿즈 좋아요 차트</h2>
            <LikeChart
                labels={goodsLikeData.labels} 
                data={goodsLikeData.data} 
                chartId="goodsLikeChart"
            />
        </div>
    );
}

export default GoodsLikeChart;