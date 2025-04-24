import React from 'react';
import './Button.css';  // CSS 파일 하나만 관리

/**
 * 공통 버튼 컴포넌트
 * @param {string} variant - 'primary' | 'secondary' 등 스타일 구분
 * @param {function} onClick
 * @param {JSX.Element|string} children
 * @param {...any} props
 */
export default function Button({ variant = 'primary', onClick, children, ...props }) {
  return (
    <button
      className={`managerbuttonstyle managerbuttonstyle--${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}