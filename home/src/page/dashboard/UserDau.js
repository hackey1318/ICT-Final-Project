import '../../css/dashboard/user.css';

import { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

function UserDau(){
    //전체 데이터를 저장할 변수
    const [allDauList, setAllDauList] = useState([]); //목록 출력용 전체 데이터(이 데이터를 가지고 페이징 처리 해야함)
    const [chartDauList, setChartDauList] = useState([]); //차트용 전체 데이터

    //목록에서 현재 페이지 데이터를 담을 변수
    const [dauList, setDauList] = useState([]);

    //총인원수를 담을 변수
    const [totalCount, setTotalCount] = useState(0);

    //페이징 관련 변수
    const [page, setPage] = useState(0); //현재페이지
    const [pageSize, setPageSize] = useState(10); //한페이지에 보여줄 목록 수
    const [totalPages, setTotalPages] = useState(0); //전체 페이지수

    //일별, 월별 타입을 담을 변수
    const [dataType, setDataType] = useState('DAU'); //처음엔 일별 데이터 셋팅

    //차트 제목을 담을 변수(일별, 월별에 따라 달라짐)
    const [chartTitle, setChartTitle] = useState('일별'); //처음엔 일별로 셋팅

    //데이터 요청 함수(일별 of 월별)
    const selectUserData = (type)=>{
        let urlType = '';

        //type에 따라 axios주소 변경
        if(type === "DAU"){
            urlType = 'getDauList';
            setChartTitle('일별');
        }else if(type === "MAU"){
            urlType = 'getMauList';
            setChartTitle('월별');
        }

        axios.get(`http://localhost:9988/dashboard/${urlType}`)
        .then((response)=>{
            console.log("불러온 데이터",response.data);

            const dataList = response.data.activeUsers; //원본 데이터
            const reverseList = [...dataList].reverse(); //원본 데이터를 복사한 후 역순 정렬

            //목록은 역순으로, 차트는 순서대로 보여주는 것으로 설정.
            setAllDauList(reverseList); //전체 데이터 저장(목록용)
            setPage(0); //페이지 번호 초기화. 이걸 해야 버튼 눌러서 목록 바뀔때 페이지 번호 초기화됨.
            setChartDauList(dataList); //전체 데이터(차트용)
            setTotalCount(response.data.totalCount); //총 활동 인원수

            const pages = Math.ceil(dataList.length / pageSize); // 전체 페이지 수 계산
            setTotalPages(pages);

            //처음 페이지의 데이터 설정
            const firstPageData = reverseList.slice(0, pageSize); //목록 첫페이지
            setDauList(firstPageData);

        }).catch((error)=>{
            console.log(error);
        });
    };

    //처음 페이지 접속시 일별 데이터 불러오기
    useEffect(()=>{
        selectUserData('DAU');
    },[]);

    //페이지 이동 함수
    const handlePageChange = (newPage)=>{
        if(newPage >= 0 && newPage < totalPages){
            setPage(newPage);
       
            const start = newPage * pageSize;
            const end = start + pageSize;

            //페이지가 변경될 때마다 해당 페이지에 맞는 목록 설정
            setDauList(allDauList.slice(start, end));
        }
    }

    //페이지 번호 버튼
    const pageButtons = () => {
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={page === i ? 'active' : ''} // 현재 페이지 버튼에 스타일 추가
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };

    //그래프 LineChart -----------------------------------------------------------------
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${chartTitle} 활동인원수`,
            },
        },
        scales: {
            y: {
                suggestedMin: 0, //y축 최소값 0으로 설정
            },
        },
    };

    const labels = chartDauList.map(item => item.dateTime); //x축 => 날짜

    const data = {
        labels,
        datasets: [
            {
                label: '활동인원수',
                data: chartDauList.map(item => item.count), //y축 => 활동인원수
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };
    //그래프 LineChart 끝 ---------------------------------------------------------------

    return(
        <div className='userdau-wrap' style={{backgroundColor: 'white'}}>
            <h3 className='userdau-title'>Admin Page - User's {dataType}</h3>
            {/* 일별, 월별 선택 버튼 */}
            <div className='data-select-btn'>
                {/* 1개월을 선택하면 최근 1개월치의 데이터를 일별로 보여줌 */}
                <button className={`select-btn ${dataType==='DAU' ? 'active':''}`} onClick={()=>{setDataType('DAU'); selectUserData('DAU')}}>1개월</button>
                {/* 1년을 선택하면 최근 1년치의 데이터를 월별로 보여줌 */}
                <button className={`select-btn ${dataType==='MAU' ? 'active':''}`} onClick={()=>{setDataType('MAU'); selectUserData('MAU');}}>1년</button>
            </div>
            <div className='userdau-data-wrap'>
                <div className='userdau-left'>
                    {/* 목록 */}
                    <div className="userdau-list">
                        <ul>
                            <li><div className="userdau-list-title">날짜</div></li>
                            <li><div className="userdau-list-title">총활동인원수</div></li>
                            <li><div className="userdau-list-title">일별 시네메이트 완료</div></li>
                        </ul>
                        {
                            dauList.map((item, index)=>{
                                return (
                                    <ul key={index}>
                                        <li>{item.dateTime}</li>
                                        <li>{item.count}</li>
                                        <li>0</li>
                                    </ul>
                                )
                            })
                        }
                    </div>
                    {/* 페이징 */}
                    <div className="paging-container">
                            {page > 0 && (
                                <button className="page-buttons" onClick={() => handlePageChange(page - 1)}>
                                    이전
                                </button>
                            )}

                            {/* 페이지 번호 버튼 */}
                            <div className="page-buttons">
                                {pageButtons()}
                            </div>

                            {page < totalPages - 1 && (
                                <button className="page-buttons" onClick={() => handlePageChange(page + 1)}>
                                    다음
                                </button>
                            )}
                        </div>
                </div>

                <div className="userdau-right">
                    {/* 그래프 */}
                    <div className="userdau-chart">
                        <Line options={options} data={data}/>
                        <div className="userdat-chart-totaluser">총인원수 : {totalCount}명</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDau;