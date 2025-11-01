
import React from 'react'
import styles from './index.module.scss'
import { Card } from 'antd';
import SearchActions from './SearchActions';
import ContractTable from './ContractTable';
import useStaffContract from './useStaffContract';

const StaffContract = () => {
    const logic = useStaffContract();
    return (
        <Card className={styles.container} variant="outlined">
            <h2 className={styles.title}>Quản lý hợp đồng</h2>
            <SearchActions {...logic} />
            <ContractTable {...logic} />
        </Card>
    );
}

export default StaffContract;
