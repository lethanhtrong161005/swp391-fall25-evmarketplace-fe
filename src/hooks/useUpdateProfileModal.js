import { useCallback, useMemo, useState } from "react";
import { getAxiosErrorMessage } from "@config/errorMessage";
import { updateUserProfile, updateUserAvatar, requestPhoneOpt, verifyPhoneOtp } from "@services/accountService";

const getAvatarUrl = (filename) => {
    if (!filename) return null;
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
    return `${API_BASE}/api/accounts/image/${filename}/avatar`;
};

export default function useUpdateProfileModal({ initialData = {}, onUpdated, msgApi }) {
    const [preview, setPreview] = useState(initialData.avatar || initialData.avatarUrl || null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);

    const emailExist = useMemo(() => Boolean(initialData.email), [initialData.email]);

    const initForm = useCallback((form) => {
        const profileData = initialData.profile || {};
        const fullNameValue = profileData.fullName ?? initialData.fullName ?? "";
        form.setFieldsValue({
            fullName: fullNameValue,
            email: initialData.email,
            phoneNumber: initialData.phoneNumber,
            address: profileData.addressLine,
            province: profileData.province,
            otpCode: "",
        });
        const avaUrl = profileData.avatarUrl;
        setPreview(avaUrl ? getAvatarUrl(avaUrl) : null);
        const derivedPhoneVerified = initialData?.phoneVerified ?? initialData?.profile?.phoneVerified ?? false;
        setPhoneVerified(!!derivedPhoneVerified);
    }, [initialData]);

    const handleUploadBefore = useCallback(async (file) => {
        const ok = file.type.startsWith("image/");
        if (!ok) {
            msgApi?.error("Chỉ chấp nhận ảnh.");
            return false;
        }
        const isLt500 = file.size / 1024 / 1024 < 500;
        if (!isLt500) {
            msgApi?.error("Kích thước phải < 500MB.");
            return false;
        }
        const oldPreview = preview;
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        setAvatarUploading(true);
        try {
            const uploadRes = await updateUserAvatar(file);
            if (uploadRes?.status < 200 || uploadRes?.status >= 300 || uploadRes?.success === false) {
                msgApi?.error(uploadRes?.message || "Tải ảnh đại diện thất bại");
                setPreview(oldPreview);
                return false;
            }
            const nameCandidate = uploadRes?.data?.avatarUrl || uploadRes?.avatarUrl || uploadRes?.data;
            const newAvatarFileName = typeof nameCandidate === "string" ? nameCandidate : null;
            if (!newAvatarFileName) {
                msgApi?.warning("Không nhận được tên tệp ảnh từ máy chủ");
                setPreview(oldPreview);
                return false;
            }
            setPreview(getAvatarUrl(newAvatarFileName));
            const updatedProfile = {
                ...initialData,
                profile: {
                    ...initialData.profile,
                    avatarUrl: newAvatarFileName,
                },
            };
            onUpdated && onUpdated(updatedProfile);
            msgApi?.success("Ảnh đại diện đã được cập nhật");
        } catch (err) {
            const errMsg = getAxiosErrorMessage(err);
            msgApi?.error(errMsg || "Tải ảnh đại diện thất bại");
            setPreview(oldPreview);
        } finally {
            setAvatarUploading(false);
        }
        return false;
    }, [initialData, msgApi, onUpdated, preview]);

    const handleRequestOtp = useCallback(async (form) => {
        try {
            const phone = form.getFieldValue("phoneNumber") || initialData.phoneNumber;
            if (!phone) {
                msgApi?.warning("Vui lòng nhập số điện thoại");
                return;
            }
            setOtpSending(true);
            const res = await requestPhoneOpt(phone);
            if (res?.success === false) {
                msgApi?.error(res?.message || "Gửi mã OTP thất bại");
                return;
            }
            setOtpRequested(true);
            msgApi?.success("Mã OTP đã được gửi đến số điện thoại của bạn");
        } catch (err) {
            const errMsg = getAxiosErrorMessage(err);
            msgApi?.error(errMsg || "Gửi mã OTP thất bại");
        } finally {
            setOtpSending(false);
        }
    }, [initialData.phoneNumber, msgApi]);

    const handleVerifyOtp = useCallback(async (form) => {
        try {
            const phone = form.getFieldValue("phoneNumber") || initialData.phoneNumber;
            const otp = form.getFieldValue("otpCode");
            if (!otp) {
                msgApi?.warning("Vui lòng nhập mã OTP");
                return;
            }
            setOtpVerifying(true);
            const res = await verifyPhoneOtp({ phoneNumber: phone, otp });
            if (res?.success === false) {
                msgApi?.error(res?.message || "Xác thực mã OTP thất bại");
                return;
            }
            setPhoneVerified(true);
            msgApi?.success("Xác thực mã OTP thành công");
        } catch (err) {
            const errMsg = getAxiosErrorMessage(err);
            msgApi?.error(errMsg || "Xác thực mã OTP thất bại");
        } finally {
            setOtpVerifying(false);
        }
    }, [initialData.phoneNumber, msgApi]);

    const onFinish = useCallback(async (values) => {
        setLoading(true);
        try {
            const payload = {
                fullName: values.fullName,
                province: values.province,
                addressLine: values.address,
            };
            const response = await updateUserProfile(payload);
            if (response?.success === false) {
                msgApi?.error(response?.message || "Cập nhật thất bại");
                return;
            }
            msgApi?.success("Cập nhật thành công");
            const updatedProfile = {
                ...initialData,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber,
                profile: {
                    ...initialData.profile,
                    fullName: values.fullName,
                    province: values.province,
                    addressLine: values.address,
                    avatarUrl: initialData.profile?.avatarUrl,
                },
                phoneVerified: phoneVerified,
            };
            onUpdated && onUpdated(updatedProfile);
        } catch (err) {
            msgApi?.error("Cập nhật thất bại");
            const errMsg = getAxiosErrorMessage(err);
            console.error("Cập nhật thất bại:", errMsg);
        } finally {
            setLoading(false);
        }
    }, [initialData, msgApi, onUpdated, phoneVerified]);

    return {
        // state
        preview,
        avatarUploading,
        loading,
        otpSending,
        otpVerifying,
        otpRequested,
        phoneVerified,
        emailExist,
        // actions
        initForm,
        handleUploadBefore,
        handleRequestOtp,
        handleVerifyOtp,
        onFinish,
    };
}
