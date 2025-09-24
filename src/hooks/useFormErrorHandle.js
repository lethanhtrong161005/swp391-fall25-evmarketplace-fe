import { useImperativeHandle } from "react";

export function useFormErrorHandle(ref, form) {
    useImperativeHandle(ref, () => ({
        setFieldErrors: (fieldErrors = {}) => {
            const fields = Object.entries(fieldErrors).map(([name, errors]) => ({
                name,
                errors: Array.isArray(errors) ? errors : [String(errors)],
            }));
            if (fields.length) {
                form.setFields(fields);
                const first = fields.find((f) => f.errors?.length);
                if (first) {
                    form.scrollToField?.(first.name, { behavior: "smooth", block: "center" });
                }
            }
        },
        clearErrors: () => form.setFields([]),
    }), [form]);
}
