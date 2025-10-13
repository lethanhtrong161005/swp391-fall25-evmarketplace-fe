import { useEffect, useRef, useState } from "react";
import { getAllCategoryDetail } from "@services/categoryService";
import { normalizeTaxonomy } from "@utils/normalizeTaxonomy";

export function useTaxonomy(msg, options) {

    const { activeOnly = true, pruneEmpty = true, sort = true } = options || {};

    const [loading, setLoading] = useState(true);
    const [tax, setTax] = useState(null);

    const msgRef = useRef(msg);
    useEffect(() => { msgRef.current = msg; }, [msg]);

    const fetchIdRef = useRef(0);

    useEffect(() => {
        const id = ++fetchIdRef.current;
        let cancelled = false;

        setLoading(true);

        getAllCategoryDetail({ activeOnly })
            .then((raw) => {
                if (cancelled || id !== fetchIdRef.current) return;
                const data = normalizeTaxonomy(raw, { activeOnly, pruneEmpty, sort });
                setTax(data);
            })
            .catch((e) => {
                if (cancelled || id !== fetchIdRef.current) return;
                msgRef.current?.error(e?.message || "Không tải được danh mục/brand/model");
                setTax(null);
            })
            .finally(() => {
                if (cancelled || id !== fetchIdRef.current) return;
                setLoading(false);
            });

        return () => { cancelled = true; };
    }, [activeOnly, pruneEmpty, sort]);

    return { loading, tax };
}
