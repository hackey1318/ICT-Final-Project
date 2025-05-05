import { useEffect, useState } from "react";
import axios from "axios";
import GenderChart from "../../js/dashboard/GenderChart";
import apiClient from "../../js/public/axiosConfig";
import { handleManagerLogout } from "js/api/UserLogout";

const accessToken = sessionStorage.getItem("accessToken");

function Gender(){
    //데이터를 담을 변수
    const [data, setData] = useState({})

    useEffect(()=>{
        apiClient.get("/manager/home/gender-ratio",)
        .then((response)=>{
            console.log(response.data);
            setData(response.data);
        }).catch((error)=>{
            if (error.response.status === 423) {
                handleManagerLogout();
            }
            console.log(error);
        });
    },[]);

    return(
        <div className="userdau-wrap">
            <h3 className="contents-title">Admin Page - Gender Ratio</h3>
            <div className="gender-content">
                <div className="gender-chart">
                    <GenderChart data={data} />
                </div>
                <div className="gender-info">
                    <div><strong>남성:</strong> {data.male}명 ({Math.round(data.maleRatio*100)/100}%)</div>
                    <div><strong>여성:</strong> {data.female}명 ({Math.round(data.femaleRatio*100)/100}%)</div>
                    <div><strong>총 인원:</strong> {data.totalPerson}명</div>
                </div>
            </div>
        </div>
    )
}

export default Gender;