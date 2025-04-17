import axios from "axios";
import { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

function Gender(){
    //데이터를 담을 변수
    const [data, setData] = useState({})

    ChartJS.register(ArcElement, Tooltip, Legend);

    //파이차트
    const dataSet = {
      labels: ['남', '여'],
      datasets: [
        {
          label: '# of Votes',
          data: [data.male, data.female],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }

    //파이차트 옵션
    const options = {
        plugins: {
            title: {
                display: true,
                text: '성별 비율',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
                    color: '#333',
            },
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                }
            },
        },
    };

    useEffect(()=>{
        axios.get("http://localhost:9988/manager/home/gender-ratio")
        .then((response)=>{
            console.log(response.data);
            setData(response.data);
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    return(
        <div className="userdau-wrap">
            <h3 className="contents-title">Admin Page - Gender Ratio</h3>
            <div className="gender-content">
                <div className="gender-chart">
                    <Pie data={dataSet} options={options}/>
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