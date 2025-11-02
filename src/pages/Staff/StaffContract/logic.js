import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllContracts } from '@services/contract.service'

export function useStaffContractPage() {
    const [params, setParams] = useState({
        sort: 'createdAt',
        dir: 'desc',
        page: 0,
        size: 10,
        orderNo: '',
        orderNoLike: true,
        createdFrom: '',
        createdTo: '',
        effectiveFrom: '',
        effectiveTo: '',
    })

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const apiParams = useMemo(() => {
        const p = { ...params }
        Object.keys(p).forEach(k => {
            if (p[k] === '') delete p[k]
        })
        return p
    }, [params])

    const fetchContracts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getAllContracts(apiParams)
            setData(res)
        } catch (e) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [apiParams])

    useEffect(() => {
        fetchContracts()
    }, [fetchContracts])

    const onSearch = useCallback(() => {
        setParams(prev => ({ ...prev, page: 0 }))
    }, [])

    const onReset = useCallback(() => {
        setParams({
            sort: 'createdAt',
            dir: 'desc',
            page: 0,
            size: 10,
            orderNo: '',
            orderNoLike: true,
            createdFrom: '',
            createdTo: '',
            effectiveFrom: '',
            effectiveTo: '',
        })
    }, [])

    const onPageChange = useCallback((nextPage) => {
        setParams(prev => ({ ...prev, page: nextPage }))
    }, [])

    const onSortChange = useCallback((sortKey) => {
        setParams(prev => ({
            ...prev,
            sort: sortKey,
            dir: prev.dir === 'asc' ? 'desc' : 'asc',
            page: 0,
        }))
    }, [])

    return {
        params,
        setParams,
        data,
        loading,
        error,
        onSearch,
        onReset,
        onPageChange,
        onSortChange,
    }
}





