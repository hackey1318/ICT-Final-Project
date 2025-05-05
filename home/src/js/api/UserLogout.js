import { Navigate } from "react-router-dom";

export function handleManagerLogout() {
    sessionStorage.clear();
    Navigate('/manager', { replace: true });
};

export function handleUserLogout() {
    sessionStorage.clear();
    Navigate('/', { replace: true });
};