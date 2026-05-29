import url from "../url";

const authKeys = {
  all: ["auth"] as const,
  verifyCaptcha: () => [...authKeys.all, url.verifyCaptcha.queryKey] as const,
  signup: () => [...authKeys.all, url.userSignup.queryKey] as const,
  loginOtp: () => [...authKeys.all, url.userLoginOtp.queryKey] as const,
  resendOtp: (email?: string) => [...authKeys.all, url.userResendOtp.queryKey, email] as const,
  verifyOtp: (email?: string) => [...authKeys.all, url.userVerifyOtp.queryKey, email] as const,
};

export default authKeys;
