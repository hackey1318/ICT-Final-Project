import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../../css/admin/adminSidebar.css';
import logo from "../../img/cinetogether.png";
import logouticon from '../../img/logout.png';

function AdminSidebar({ activeMenu }) {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [nickname, setNickname] = useState('');
    const [adminOpenMenus, setAdminOpenMenus] = useState([true, true, true, true]);
    const [managerOpenMenus, setManagerOpenMenus] = useState([true, true, true, true, true]);

    // 로그아웃: 세션 초기화 후 히스토리 교체
    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/manager', { replace: true });
    };

    // 메뉴 토글
    const toggleMenu = (index) => {
        if (role === 'ADMIN') {
            setAdminOpenMenus(prev => {
                const updated = [...prev];
                updated[index] = !updated[index];
                return updated;
            });
        } else if (role === 'MANAGER') {
            setManagerOpenMenus(prev => {
                const updated = [...prev];
                updated[index] = !updated[index];
                return updated;
            });
        }
    };

    // 권한 및 사용자 정보 로드
    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (!userInfo || !['ADMIN', 'MANAGER'].includes(userInfo.role)) {
            alert('권한이 부족합니다.');
            navigate('/manager', { replace: true });
            return;
        }
        setRole(userInfo.role);
        setNickname(userInfo.nickname);
    }, [navigate]);

    // 대시보드 이동
    const goToDashboard = () => {
        if (role === 'ADMIN') {
            navigate('/manager/home', { replace: true });
        } else {
            navigate('/manager/home', { replace: true });
        }
    };

    return (
        <div className="admin-sidebar">
            <img src={logo} alt="CINETOGETHER" className="admin-banner" />
            <div className="admin-info">
                <div className="admin-user">
                    <div className="admin-role">{role === 'ADMIN' ? '관리자' : '매니저'}</div>
                    <div className="admin-nickname">{nickname}님, 환영합니다.</div>
                </div>
                <div className="admin-logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <img src={logouticon} alt="로그아웃" />
                </div>
            </div>

            {role === 'ADMIN' ? (
                <ul>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={goToDashboard}>대시보드</div>
                        <div className="top-menu-div" onClick={() => toggleMenu(0)}>회원 조회</div>
                        {adminOpenMenus[0] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/member-list" className={`admin-nav-link ${activeMenu === 'member-list' ? 'active' : ''}`}>회원 목록 조회</Link></li>
                                <li><Link to="/manager/home/inquiry" className={`admin-nav-link ${activeMenu === 'inquiry' ? 'active' : ''}`}>문의 내역 조회</Link></li>
                                <li><Link to="/manager/home/reportPage" className={`admin-nav-link ${activeMenu === 'reportPage' ? 'active' : ''}`}>신고 목록 조회</Link></li>
                                <li><Link to="/manager/home/blacklist" className={`admin-nav-link ${activeMenu === 'blacklist' ? 'active' : ''}`}>블랙리스트 조회</Link></li>
                                <li><Link to="/manager/home/gender" className={`admin-nav-link ${activeMenu === 'gender' ? 'active' : ''}`}>회원 성별 비율 차트</Link></li>
                                <li><Link to="/manager/home/dau" className={`admin-nav-link ${activeMenu === 'dau' ? 'active' : ''}`}>일별/월별 활동 정보 차트</Link></li>
                                <li><Link to="/manager/home/manager-list" className={`admin-nav-link ${activeMenu === 'manager-list' ? 'active' : ''}`}>관리자 목록 조회</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(1)}>상품 조회</div>
                        {adminOpenMenus[1] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/mdlists" className={`admin-nav-link ${activeMenu === 'mdlists' ? 'active' : ''}`}>상품 목록 조회</Link></li>
                                <li><Link to="/manager/home/ordermanage" className={`admin-nav-link ${activeMenu === 'ordermanage' ? 'active' : ''}`}>상품 주문 정보 조회</Link></li>
                                <li><Link to="/manager/home/mdsales" className={`admin-nav-link ${activeMenu === 'mdsales' ? 'active' : ''}`}>상품 매출 조회</Link></li>
                                <li><Link to="/manager/home/goods-like" className={`admin-nav-link ${activeMenu === 'goods-like' ? 'active' : ''}`}>상품별 찜</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(2)}>영화 조회</div>
                        {adminOpenMenus[2] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/banner" className={`admin-nav-link ${activeMenu === 'banner' ? 'active' : ''}`}>배너 관리</Link></li>
                                <li><Link to="/manager/home/movie-like" className={`admin-nav-link ${activeMenu === 'movie-like' ? 'active' : ''}`}>영화 장르별 찜</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(3)}>공지 조회</div>
                        {adminOpenMenus[3] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/announce" className={`admin-nav-link ${activeMenu === 'announce' ? 'active' : ''}`}>공지 목록 조회</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            ) : (
                <ul>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={goToDashboard}>대시보드</div>
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(1)}>회원 조회</div>
                        {managerOpenMenus[1] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/member-list" className={`admin-nav-link ${activeMenu === 'member-list' ? 'active' : ''}`}>회원 목록 조회</Link></li>
                                <li><Link to="/manager/home/inquiry" className={`admin-nav-link ${activeMenu === 'inquiry' ? 'active' : ''}`}>문의 내역 조회</Link></li>
                                <li><Link to="/manager/home/reportPage" className={`admin-nav-link ${activeMenu === 'reportPage' ? 'active' : ''}`}>신고 목록 조회</Link></li>
                                <li><Link to="/manager/home/blacklist" className={`admin-nav-link ${activeMenu === 'blacklist' ? 'active' : ''}`}>블랙리스트 조회</Link></li>
                                <li><Link to="/manager/home/gender" className={`admin-nav-link ${activeMenu === 'gender' ? 'active' : ''}`}>회원 성별 비율 차트</Link></li>
                                <li><Link to="/manager/home/dau" className={`admin-nav-link ${activeMenu === 'dau' ? 'active' : ''}`}>일별/월별 활동 정보 차트</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(2)}>상품 조회</div>
                        {managerOpenMenus[2] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/mdlists" className={`admin-nav-link ${activeMenu === 'mdlists' ? 'active' : ''}`}>상품 목록 조회</Link></li>
                                <li><Link to="/manager/home/ordermanage" className={`admin-nav-link ${activeMenu === 'ordermanage' ? 'active' : ''}`}>상품 주문 정보 조회</Link></li>
                                <li><Link to="/manager/home/mdsales" className={`admin-nav-link ${activeMenu === 'mdsales' ? 'active' : ''}`}>상품 매출 조회</Link></li>
                                <li><Link to="/manager/home/goods-like" className={`admin-nav-link ${activeMenu === 'goods-like' ? 'active' : ''}`}>상품별 찜</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(3)}>영화 조회</div>
                        {managerOpenMenus[3] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/banner" className={`admin-nav-link ${activeMenu === 'banner' ? 'active' : ''}`}>배너 관리</Link></li>
                                <li><Link to="/manager/home/movie-like" className={`admin-nav-link ${activeMenu === 'movie-like' ? 'active' : ''}`}>영화 장르별 찜</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={() => toggleMenu(4)}>공지 조회</div>
                        {managerOpenMenus[4] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/announce" className={`admin-nav-link ${activeMenu === 'announce' ? 'active' : ''}`}>공지 목록 조회</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            )}
        </div>
    );
}

export default AdminSidebar;
