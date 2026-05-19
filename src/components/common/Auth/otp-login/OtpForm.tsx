import React from "react";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";

type OtpFormProps = {
  email: string;
  otp: string[];
  isVerifying: boolean;
  isResending: boolean;
  resendSecondsLeft: number;
  onOtpChange: (index: number, value: string) => void;
  onBackspace: (index: number) => void;
  onPaste: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  error?: string;
};

const OtpForm: React.FC<OtpFormProps> = ({
  email,
  otp,
  isVerifying,
  isResending,
  resendSecondsLeft,
  onOtpChange,
  onBackspace,
  onPaste,
  onSubmit,
  onResend,
  error,
}) => {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(-1);
    onOtpChange(index, sanitizedValue);
    if (sanitizedValue && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="text-center">
        <h3 className="text-[1.75rem] font-semibold leading-tight theme-text-strong">
          Enter OTP
        </h3>
        <p className="mt-1 text-sm text-login-muted">
          We sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            variant="login"
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
              if (event.key === "Backspace" && otp[index]) {
                onBackspace(index);
              }
            }}
            onPaste={
              index === 0
                ? (event) => {
                    event.preventDefault();
                    onPaste(event.clipboardData.getData("text"));
                  }
                : undefined
            }
            inputMode="numeric"
            maxLength={1}
            className="h-12 w-12 rounded-xl px-0 text-center text-lg font-semibold sm:h-14 sm:w-14"
          />
        ))}
      </div>

      {error ? (
        <p className="text-center text-sm text-[var(--color-core-danger)]">{error}</p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-gradient-to-r from-login-primary to-login-bg-end text-base font-semibold text-white transition-all duration-300 hover:from-login-primary-hover hover:to-login-primary"
        disabled={isVerifying || otp.join("").length !== 6}
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          varinat="link"
          disabled={isResending || resendSecondsLeft > 0}
          onClick={onResend}
          className="text-sm"
        >
          {isResending
            ? "Resending..."
            : resendSecondsLeft > 0
              ? `Resend OTP in ${resendSecondsLeft}s`
              : "Resend OTP"}
        </Button>
      </div>
    </form>
  );
};

export default OtpForm;
