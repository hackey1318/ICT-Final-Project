import { useEffect, useState } from "react";
import axios from "axios";
import GenderChart from "../../js/dashboard/GenderChart";
import UserDauChart from "../../js/dashboard/UserDauChart";
import '../../css/dashboard/dashboard.css';

function Dashboard(){
    const accessToken = sessionStorage.getItem("accessToken");

    const [genderData, setGenderData] = useState({}); //성별 데이터
    const [chartDauList, setChartDauList] = useState([]); //DAU 데이터
    const [totalCount, setTotalCount] = useState(0); //DAU 총인원

    useEffect(() => {
        axios.get("http://localhost:9988/manager/home/gender-ratio", {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => setGenderData(response.data));

        axios.get("http://localhost:9988/dashboard/getDauList", { //dau리스트가 보이게 함
            headers: { Authorization: `Bearer ${accessToken}` }
          }).then(response => {
            setChartDauList(response.data.activeUsers);
            setTotalCount(response.data.totalCount);
        });
    }, []);

    return(
        <div className="dashboard-container">
            <div className="row" style={{height:"50%"}}>
                <div className="col-md-6 mb-3 d-flex flex-column " style={{height:"100%"}}>
                    <div className="p-2" style={{flex: 1}}>
                        <a href="" className="dashboard-link"><h5>상품별 판매액 {'>'}</h5></a>
                    </div>
                </div>
                <div className="col-md-6 mb-3 d-flex flex-column" style={{height:"100%"}}>
                    <div className="p-2" style={{flex: 1}}>
                        <a href="" className="dashboard-link"><h5>상품별 좋아요 {'>'}</h5></a>

                    </div>
                </div>
            </div>

            <div className="row" style={{height:"50%"}}>
                <div className="col-md-4 mb-3 d-flex flex-column" style={{height:"100%"}}>
                    <div className="p-2" style={{flex: 1}}>
                        <a href="" className="dashboard-link"><h5>영화 장르별 좋아요 {'>'}</h5></a>

                    </div>
                </div>
                <div className="col-md-4 mb-3 d-flex flex-column" style={{height:"100%"}}>
                    <div className="p-2" style={{flex: 1, maxWidth:"100%", minWidth:"300px", margin:"0 auto"}}>
                        <a href="home/gender" className="dashboard-link"><h5>앱 사용자 성비 {'>'}</h5></a>
                        <GenderChart data={genderData} style={{width:"100%"}}/>
                    </div>
                </div>
                <div className="col-md-4 mb-3 d-flex flex-column" style={{height:"100%"}}>
                    <div className="p-2" style={{flex: 1, maxWidth:"100%", minWidth:"300px",  margin:"0 auto"}}>
                        <a href="home/dau" className="dashboard-link"><h5>DAU/MAU {'>'}</h5></a>
                        <UserDauChart chartTitle={"일별"} chartDauList={chartDauList} totalCount={totalCount} chartStyle={{width:"100%", maxHeight:"260px"}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;