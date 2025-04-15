import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../../js/sidebar/AdminSidebar";
import arrow from '../../img/arrow.png';

function Admin(){
    const location = useLocation();

    //현재 활성화된 메뉴 항목 확인
    const getActiveMenu = ()=>{
        const path = location.pathname;
        
        if(path.includes("/dashboard/userdau")) return "userdau"

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