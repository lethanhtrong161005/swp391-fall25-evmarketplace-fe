import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Form } from "antd";

function formatKm(n) {
    if (n === undefined || n === null || n === "") return "";
    const num = Number(n);
    if (Number.isNaN(num)) return "";
    return num.toLocaleString("vi-VN");
}

function buildAutoTitle({ brand, model, year, color, mileage_km }) {
    if (!brand && !model && !year && !color && !mileage_km) return "";
    const left = [brand, model, year].filter(Boolean).join(" ").trim();
    const mid = color ? ` – ${color}` : "";
    const km = formatKm(mileage_km);
    const right = km ? ` - ${km} km` : "";
    return `${left}${mid}${right}`.trim();
}

export function useSectionTitleDesc({ descriptionMinWords = 20, descriptionMaxWords } = {}) {
    const form = Form.useFormInstance();

    // watch các field để auto gen title
    const brand = Form.useWatch("brand", form);
    const model = Form.useWatch("model", form);
    const year = Form.useWatch("year", form);
    const color = Form.useWatch("color", form);
    const mileage_km = Form.useWatch("mileage_km", form);

    // watch description để đếm từ
    const description = Form.useWatch("description", form);

    const [showHint, setShowHint] = useState(false);
    const userEditedTitleRef = useRef(false);

    const computedTitle = useMemo(
        () => buildAutoTitle({ brand, model, year, color, mileage_km }),
        [brand, model, year, color, mileage_km]
    );

    useEffect(() => {
        if (!form) return;
        const current = form.getFieldValue("title");
        if (!userEditedTitleRef.current || !current) {
            form.setFieldsValue({ title: computedTitle });
        }
    }, [computedTitle, form]);

    const onTitleChange = (e) => {
        const val = e.target.value ?? "";
        userEditedTitleRef.current = val.trim().length > 0 && val !== computedTitle;
    };

    const onTitleFocus = () => setShowHint(true);
    const onTitleBlur = () => setShowHint(false);

    const countWords = useCallback((val) => {
        const s = (val ?? "").trim();
        if (!s) return 0;
        return s.split(/\s+/).filter(Boolean).length;
    }, []);

    const descWordCount = useMemo(() => countWords(description), [description, countWords]);

    const descriptionRules = useMemo(() => ([
        { required: true, message: "Vui lòng nhập mô tả chi tiết" },
        {
            validator: (_, value) => {
                const n = countWords(value);
                if (descriptionMinWords && n < descriptionMinWords) {
                    return Promise.reject(
                        new Error(`Mô tả cần tối thiểu ${descriptionMinWords} từ (hiện ${n}).`)
                    );
                }
                if (descriptionMaxWords && n > descriptionMaxWords) {
                    return Promise.reject(
                        new Error(`Mô tả tối đa ${descriptionMaxWords} từ (hiện ${n}).`)
                    );
                }
                return Promise.resolve();
            },
        },
    ]), [countWords, descriptionMinWords, descriptionMaxWords]);

    return {

        showHint,
        onTitleChange,
        onTitleFocus,
        onTitleBlur,

        descWordCount,
        descriptionRules,
        descriptionMinWords,
        descriptionMaxWords,
    };
}
