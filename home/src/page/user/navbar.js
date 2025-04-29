import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../css/user/navbar.css"
import logo from "../../img/cinetogether.png"
import NotificationSystem from "./notification/NotificationSystem"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState(null) // "movies" | "customer" | null

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
      try {
        setUserInfo(JSON.parse(sessionStorage.getItem("userInfo")))
      } catch {}
    }
    const onResize = () => setIsMobile(window.innerWidth <= 990)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const toggleMenu = () => {
    if (isMobile) {
      setMenuOpen(v => !v)
      if (menuOpen) setActive(null)
    }
  }
  const openDropdown = name => !isMobile && setActive(name)
  const closeDropdown = () => !isMobile && setActive(null)
  const clickDropdown = name =>
    isMobile && setActive(a => (a === name ? null : name))

  const logout = () => {
    sessionStorage.clear()
    setIsLoggedIn(false)
    setUserInfo(null)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* 왼쪽 그룹 */}
        <div className="navbar-lefts">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="CINETOGETHER"/>
          </Link>
          <button className="navbar-burger" onClick={toggleMenu}>
            <span/><span/><span/>
          </button>
          <ul className={`navbar-list ${menuOpen ? "navbar-list--open" : ""}`}>
            <li
              className="navbar-item"
              onMouseEnter={() => openDropdown("movies")}
              onMouseLeave={closeDropdown}
              onClick={() => clickDropdown("movies")}
            >
              <div className={`navbar-link ${active==="movies"?"active":""}`}>
                영화찾기
                <i className={`navbar-dropdown-arrow ${active==="movies"?"up":""}`}>▼</i>
              </div>
              {active==="movies" && (
                <ul className="navbar-dropdown">
                  <li><Link to="/movies/current">현재 상영작</Link></li>
                  <li><Link to="/movies/upcoming">상영 예정작</Link></li>
                  <li><Link to="/movies">장르별 영화</Link></li>
                </ul>
              )}
            </li>
            <li className="navbar-item">
              <Link to="/mdshop" className="navbar-link">MD Shop</Link>
            </li>
            <li className="navbar-item">
              <Link to="/cinemate" className="navbar-link">시네메이트</Link>
            </li>
            <li
              className="navbar-item"
              onMouseEnter={() => openDropdown("customer")}
              onMouseLeave={closeDropdown}
              onClick={() => clickDropdown("customer")}
            >
              <div className={`navbar-link ${active==="customer"?"active":""}`}>
                고객센터
                <i className={`navbar-dropdown-arrow ${active==="customer"?"up":""}`}>▼</i>
              </div>
              {active==="customer" && (
                <ul className="navbar-dropdown">
                  <li><Link to="/inquiry">1:1 문의</Link></li>
                  <li><Link to="/announcements">공지사항</Link></li>
                </ul>
              )}
            </li>
            {isLoggedIn && (
              <li className="navbar-item">
                <Link to="/mypage" className="navbar-link">마이페이지</Link>
              </li>
            )}
          </ul>
        </div>
        {/* 오른쪽 그룹 */}
        <div className="navbar-user-area">
          {isLoggedIn ? (
            <div className="navbar-profile">
              {userInfo.role==="USER" && <NotificationSystem/>}
              <span className="navbar-welcome">
                환영합니다 <strong>{userInfo.nickname}</strong> 님
              </span>
              <button className="navbar-btn" onClick={logout}>로그아웃</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-btn">로그인</Link>
              <Link to="/register" className="navbar-btn navbar-btn--primary">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}