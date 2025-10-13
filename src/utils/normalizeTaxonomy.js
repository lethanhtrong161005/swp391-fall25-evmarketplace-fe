export function normalizeTaxonomy(cats, opts = {}) {
    const { activeOnly = false, pruneEmpty = false, sort = true } = opts;

    if (!Array.isArray(cats)) {
        return { categoryOptions: [], brandsByCategory: {}, modelsByCatBrand: {} };
    }

    const isActive = (s) => (activeOnly ? s === "ACTIVE" : true);
    const byLabelAsc = (a, b) =>
        String(a.label || "").localeCompare(String(b.label || ""), "vi");

    let categoryOptions = cats
        .filter((c) => isActive(c?.status))
        .map((c) => ({
            value: c.id,
            label: c?.description || c?.name || "",
            code: c?.name || "",
        }));
    if (sort) categoryOptions.sort(byLabelAsc);

    const brandsByCategory = {};
    const modelsByCatBrand = {};

    for (const c of cats) {
        if (!isActive(c?.status)) continue;

        const catId = c.id;
        const brandList = Array.isArray(c?.brands) ? c.brands : [];
        const brandSeen = new Set();
        let brandOpts = [];

        for (const b of brandList) {
            if (!isActive(b?.status)) continue;
            if (b?.id == null || brandSeen.has(b.id)) continue;
            brandSeen.add(b.id);

            brandOpts.push({ value: b.name, label: b.name, id: b.id });

            const key = `${catId}#${b.id}`;
            const models = Array.isArray(b?.models) ? b.models : [];
            const modelSeen = new Set();
            let modelOpts = [];

            for (const m of models) {
                if (!isActive(m?.status)) continue;
                if (m?.id == null || modelSeen.has(m.id)) continue;
                modelSeen.add(m.id);

                modelOpts.push({ value: m.name, label: m.name, id: m.id });
            }

            if (sort) modelOpts.sort(byLabelAsc);

            if (activeOnly && pruneEmpty && modelOpts.length === 0) {
                brandOpts = brandOpts.filter((x) => x.id !== b.id);
            } else {
                modelsByCatBrand[key] = modelOpts;
            }
        }

        if (sort) brandOpts.sort(byLabelAsc);
        brandsByCategory[catId] = brandOpts;
    }

    return { categoryOptions, brandsByCategory, modelsByCatBrand };
}