import { useEffect, useState } from "react";
import { getAllCategoryDetail } from "@services/categoryService";
import { normalizeTaxonomy } from "@pages/Member/ListingCreate/_shared/normalizeTaxonomy";

export function useTaxonomy(msg) {
    const [loading, setLoading] = useState(true);
    const [tax, setTax] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const raw = await getAllCategoryDetail();
                setTax(normalizeTaxonomy(raw));
            } catch (e) {
                msg?.error(e?.message || "Không tải được danh mục/brand/model");
            } finally {
                setLoading(false);
            }
        })();
    }, [msg]);

    return { loading, tax };
}
