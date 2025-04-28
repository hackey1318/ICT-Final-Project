import '../../css/dashboard/user.css';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UserDauChart from '../../js/dashboard/UserDauChart';

function UserDau() {
    const [allDauList, setAllDauList] = useState([]);
    const [chartDauList, setChartDauList] = useState([]);
    const [dauList, setDauList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [dataType, setDataType] = useState('DAU');

    const chartTitle = dataType === 'DAU' ? '일별' : '월별';

    // 데이터 요청 함수
    const fetchUserData = async (type) => {
        try {
            const urlType = type === 'DAU' ? 'getDauList' : 'getMauList';
            const response = await axios.get(`http://localhost:9988/dashboard/${urlType}`);

            const dataList = response.data.activeUsers || [];
            const reverseList = [...dataList].reverse();

            setAllDauList(reverseList);
            setChartDauList(dataList);
            setTotalCount(response.data.totalCount || 0);

            const pages = Math.ceil(dataList.length / pageSize);
            setTotalPages(pages);

            setPage(0); // 페이지 초기화
            setDauList(reverseList.slice(0, pageSize));
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
        }
    };

    // dataType이 변경될 때마다 데이터 다시 불러오기
    useEffect(() => {
        fetchUserData(dataType);
    }, [dataType]);

    // 페이지 이동
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            const start = newPage * pageSize;
            const end = start + pageSize;
            setDauList(allDauList.slice(start, end));
        }
    };

    const pageButtons = () => {
        return Array.from({ length: totalPages }, (_, i) => (
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={page === i ? 'active' : ''}
            >
                {i + 1}
            </button>
        ));
    };

    return (
        <div className='memberlist-wrap'>
            <h3 className='userdau-title'>Admin Page - User's {dataType}</h3>
            <div className='userdau-data-wrap'>
                <div className='userdau-left'>
                    {/* 일별, 월별 선택 버튼 */}
                    <div className='data-select-btn'>
                        <button
                            className={`select-btn ${dataType === 'DAU' ? 'active' : ''}`}
                            onClick={() => setDataType('DAU')}
                        >
                            1개월
                        </button>
                        <button
                            className={`select-btn ${dataType === 'MAU' ? 'active' : ''}`}
                            onClick={() => setDataType('MAU')}
                        >
                            1년
                        </button>
                    </div>

                    {/* 목록 */}
                    <div className="userdaulist-container">
                        <table className="userdau-table">
                            <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>총활동인원수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dauList.map((item) => (
                                    <tr key={item.dateTime}>
                                        <td>{item.dateTime}</td>
                                        <td>{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이징 */}
                    <div className="paging-container">
                        {page > 0 && (
                            <button className="page-buttons" onClick={() => handlePageChange(page - 1)}>
                                이전
                            </button>
                        )}

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

                {/* 차트 부분 */}
                <div className="userdau-right">
                    <div className="userdau-chart">
                        <UserDauChart chartTitle={chartTitle} chartDauList={chartDauList} totalCount={totalCount} chartStyle={{width:"100%", height:"600px"}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDau;
