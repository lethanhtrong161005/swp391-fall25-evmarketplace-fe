import { useAuthAction } from "./useAuthAction";
import { useOtpAction } from "./useOtpAction";
import { useRegisterAction } from "./useRegisterAction";
import { useResetPasswordAction } from "./useResetPasswordAction";
import { useAuth} from "@hooks/useAuth";

export const useHeaderAction = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const auth = useAuthAction({ isLoggedIn, user, login, logout });
  const otp = useOtpAction();
  const register = useRegisterAction(auth.login);
  const reset = useResetPasswordAction();

  // callback khi OTP verify thành công
  const handleOtpSuccess = (purpose) => {
    otp.setOpenOtp(false);
    if (purpose === "REGISTER") register.setOpenRegisterForm(true);
    else if (purpose === "RESET") reset.setOpenResetForm(true);
  };

  const handleOtpStart = (phone, type) => {
    otp.setRegPhone(phone);
    otp.setOtpPurpose(type);
    otp.setOpenOtp(true);
  };

  return {
    auth,
    otp,
    register,
    reset,
    handleOtpSuccess,
    handleOtpStart,
  };
};
