

import { Outlet } from 'react-router-dom';

const LayoutStaff = () => {
    return (
        <>
            <header>Header</header>
            <main>
                <Outlet/>
            </main>
            <footer>Footer</footer>
        </>
    )
}

export default LayoutStaff;
