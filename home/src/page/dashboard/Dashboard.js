import { useEffect, useState } from "react";
import axios from "axios";
import GenderChart from "../../js/dashboard/GenderChart";
import UserDauChart from "../../js/dashboard/UserDauChart";
import '../../css/dashboard/dashboard.css';
import LikeChart from "../../js/common/LikeChart";

function Dashboard() {
    const accessToken = sessionStorage.getItem("accessToken");

    const [genderData, setGenderData] = useState({}); //성별 데이터
    const [chartDauList, setChartDauList] = useState([]); //DAU 데이터
    const [totalCount, setTotalCount] = useState(0); //DAU 총인원
    const [movieLikeData, setMovieLikeData] = useState({ labels: [], data: [] });
    const [goodsLikeData, setGoodsLikeData] = useState({ labels: [], data: [] });
    

    useEffect(() => {
        axios.get("/manager/home/gender-ratio", {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => setGenderData(response.data));

        axios.get("/dashboard/getDauList", { //dau리스트가 보이게 함
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
            setChartDauList(response.data.activeUsers);
            setTotalCount(response.data.totalCount);
        });

        const fetchMovieLikes = async () => {
            try {
                const response = await axios.get('/likes/statistics/movie',{
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

        const fetchGoodsLikes = async () => {

            try {
                const response = await axios.get('/likes/statistics/goods', {
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
        fetchMovieLikes();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="row" style={{ height: "50%" }}>
                <div className="col-md-6 mb-3 d-flex flex-column " style={{ height: "100%" }}>
                    <div className="p-2" style={{ flex: 1 }}>
                        <a href="" className="dashboard-link"><h5>상품별 판매액 {'>'}</h5></a>
                    </div>
                </div>
                <div className="col-md-6 mb-3 d-flex flex-column" style={{ height: "100%" }}>
                    <div className="p-2" style={{ flex: 1 }}>
                        <a href="" className="dashboard-link"><h5>상품별 좋아요 {'>'}</h5></a>
                        <LikeChart labels={goodsLikeData.labels} data={goodsLikeData.data} chartId="goodsLikeChart" style={{ height: "300px" }}/>
                    </div>
                </div>
            </div>

            <div className="row" style={{ height: "50%" }}>
                <div className="col-md-4 mb-3 d-flex flex-column" style={{ height: "100%" }}>
                    <div className="p-2" style={{ flex: 1 }}>
                        <a href="" className="dashboard-link"><h5>영화 장르별 좋아요 {'>'}</h5></a>
                        <LikeChart labels={movieLikeData.labels} data={movieLikeData.data} chartId="movieLikeChart"  style={{ height: "300px" }}/>
                    </div>
                </div>
                <div className="col-md-4 mb-3 d-flex flex-column" style={{ height: "100%" }}>
                    <div className="p-2" style={{ flex: 1, maxWidth: "100%", minWidth: "300px", margin: "0 auto" }}>
                        <a href="home/gender" className="dashboard-link"><h5>앱 사용자 성비 {'>'}</h5></a>
                        <GenderChart data={genderData} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="col-md-4 mb-3 d-flex flex-column" style={{ height: "100%" }}>
                    <div className="p-2" style={{ flex: 1, maxWidth: "100%", minWidth: "300px", margin: "0 auto" }}>
                        <a href="home/dau" className="dashboard-link"><h5>DAU/MAU {'>'}</h5></a>
                        <UserDauChart chartTitle={"일별"} chartDauList={chartDauList} totalCount={totalCount} chartStyle={{ width: "100%", maxHeight: "260px" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;