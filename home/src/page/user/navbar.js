import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "../../css/user/navbar.css" // CSS 파일 임포트 (실제 경로로 수정 필요)

// 로고 이미지 임포트 (실제 경로로 수정 필요)
import logo from "../../img/cinetogether.png"

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const [isNavOpen, setIsNavOpen] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
    const movieMenuRef = useRef(null)


    // 컴포넌트 마운트 시 로그인 상태 확인
    useEffect(() => {
        const token = sessionStorage.getItem("userToken")
        if (token) {
            setIsLoggedIn(true)
            setUsername(sessionStorage.getItem("username") || "myname")
        }
    }, [])

    // 네비게이션 토글 함수
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen)
    }

    // 드롭다운 토글 함수
    const handleMouseEnter = () => {
        if (movieMenuRef.current) {
            const rect = movieMenuRef.current.getBoundingClientRect()
            setDropdownPosition({
                top: rect.bottom,
                left: rect.left,
            })
        }
        setShowDropdown(true)
    }

    const handleMouseLeave = () => {
        setShowDropdown(false)
    }

    // 테스트용 로그인/로그아웃 함수
    const handleLogin = () => {
        sessionStorage.setItem("userToken", "sample-token-value")
        sessionStorage.setItem("username", "myname")
        setIsLoggedIn(true)
        setUsername("myname")
    }

    const handleLogout = () => {
        sessionStorage.removeItem("userToken")
        sessionStorage.removeItem("username")
        setIsLoggedIn(false)
        setUsername("")
    }

    // 모바일 화면인지 확인
    const isMobile = () => {
        return window.innerWidth <= 991
    }

    return (
        <nav className="navbars">
            <div className="navbar-containers">
                {/* 좌측 섹션 (로고 + 네비게이션 메뉴) */}
                <div className="navbar-lefts">
                    {/* 로고 */}
                    <div className="navbar-logo">
                        <Link to="/">
                            <img src={logo || "/placeholder.svg?height=40&width=150"} alt="CINETOGETHER" />
                            {!logo && (
                                <span className="logo-text">
                                    CINE<span className="logo-highlight">TOGETHER</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* 모바일 토글 버튼 */}
                    <div className="navbar-toggle" onClick={toggleNav}>
                        <span className="toggle-icon"></span>
                        <span className="toggle-icon"></span>
                        <span className="toggle-icon"></span>
                    </div>

                    {/* 네비게이션 메뉴 */}
                    <div className={`navbar-menus ${isNavOpen ? "active" : ""}`}>
                        <ul className="navbar-navs">
                            <li className="nav-items" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <a href="#" className="nav-links" ref={movieMenuRef}>
                                    영화찾기 <i className="dropdown-arrow">▼</i>
                                </a>
                            </li>
                            <li className="nav-items">
                                <Link to="/store" className="nav-links">
                                    스토어
                                </Link>
                            </li>
                            <li className="nav-items">
                                <Link to="/community" className="nav-links">
                                    커뮤니티
                                </Link>
                            </li>
                            {isLoggedIn && (
                                <li className="nav-items">
                                    <Link to="/mypage" className="nav-links">
                                        마이페이지
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            {/* 사용자 섹션 */}
            <div className="navbar-user">
                {isLoggedIn ? (
                    <div className="user-profile">
                        <div className="welcome-text">
                            환영합니다 <span className="username">{username}</span> 님
                        </div>
                        <div className="profile-circle">
                            <img src="https://via.placeholder.com/35" alt="프로필 이미지" />
                        </div>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="btn btn-login">
                            로그인
                        </Link>
                        <Link to="/register" className="btn btn-register">
                            회원가입
                        </Link>
                    </div>
                )}
            </div>

            {
                showDropdown && (
                    <ul className="dropdown-container" style={isMobile() ? {} : { position: "fixed", top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <li>
                            <Link to="/movies/current">현재 상영작</Link>
                        </li>
                        <li>
                            <Link to="/movies/upcoming">상영 예정작</Link>
                        </li>
                        <li>
                            <Link to="/movies/local">지역별 영화</Link>
                        </li>
                    </ul>
                )}

            {/* 테스트 버튼 - 개발 중에만 사용 */}
            <div className="test-buttons">
                <button onClick={handleLogin} className="test-btn login">
                    로그인 테스트
                </button>
                <button onClick={handleLogout} className="test-btn logout">
                    로그아웃 테스트
                </button>
            </div>
            </div>

        </nav>
    )
}

export default Navbar
