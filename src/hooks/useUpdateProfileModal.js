import { useCallback, useMemo, useState } from "react";
import { getAxiosErrorMessage } from "@config/errorMessage";
import {
  updateUserProfile,
  updateUserAvatar,
  requestPhoneOpt,
  verifyPhoneOtp,
  requestEmailOtp,
  updateEmailWithOtp,
} from "@services/accountService";

const getAvatarUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";
  return `${API_BASE}/api/accounts/image/${filename}/avatar`;
};

export default function useUpdateProfileModal({
  initialData = {},
  onUpdated,
  msgApi,
}) {
  const [preview, setPreview] = useState(
    initialData.avatar || initialData.avatarUrl || null
  );
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const emailExist = useMemo(
    () => Boolean(initialData.email),
    [initialData.email]
  );

  const initForm = useCallback(
    (form) => {
      const profileData = initialData.profile || {};
      const fullNameValue = profileData.fullName ?? initialData.fullName ?? "";
      form.setFieldsValue({
        fullName: fullNameValue,
        email: initialData.email,
        phoneNumber: initialData.phoneNumber,
        address: profileData.addressLine
          ? {
              line: profileData.addressLine,
              province: profileData.province
                ? { label: profileData.province, code: profileData.province }
                : undefined,
            }
          : undefined,
        otpCode: "",
      });

      const avaUrl = profileData.avatarUrl;
      setPreview(avaUrl ? getAvatarUrl(avaUrl) : null);

      const derivedPhoneVerified =
        initialData?.phoneVerified ??
        initialData?.profile?.phoneVerified ??
        false;
      setPhoneVerified(!!derivedPhoneVerified);
    },
    [initialData]
  );

  const handleUploadBefore = useCallback(
    async (file) => {
      const ok = file.type.startsWith("image/");
      if (!ok) {
        msgApi?.error("Chỉ chấp nhận tệp ảnh hợp lệ.");
        return false;
      }
      const isLt500 = file.size / 1024 / 1024 < 500;
      if (!isLt500) {
        msgApi?.error("Kích thước ảnh phải nhỏ hơn 500MB.");
        return false;
      }
      const oldPreview = preview;
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      setAvatarUploading(true);
      try {
        const uploadRes = await updateUserAvatar(file);
        if (
          uploadRes?.status < 200 ||
          uploadRes?.status >= 300 ||
          uploadRes?.success === false
        ) {
          msgApi?.error(uploadRes?.message || "Tải ảnh đại diện thất bại");
          setPreview(oldPreview);
          return false;
        }
        const nameCandidate =
          uploadRes?.data?.avatarUrl || uploadRes?.avatarUrl || uploadRes?.data;
        const newAvatarFileName =
          typeof nameCandidate === "string" ? nameCandidate : null;
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
    },
    [initialData, msgApi, onUpdated, preview]
  );

  const handleRequestOtp = useCallback(
    async (form) => {
      try {
        const phone =
          form.getFieldValue("phoneNumber") || initialData.phoneNumber;
        if (!phone) {
          msgApi?.warning("Vui lòng nhập số điện thoại");
          return;
        }
        setOtpSending(true);
        const type = "REGISTER"
        console.log(type, phone)
        
        const res = await requestPhoneOpt(phone, type);
        if (res?.success === false) {
          msgApi?.error(res?.message || "Gửi mã OTP thất bại");
          return;
        }
        setOtpRequested(true);
        msgApi?.success("Đã gửi mã OTP đến số điện thoại của bạn");
      } catch (err) {
        const errMsg = getAxiosErrorMessage(err);
        msgApi?.error(errMsg || "Không thể gửi mã OTP");
      } finally {
        setOtpSending(false);
      }
    },
    [initialData.phoneNumber, msgApi]
  );

const handleVerifyOtp = useCallback(
  async (form) => {
    try {
      const phone =
        form.getFieldValue("phoneNumber") || initialData.phoneNumber;
      const otp = form.getFieldValue("otpCode");

      if (!otp) {
        msgApi?.warning("Vui lòng nhập mã OTP");
        return;
      }

      setOtpVerifying(true);

      const res = await verifyPhoneOtp({
        phoneNumber: phone,
        otp,
        type: "UPDATE_PHONE",
      });

      if (res?.success === false) {
        msgApi?.error(res?.message || "Xác thực mã OTP thất bại");
        return;
      }

      setPhoneVerified(true);
      setOtpRequested(false);
      msgApi?.success("Xác thực số điện thoại thành công");
    } catch (err) {
      const errMsg = getAxiosErrorMessage(err);
      msgApi?.error(errMsg || "Xác thực mã OTP thất bại");
    } finally {
      setOtpVerifying(false);
    }
  },
  [initialData.phoneNumber, msgApi]
);
  const handleResendEmailOtp = useCallback(
    async (email) => {
      try {
        if (!email) {
          msgApi?.warning("Vui lòng nhập email để gửi OTP");
          return;
        }
        setEmailSending(true);
        await requestEmailOtp(email);
        msgApi?.info("Mã OTP đã được gửi đến email của bạn");
      } catch (err) {
        const errMsg = getAxiosErrorMessage(err);
        msgApi?.error(errMsg || "Không thể gửi mã OTP đến email");
      } finally {
        setEmailSending(false);
      }
    },
    [msgApi]
  );

  const handleVerifyEmailOtp = useCallback(
    async (email, otp) => {
      try {
        if (!email || !otp) {
          msgApi?.warning("Thiếu thông tin email hoặc mã OTP");
          return;
        }
        setEmailVerifying(true);
        const res = await updateEmailWithOtp({ newEmail: email, otp });
        if (res?.success === false) {
          msgApi?.error(res?.message || "Xác thực email thất bại");
          return;
        }
        setEmailVerified(true);
        msgApi?.success("Xác thực email thành công!");
        if (onUpdated) onUpdated({ ...initialData, email });
      } catch (err) {
        const errMsg = getAxiosErrorMessage(err);
        msgApi?.error(errMsg || "Xác thực email thất bại");
      } finally {
        setEmailVerifying(false);
      }
    },
    [msgApi, onUpdated, initialData]
  );

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const { address } = values || {};
        const payload = {
          fullName: values.fullName,
          province: address?.province?.label || address?.province || "",
          addressLine: [
            address?.line,
            address?.ward?.label,
            address?.district?.label,
            address?.province?.label,
          ]
            .filter(Boolean)
            .join(", "),
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
            ...payload,
          },
          phoneVerified,
        };
        onUpdated && onUpdated(updatedProfile);
      } catch (err) {
        const errMsg = getAxiosErrorMessage(err);
        msgApi?.error(errMsg || "Cập nhật thất bại");
      } finally {
        setLoading(false);
      }
    },
    [initialData, msgApi, onUpdated, phoneVerified]
  );

  return {
    preview,
    avatarUploading,
    loading,
    otpSending,
    otpVerifying,
    otpRequested,
    phoneVerified,
    emailExist,
    emailVerified,
    emailVerifying,
    emailSending,
    initForm,
    handleUploadBefore,
    handleRequestOtp,
    handleVerifyOtp,
    handleVerifyEmailOtp,
    handleResendEmailOtp,
    onFinish,
  };
}
