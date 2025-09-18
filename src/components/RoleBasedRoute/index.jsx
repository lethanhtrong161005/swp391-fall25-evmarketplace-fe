
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({allowedRoles, user}) => {
    if(!user){
        //Nếu chưa login thì sẽ quay về trang login
        return <Navigate to="/login" replace/>
    }

    if(!allowedRoles.includes(user.role)){
        //Đã login nhưng không có quyền truy cập, user -> không thể truy cập vào trang admin
        return <Navigate to="/403" replace/>
    }

    return <Outlet />;
}

export default RoleBasedRoute;
