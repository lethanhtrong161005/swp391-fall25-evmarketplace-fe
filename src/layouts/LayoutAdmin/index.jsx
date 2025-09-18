
import React from 'react'
import { Outlet } from 'react-router-dom';

const LayoutAdmin = () => {
    return (
        <>
            <header>Admin</header>
            <main>
                <Outlet/>
            </main>
            <footer>Footer Admin</footer>
        </>
    )
}

export default LayoutAdmin;
