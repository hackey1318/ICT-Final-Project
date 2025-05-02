import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../../js/sidebar/AdminSidebar";
import arrow from '../../img/arrow.png';
import { useEffect } from "react";
import logouticon from '../../img/logout.png';

function Admin(){
    const location = useLocation();

    //현재 활성화된 메뉴 항목 확인
    const getActiveMenu = ()=>{
        const path = location.pathname;
        
        if(path.includes("/home/dau")) return "dau"
        if(path.includes("/home/member-list")) return "member-list"
        if(path.includes("/home/manager-list")) return "manager-list"
        if(path.includes("/home/inquiry")) return "inquiry"
        if(path.includes("/home/reportPage")) return "reportPage"
        if(path.includes("/home/blacklist")) return "blacklist"
        if(path.includes("/home/gender")) return "gender"
        if(path.includes("/home/mdlists")) return "mdlists"
        if(path.includes("/home/ordermanage")) return "ordermanage"
        if(path.includes("/home/mdsales")) return "mdsales"
        if(path.includes("/home/announce")) return "announce"
        if(path.includes("/home/banner")) return "banner"
        if(path.includes("/home/goods-like")) return "goods-like"
        if(path.includes("/home/movie-like")) return "movie-like"

        return "manager/info"
    }

    return(
        <div className="admin-container">
            {/* 사이드바 */}
            <div className="container-sidebar">
                <AdminSidebar activeMenu={getActiveMenu()}/>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="container-content">
                <button onClick={() => window.history.back()} className="back-button">
                    <img src={arrow} alt="Back Arrow" style={{width: '20px', height:'20px', objectFit:'contain'}} />
                </button>
                <Outlet/>
            </div>
        </div>
    )
}

export default Admin;