// hooks/normalizeTaxonomy.js
export function normalizeTaxonomy(cats) {
    if (!Array.isArray(cats)) {
        return { categoryOptions: [], brandsByCategory: {}, modelsByCatBrand: {} };
    }

    const categoryOptions = cats.map((c) => ({
        value: c.id,                            // ID category
        label: c.description || c.name,         // tên hiển thị
        code: c.name,                           // EV_CAR / BATTERY ...
    }));

    const brandsByCategory = {};
    const modelsByCatBrand = {};

    cats.forEach((c) => {
        // Brand: HIỂN THỊ = tên (value/label), NHƯNG vẫn có id để gửi khi submit
        brandsByCategory[c.id] = (c.brands || []).map((b) => ({
            value: b.name,
            label: b.name,
            id: b.id,
        }));


        (c.brands || []).forEach((b) => {
            const key = `${c.id}#${b.id}`;
            modelsByCatBrand[key] = (b.models || []).map((m) => ({
                value: m.name,
                label: m.name,
                id: m.id,
            }));
        });
    });

    return { categoryOptions, brandsByCategory, modelsByCatBrand };
}
