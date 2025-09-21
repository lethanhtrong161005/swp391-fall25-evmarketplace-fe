
import React from 'react'
import { Layout } from 'antd';
import { Outlet, Link } from 'react-router-dom'
import DefaultHeader from '../../components/Header/DefaultHeader';

const {Content} = Layout;

const LayoutDefault = () => {
    return (
        <>
        <Layout>

            <DefaultHeader/>

            <main>
                <Outlet />
            </main>

        </Layout>
        </>
    )
}

export default LayoutDefault;
