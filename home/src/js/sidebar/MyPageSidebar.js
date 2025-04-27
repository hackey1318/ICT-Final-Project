import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../../css/user/MyPageSidebar.css";

const MypageSidebar = () => {
    const [activeMenu, setActiveMenu] = useState("영화굿즈찜목록");

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
    };

    const profileImage = sessionStorage.getItem("userInfo");
    const userInfo = profileImage ? JSON.parse(profileImage) : null;

    return (
        <div className="mypage-layout">
            <div className="mypage-sidebar">
                {/* 프로필 섹션 */}
                <div className="profile-section">
                    <div className="profile-image">
                        <img
                            src={userInfo?.profileImageUrl || "https://via.placeholder.com/96"}
                            alt="프로필 이미지"
                        />
                    </div>
                    <div className="welcome-message">{userInfo?.nickname}님 반가워요!</div>
                </div>

                {/* 활동 정보 조회 섹션 */}
                <div className="sidebar-section">
                    <h3 className="section-title">활동 정보 조회</h3>
                    <ul className="menu-list">
                        <li>
                            <Link
                                to="/mypage/likes"
                                className={`menu-item-link ${activeMenu === "영화굿즈찜목록" ? "active" : ""}`}
                                onClick={() => handleMenuClick("영화굿즈찜목록")}
                            >
                                <span className="bullet">•</span>영화/굿즈 찜 목록
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/mypage/order/list"
                                className={`menu-item-link ${activeMenu === "구매내역" ? "active" : ""}`}
                                onClick={() => handleMenuClick("구매내역")}
                            >
                                <span className="bullet">•</span>주문 내역 조회
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/mypage/cart"
                                className={`menu-item-link ${activeMenu === "장바구니" ? "active" : ""}`}
                                onClick={() => handleMenuClick("장바구니")}
                            >
                                <span className="bullet">•</span>장바구니
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/mypage/cinemates"
                                className={`menu-item-link ${activeMenu === "시네메이트내역" ? "active" : ""}`}
                                onClick={() => handleMenuClick("시네메이트내역")}
                            >
                                <span className="bullet">•</span>시네메이트 내역 조회
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/mypage/reviews"
                                className={`menu-item-link ${activeMenu === "후기내역" ? "active" : ""}`}
                                onClick={() => handleMenuClick("후기내역")}
                            >
                                <span className="bullet">•</span>후기 내역 조회
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/mypage/inquiries"
                                className={`menu-item-link ${activeMenu === "문의내역" ? "active" : ""}`}
                                onClick={() => handleMenuClick("문의내역")}
                            >
                                <span className="bullet">•</span>문의 내역 조회
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 나의 정보 조회 섹션 */}
                <div className="sidebar-section">
                    <h3 className="section-title">나의 정보 조회</h3>
                    <ul className="menu-list">
                        <li>
                            <Link
                                to="/mypage/edit"
                                className={`menu-item-link ${activeMenu === "회원정보수정" ? "active" : ""}`}
                                onClick={() => handleMenuClick("회원정보수정")}
                            >
                                <span className="bullet">•</span>회원 정보 수정
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/mypage/withdraw"
                                className={`menu-item-link ${activeMenu === "회원탈퇴" ? "active" : ""}`}
                                onClick={() => handleMenuClick("회원탈퇴")}
                            >
                                <span className="bullet">•</span>회원 탈퇴
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 오른쪽 메인 콘텐츠 영역 */}
            <div className="mypage-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MypageSidebar;
