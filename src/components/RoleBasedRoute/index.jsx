
import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles = [] }) => {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/403" replace state={{ from: location }} />;
    }


    const role = (user?.role || "").toLowerCase();
    if (allowedRoles.length && !allowedRoles.includes(role)) {
        return <Navigate to="/403" replace />;
    }

    
    return <Outlet />;
}

export default RoleBasedRoute;
