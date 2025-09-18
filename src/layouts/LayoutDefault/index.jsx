
import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const LayoutDefault = () => {
    return (
        <>
            <header>
                <div>
                    Logo
                </div>
                <nav>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/login">Login</Link> |{" "}
                    <Link to="/info-user">Info User</Link>
                    <Link to="/about">About</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                Footer
            </footer>
        </>
    )
}

export default LayoutDefault;
