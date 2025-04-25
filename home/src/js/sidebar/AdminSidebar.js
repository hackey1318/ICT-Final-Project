import { useEffect, useState } from 'react';
import './../../css/admin/adminSidebar.css';

import logo from "../../img/cinetogether.png"
import { Link } from 'react-router-dom';

function AdminSidebar({activeMenu}){
    //role 정보 담을 변수
    const [role, setRole] = useState('');
    
    //로그인한 관리자 닉네임 담을 변수
    const [nickname, setNickname] = useState('');

    //admin 탑메뉴의 열림, 닫힘 상태를 보관할 변수
    const [adminOpenMenus, setAdminOpenMenus] = useState([true, true, true, true]); //메뉴 4개여서 배열로 담음

    //manager 탑메뉴의 열림, 닫힘 상태를 보관할 변수
    const [managerOpenMenus, setManagerOpenMenus] = useState([true, true, true, true, true]); //메뉴 5개여서 배열로 담음

    //토글 함수
    const toggleMenu = (index)=>{
        if(role==='ADMIN'){
            setAdminOpenMenus(prev => {
                const updated = [...prev]; //다른 메뉴들 열림, 닫힘 상태 그대로 유지
                updated[index] = !updated[index]; //클릭한 메뉴의 열림, 닫힘 상태만 바꿈
                return updated;
            });
        }else if(role==='MANAGER'){
            setManagerOpenMenus(prev => {
                const updated = [...prev]; //다른 메뉴들 열림, 닫힘 상태 그대로 유지
                updated[index] = !updated[index]; //클릭한 메뉴의 열림, 닫힘 상태만 바꿈
                return updated;
            });
        }
    }

    useEffect(()=>{
        const isAdmin = async ()=>{
            const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            const getUserInfo = userInfo.role; //role 정보 가져오기
            const getUserNickname = userInfo.nickname; //nickname 가져오기
            
            if(!userInfo || !(getUserInfo === 'ADMIN' || getUserInfo === 'MANAGER')){
                alert("권한이 부족합니다.");
                window.location.href = '/';
                
                return
            }
            
            //if문 통과시 role, 닉네임 셋팅
            setRole(getUserInfo); //role 정보 셋팅
            setNickname(getUserNickname); //닉네임 정보 셋팅
        }
        isAdmin()
    }, []);

    return(
        <div className="admin-sidebar">
            {/* 배너 이미지 */}
            <img src={logo || "/placeholder.svg?height=40&width=150"} alt="CINETOGETHER" className="admin-banner"/>
            <div className="admin-info">'{nickname}' {role}</div>

            {/* 메뉴 부분 */}
            {role==="ADMIN" ? ( 
                //ADMIN 메뉴
                <ul>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(0)}}>대시보드</div>
                        <div className="top-menu-div" onClick={()=>{toggleMenu(0)}}>회원 조회</div>
                        {adminOpenMenus[0] && (
                            <ul className="admin-sub-menu">
                                <li>
                                    <Link to="/manager/home/member-list" className={`admin-nav-link ${activeMenu === "member-list" ? "active":""}`}>
                                        회원 목록 조회
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/home/inquiry" className={`admin-nav-link ${activeMenu === "inquiry" ? "active":""}`}>
                                        문의 내역 조회
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/home/reportPage" className={`admin-nav-link ${activeMenu === "" ? "active":""}`}>
                                        신고 목록 조회
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/home/blacklist" className={`admin-nav-link ${activeMenu === "blacklist" ? "active":""}`}>
                                        블랙리스트 조회
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/home/gender" className={`admin-nav-link ${activeMenu === "gender" ? "active":""}`}>
                                        회원 성별 비율 차트
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/home/dau" className={`admin-nav-link ${activeMenu === "dau" ? "active":""}`}>
                                        일별/월별 활동 정보 차트
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/home/manager-list" className={`admin-nav-link ${activeMenu === "manager-list" ? "active":""}`}>
                                        관리자 목록 조회
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(1)}}>상품 조회</div>
                        {adminOpenMenus[1] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/mdlists" className={`admin-nav-link ${activeMenu === "mdlists" ? "active":""}`}>상품 목록 조회</Link></li>
                                <li><Link to="" className={`admin-nav-link ${activeMenu === "" ? "active":""}`}>상품 구매 정보 조회</Link></li>
                                <li><Link to="" className={`admin-nav-link ${activeMenu === "" ? "active":""}`}>상품별 매출 조회</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(2)}}>영화 조회</div>
                        {adminOpenMenus[2] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/banner" className={`admin-nav-link ${activeMenu === "banner" ? "active":""}`}>배너 목록 조회</Link></li>
                            </ul> 
                        )}   
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(3)}}>공지 조회</div>
                            {adminOpenMenus[3] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/announce" className={`admin-nav-link ${activeMenu === "announce" ? "active":""}`}>공지 목록 조회</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            ):( //MANAGER 메뉴
                <ul>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(0)}}>대시보드</div>
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(1)}}>회원 조회</div>
                        {managerOpenMenus[1] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/member-list" className={`admin-nav-link ${activeMenu === "member-list" ? "active":""}`}>회원 목록 조회</Link></li>
                                <li><Link to="" className={`admin-nav-link ${activeMenu === "" ? "active":""}`}>신고 목록 조회</Link></li>
                                <li><Link to="/manager/home/blacklist" className={`admin-nav-link ${activeMenu === "blacklist" ? "active":""}`}>블랙리스트 조회</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(2)}}>상품 조회</div>
                        {managerOpenMenus[2] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/mdlists" className={`admin-nav-link ${activeMenu === "mdlists" ? "active":""}`}>상품 목록 조회</Link></li>
                                <li><Link to="" className={`admin-nav-link ${activeMenu === "" ? "active":""}`}>상품 구매 정보 조회</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(3)}}>영화 조회</div>
                        {managerOpenMenus[3] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/banner" className={`admin-nav-link ${activeMenu === "banner" ? "active":""}`}>배너 목록 조회</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="admin-top-menu">
                        <div className="top-menu-div" onClick={()=>{toggleMenu(4)}}>공지 조회</div>
                        {managerOpenMenus[4] && (
                            <ul className="admin-sub-menu">
                                <li><Link to="/manager/home/announce" className={`admin-nav-link ${activeMenu === "announce" ? "active":""}`}>공지 목록 조회</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            )}
        </div>
    )
}

export default AdminSidebar;