import React from "react";
import { LuArrowRight } from "react-icons/lu";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import CaptchaWidget from "./CaptchaWidget";

type SignInFormProps = {
  email: string;
  emailError?: string;
  isPending: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (captchaToken: string) => void;
};

const SignInForm: React.FC<SignInFormProps> = ({ email, emailError, isPending, onEmailChange, onSubmit }) => {
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [captchaResetSignal, setCaptchaResetSignal] = React.useState(0);
  const handleCaptchaVerify = React.useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!captchaToken) {
      setCaptchaResetSignal((value) => value + 1);
      return;
    }
    onSubmit(captchaToken);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <Input
          id="otp-login-email"
          variant="login"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        {emailError ? (
          <p className="mt-1 text-sm text-[var(--color-core-danger)]">{emailError}</p>
        ) : null}
      </div>

      <CaptchaWidget
        onVerify={handleCaptchaVerify}
        resetSignal={captchaResetSignal}
      />

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-gradient-to-r from-login-primary to-login-bg-end text-base font-semibold text-white transition-all duration-300 hover:from-login-primary-hover hover:to-login-primary"
        disabled={isPending || !captchaToken}
      >
        <span className="flex items-center justify-center">
          {isPending ? "Sending OTP..." : "Continue"}
          {!isPending ? <LuArrowRight className="ml-2 h-4 w-4" /> : null}
        </span>
      </Button>
    </form>
  );
};

export default SignInForm;
