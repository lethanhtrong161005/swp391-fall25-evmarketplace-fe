
export function mapFieldErrorsToAntd(form, fieldErrors) {
    if (!fieldErrors) return;

    const fields = Object.entries(fieldErrors).map(([name, messages]) => ({
        name,
        errors: (Array.isArray(messages) ? messages : [String(messages)]).filter(Boolean),
    }));

    if (fields.length) {
        form.setFields(fields);
        const first = fields.find(f => f.errors?.length);
        if (first) form.scrollToField?.(first.name, { behavior: "smooth", block: "center" });
    }
}