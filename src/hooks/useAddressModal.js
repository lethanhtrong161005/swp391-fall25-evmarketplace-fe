import { useMemo, useState, useEffect, useCallback } from "react";
import {
    getProvinces,
    getDistrictsByProvinceCode,
    getWardsByDistrictCode,
} from "@/services/address.service";

export function useAddressModal({ open, initialAddress, onOk }) {
    const provinces = useMemo(() => getProvinces(), []);
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null);
    const [line, setLine] = useState("");

    const districts = useMemo(
        () => (province ? getDistrictsByProvinceCode(province.value) : []),
        [province]
    );
    const wards = useMemo(
        () => (district ? getWardsByDistrictCode(district.value) : []),
        [district]
    );

    useEffect(() => {
        if (open && initialAddress) {
            setLine(initialAddress.line || "");
            setProvince(initialAddress.province || null);
            setDistrict(initialAddress.district || null);
            setWard(initialAddress.ward || null);
        }
        if (open && !initialAddress) {
            setLine("");
            setProvince(null);
            setDistrict(null);
            setWard(null);
        }
    }, [open, initialAddress]);

    const onProvinceChange = useCallback((_, option) => {
        setProvince(option);
        setDistrict(null);
        setWard(null);
    }, []);

    const onDistrictChange = useCallback((_, option) => {
        setDistrict(option);
        setWard(null);
    }, []);

    const onWardChange = useCallback((_, option) => {
        setWard(option);
    }, []);


    const filterOption = useCallback(
        (input, opt) => String(opt?.label ?? "").toLowerCase().includes(input.toLowerCase()),
        []
    );

    const canSubmit = !!(line?.trim() && province && district && ward);

    const submit = useCallback(() => {
        if (!canSubmit) return;
        const cleanLine = line.trim();
        const addrObj = { line: cleanLine, province, district, ward };
        const display = [cleanLine, ward?.label, district?.label, province?.label]
            .filter(Boolean)
            .join(", ");
        onOk?.(addrObj, display);
    }, [canSubmit, line, province, district, ward, onOk]);

    return {
   
        line, setLine,
        province, district, ward,
      
        provinces, districts, wards,
     
        canSubmit, submit,
        onProvinceChange, onDistrictChange, onWardChange,
        filterOption,
    };
}
