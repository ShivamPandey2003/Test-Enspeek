import React from "react";
import { LuClock3 } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useResendOtpMutation, useSendOtpLoginMutation, useSignupOtpMutation, useVerifyOtpMutation } from "../../../../api-network/auth/mutation";
// useVerifyCaptchaMutation
import type { AppDispatch } from "../../../../store/store";
import { Login } from "../../../../store/UserSlice";
import Button from "../../../ui/Button";
import AuthCard from "../Form/AuthCard";
import OtpForm from "./OtpForm";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import type { AuthMode, AuthStep, SignInFormState, SignUpFormState } from "./types";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const getErrorValue = (error: unknown, key: "hasToast" | "message") => {
  if (!error || typeof error !== "object" || !(key in error)) {
    return undefined;
  }

  return (error as Record<string, unknown>)[key];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const message = getErrorValue(error, "message");
  return typeof message === "string" && message.trim() ? message : fallback;
};

const showToastWhenNeeded = (error: unknown, fallback: string) => {
  if (getErrorValue(error, "hasToast")) return;

  toast.error(getErrorMessage(error, fallback));
};

const isApprovalPendingResponse = (response: unknown) =>
  Boolean(
    response &&
      typeof response === "object" &&
      "code" in response &&
      Number((response as { code?: number }).code) === 403
  );

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
  const [signupPendingApproval, setSignupPendingApproval] = React.useState(false);
  const [approvalPendingSource, setApprovalPendingSource] = React.useState<"signin" | "signup">("signup");
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

  // const verifyCaptchaMutation = useVerifyCaptchaMutation();
  const signupMutation = useSignupOtpMutation();

  const sendOtpMutation = useSendOtpLoginMutation();
  React.useEffect(() => {
    if (sendOtpMutation.isSuccess && sendOtpMutation.variables) {
      if (isApprovalPendingResponse(sendOtpMutation.data)) {
        setPendingEmail(sendOtpMutation.variables.email);
        setApprovalPendingSource("signin");
        setSignupPendingApproval(true);
        setStep("form");
        setMode("signin");
        return;
      }

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
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setOtpError(undefined);
    }
  }, [resendOtpMutation.data, resendOtpMutation.isSuccess]);

  const verifyOtpMutation = useVerifyOtpMutation(pendingEmail || signInState.email.trim());
  React.useEffect(() => {
    if (verifyOtpMutation.isSuccess && verifyOtpMutation.data) {
      const data = verifyOtpMutation.data;
      const response = data.response as typeof data.response & {
        loginType?: string;
        logintype?: string;
        is_approved?: number;
      };
      if (response.is_approved === 0) {
        toast.info("Your account is still awaiting approval. You will receive an email once it is approved.");
        setStep("form");
        setMode("signin");
        return;
      }
      localStorage.setItem("token", data.response.access_token);
      sessionStorage.setItem(
        `enspeek-show-free-plan-modal:${data.response.apitoken}`,
        "1"
      );
      dispatch(
        Login({
          apiToken: data.response.apitoken,
          firstName: data.response.firstname,
          lastName: data.response.lastname,
          loginType: response.loginType ?? response.logintype,
          userType: data.response.usertype,
          grp: String(data.response.grp),
          suggest_login_password: 0,
          updated_on: "",
          enabled: data.response.enabled,
          planInfoSynced: false,
        })
      );
      toast.success("Login successful!");
      navigate("/");
    }
  }, [dispatch, navigate, verifyOtpMutation.data, verifyOtpMutation.isSuccess]);

  // const runCaptchaCheck = async (captchaToken: string) => {
  //   const captchaResponse = await verifyCaptchaMutation.mutateAsync(captchaToken);
  //   if (!captchaResponse.response?.success) {
  //     throw new Error(captchaResponse.header?.message || "Captcha verification failed");
  //   }
  // };

  // captchaToken: string
  const handleSignInSubmit = async () => {
    const email = signInState.email.trim();

    if (!isValidEmail(email)) {
      setSignInError("Enter a valid email address");
      return;
    }

    setSignInError(undefined);

    try {
      // await runCaptchaCheck(captchaToken);
      await sendOtpMutation.mutateAsync({ email });
    } catch (error: unknown) {
      showToastWhenNeeded(error, "Unable to send OTP");
    }
  };

  // captchaToken: string
  const handleSignUpSubmit = async () => {
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
      // await runCaptchaCheck(captchaToken);
      const signupResponse = await signupMutation.mutateAsync({
        firstname,
        lastname,
        email,
      });
      toast.success(signupResponse.header?.message || "User registered successfully");
      setApprovalPendingSource("signup");
      setSignupPendingApproval(true);
      setStep("form");
      setSignUpErrors({});
    } catch (error: unknown) {
      showToastWhenNeeded(error, "Unable to create account");
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
    } catch (error: unknown) {
      setOtpError(getErrorMessage(error, "Invalid OTP"));
      showToastWhenNeeded(error, "Unable to verify OTP");
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
    } catch (error: unknown) {
      showToastWhenNeeded(error, "Unable to resend OTP");
    }
  };

  return (
    <AuthCard
      compact={step === "form" && mode === "signup"}
      titleClassName={
        step === "form" && !signupPendingApproval
          ? "text-[1.125rem] font-medium sm:text-[1.25rem]"
          : undefined
      }
      title={
        signupPendingApproval
          ? approvalPendingSource === "signin"
            ? "Account Request Under Review"
            : "Account Request Submitted"
          : step === "otp"
            ? "Verify your email"
            : mode === "signin"
              ? "Sign in to continue"
              : "Create your account"
      }
      subtitle={
        signupPendingApproval
          ? "Your account is awaiting approval."
          : step === "otp"
          ? "Finish login with the one-time password"
          : undefined
      }
      footer={
        signupPendingApproval ? (
          <p className="text-sm text-login-muted">
            Already approved?{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-login-primary underline-offset-4 hover:underline"
              onClick={() => {
                setSignupPendingApproval(false);
                setApprovalPendingSource("signup");
                setMode("signin");
                setSignInState({ email: pendingEmail || signUpState.email });
              }}
            >
              Sign in
            </button>
          </p>
        ) : step === "otp" ? (
          <Button
            type="button"
            variant="link"
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
              data-test-id="auth-switch-to-signup"
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
              data-test-id="auth-switch-to-signin"
              className="cursor-pointer font-semibold text-login-primary underline-offset-4 hover:underline"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
          </p>
        )
      }
    >
      {signupPendingApproval ? (
        <SignupApprovalPendingMessage
          email={pendingEmail || signUpState.email}
          source={approvalPendingSource}
        />
      ) : step === "otp" ? (
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
          isPending={sendOtpMutation.isPending}
          // || verifyCaptchaMutation.isPending
          onEmailChange={(value) => setSignInState({ email: value })}
          onSubmit={handleSignInSubmit}
        />
      ) : (
        <SignUpForm
          firstname={signUpState.firstname}
          lastname={signUpState.lastname}
          email={signUpState.email}
          errors={signUpErrors}
          isPending={signupMutation.isPending}
          // || verifyCaptchaMutation.isPending
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

const SignupApprovalPendingMessage = ({
  email,
  source,
}: {
  email: string;
  source: "signin" | "signup";
}) => (
  <div
    data-test-id="signup-approval-pending"
    className="rounded-2xl border border-[var(--color-brand-primary)]/20 bg-[var(--color-login-input)] px-4 py-5 text-center min-[380px]:px-5"
  >
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-login-primary/10 text-login-primary">
      <LuClock3 className="h-6 w-6" />
    </div>
    <p className="theme-text-strong mt-4 text-[16px] font-semibold">
      Your account request is under review.
    </p>
    <p className="mt-2 text-wrap break-words text-sm leading-6 text-login-muted">
      {source === "signin"
        ? "Your account request is currently under review. You will be able to sign in once your account has been approved by the admin."
        : "Thank you for registering with Enspeek. Your request has been received and is currently awaiting approval. Once approved, you will receive an email confirmation and can sign in successfully."}
    </p>
    {email ? (
      <p className="mt-3 break-all text-sm font-semibold text-login-primary">
        {email}
      </p>
    ) : null}
  </div>
);

export default OtpLoginPage;
