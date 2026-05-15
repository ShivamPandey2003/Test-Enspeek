import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useResendOtpMutation, useSendOtpLoginMutation, useSignupOtpMutation, useVerifyCaptchaMutation, useVerifyOtpMutation } from "../../../../api-network/auth/mutation";
import type { AppDispatch } from "../../../../store/store";
import { Login } from "../../../../store/UserSlice";
import Button from "../../../ui/Button";
import AuthCard from "../Form/AuthCard";
import OtpForm from "./OtpForm";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import type { AuthMode, AuthStep, SignInFormState, SignUpFormState } from "./types";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const OtpLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [step, setStep] = React.useState<AuthStep>("form");
  const [signInState, setSignInState] = React.useState<SignInFormState>({
    email: "",
  });
  const [signUpState, setSignUpState] = React.useState<SignUpFormState>({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [signInError, setSignInError] = React.useState<string>();
  const [signUpErrors, setSignUpErrors] = React.useState<Partial<SignUpFormState>>({});
  const [otp, setOtp] = React.useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [otpError, setOtpError] = React.useState<string>();
  const [pendingEmail, setPendingEmail] = React.useState("");
  const [resendSecondsLeft, setResendSecondsLeft] = React.useState(0);

  React.useEffect(() => {
    if (resendSecondsLeft <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setResendSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [resendSecondsLeft]);

  const verifyCaptchaMutation = useVerifyCaptchaMutation();
  const signupMutation = useSignupOtpMutation();
  React.useEffect(() => {
    if (signupMutation.isSuccess && signupMutation.data) {
      toast.success(signupMutation.data.header?.message || "User registered successfully");
      setMode("signin");
      setStep("form");
      setSignInState({ email: signUpState.email });
      setSignUpErrors({});
    }
  }, [signUpState.email, signupMutation.data, signupMutation.isSuccess]);

  const sendOtpMutation = useSendOtpLoginMutation();
  React.useEffect(() => {
    if (sendOtpMutation.isSuccess && sendOtpMutation.variables) {
      toast.success(sendOtpMutation.data?.header?.message || "OTP sent successfully");
      setPendingEmail(sendOtpMutation.variables.email);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setOtpError(undefined);
      setStep("otp");
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
    }
  }, [sendOtpMutation.data, sendOtpMutation.isSuccess, sendOtpMutation.variables]);

  const resendOtpMutation = useResendOtpMutation(pendingEmail || signInState.email.trim());
  React.useEffect(() => {
    if (resendOtpMutation.isSuccess) {
      toast.success(resendOtpMutation.data?.header?.message || "OTP resent successfully");
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtpError(undefined);
    }
  }, [resendOtpMutation.data, resendOtpMutation.isSuccess]);

  const verifyOtpMutation = useVerifyOtpMutation(pendingEmail || signInState.email.trim());
  React.useEffect(() => {
    if (verifyOtpMutation.isSuccess && verifyOtpMutation.data) {
      const data = verifyOtpMutation.data;
      dispatch(
        Login({
          apiToken: data.response.apitoken,
          firstName: data.response.firstname,
          lastName: data.response.lastname,
          userType: data.response.usertype,
          grp: String(data.response.grp),
          suggest_login_password: 0,
          updated_on: "",
          enabled: data.response.enabled,
        })
      );
      toast.success("Login successful!");
      navigate("/");
    }
  }, [dispatch, navigate, verifyOtpMutation.data, verifyOtpMutation.isSuccess]);

  const runCaptchaCheck = async (captchaToken: string) => {
    const captchaResponse = await verifyCaptchaMutation.mutateAsync(captchaToken);
    if (!captchaResponse.response?.success) {
      throw new Error(captchaResponse.header?.message || "Captcha verification failed");
    }
  };

  const handleSignInSubmit = async (captchaToken: string) => {
    const email = signInState.email.trim();

    if (!isValidEmail(email)) {
      setSignInError("Enter a valid email address");
      return;
    }

    setSignInError(undefined);

    try {
      await runCaptchaCheck(captchaToken);
      await sendOtpMutation.mutateAsync({ email });
    } catch (error: any) {
      toast.error(error?.message || "Unable to send OTP");
    }
  };

  const handleSignUpSubmit = async (captchaToken: string) => {
    const nextErrors: Partial<SignUpFormState> = {};
    const firstname = signUpState.firstname.trim();
    const lastname = signUpState.lastname.trim();
    const email = signUpState.email.trim();

    if (firstname.length < 2) {
      nextErrors.firstname = "Enter a valid first name";
    }
    if (lastname.length < 2) {
      nextErrors.lastname = "Enter a valid last name";
    }
    if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    setSignUpErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await runCaptchaCheck(captchaToken);
      await signupMutation.mutateAsync({ firstname, lastname, email });
    } catch (error: any) {
      toast.error(error?.message || "Unable to create account");
    }
  };

  const handleOtpSubmit = async () => {
    const value = otp.join("");
    if (value.length !== OTP_LENGTH) {
      setOtpError("Enter the full 6-digit OTP");
      return;
    }

    setOtpError(undefined);

    try {
      await verifyOtpMutation.mutateAsync({
        email: pendingEmail || signInState.email.trim(),
        otp: value,
      });
    } catch (error: any) {
      setOtpError(error?.message || "Invalid OTP");
      toast.error(error?.message || "Unable to verify OTP");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    setOtp((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
    setOtpError(undefined);
  };

  const handleOtpBackspace = (index: number) => {
    setOtp((current) => {
      const next = [...current];
      next[index] = "";
      return next;
    });
  };

  const handleOtpPaste = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    setOtp((current) =>
      current.map((_, index) => digits[index] ?? "")
    );
    setOtpError(undefined);
  };

  const handleResendOtp = async () => {
    try {
      await resendOtpMutation.mutateAsync({
        email: pendingEmail || signInState.email.trim(),
      });
    } catch (error: any) {
      toast.error(error?.message || "Unable to resend OTP");
    }
  };

  return (
    <AuthCard
      compact={step === "form" && mode === "signup"}
      topSlot={
        step === "form" ? (
          <div className="mb-4 inline-flex rounded-full bg-[var(--color-login-input)] p-1">
            <Button
              type="button"
              varinat={mode === "signin" ? "theme" : "ghost"}
              size="sm"
              className="rounded-full px-5"
              onClick={() => setMode("signin")}
            >
              Sign in
            </Button>
            <Button
              type="button"
              varinat={mode === "signup" ? "theme" : "ghost"}
              size="sm"
              className="rounded-full px-5"
              onClick={() => setMode("signup")}
            >
              Sign up
            </Button>
          </div>
        ) : undefined
      }
      title={step === "otp" ? "Verify your email" : mode === "signin" ? "OTP Login" : "Create your account"}
      subtitle={
        step === "otp"
          ? "Finish login with the one-time password"
          : mode === "signin"
            ? "Use your email to receive a one-time password"
            : "Register first, then sign in with OTP"
      }
      footer={
        step === "otp" ? (
          <Button
            type="button"
            varinat="link"
            className="text-sm"
            onClick={() => {
              setStep("form");
              setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
              setOtpError(undefined);
            }}
          >
            Change email
          </Button>
        ) : mode === "signin" ? (
          <p className="text-sm text-login-muted">
            Need an account?{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-login-primary underline-offset-4 hover:underline"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm text-login-muted">
            Already registered?{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-login-primary underline-offset-4 hover:underline"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
          </p>
        )
      }
    >
      {step === "otp" ? (
        <OtpForm
          email={pendingEmail || signInState.email}
          otp={otp}
          isVerifying={verifyOtpMutation.isPending}
          isResending={resendOtpMutation.isPending}
          resendSecondsLeft={resendSecondsLeft}
          onOtpChange={handleOtpChange}
          onBackspace={handleOtpBackspace}
          onPaste={handleOtpPaste}
          onSubmit={handleOtpSubmit}
          onResend={handleResendOtp}
          error={otpError}
        />
      ) : mode === "signin" ? (
        <SignInForm
          email={signInState.email}
          emailError={signInError}
          isPending={sendOtpMutation.isPending || verifyCaptchaMutation.isPending}
          onEmailChange={(value) => setSignInState({ email: value })}
          onSubmit={handleSignInSubmit}
        />
      ) : (
        <SignUpForm
          firstname={signUpState.firstname}
          lastname={signUpState.lastname}
          email={signUpState.email}
          errors={signUpErrors}
          isPending={signupMutation.isPending || verifyCaptchaMutation.isPending}
          onChange={(field, value) =>
            setSignUpState((current) => ({
              ...current,
              [field]: value,
            }))
          }
          onSubmit={handleSignUpSubmit}
        />
      )}
    </AuthCard>
  );
};

export default OtpLoginPage;
