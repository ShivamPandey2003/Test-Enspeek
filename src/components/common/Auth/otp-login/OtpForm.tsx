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
        <h3 className="text-[clamp(1.45rem,8vw,1.75rem)] font-semibold leading-tight theme-text-strong">
          Enter OTP
        </h3>
        <p className="mt-1 text-wrap break-words text-sm text-login-muted">
          We sent a verification code to <span className="font-medium break-all">{email}</span>
        </p>
      </div>

      <div className="grid w-full grid-cols-6 gap-1.5 min-[380px]:gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            data-test-id={`otp-digit-${index}`}
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
            className="h-[clamp(2.5rem,12vw,3.5rem)] w-full min-w-0 rounded-xl border border-[var(--color-brand-primary)]/50 px-0 text-center text-lg font-semibold"
          />
        ))}
      </div>

      {error ? (
        <p data-test-id="otp-error" className="text-center text-sm text-[var(--color-core-danger)]">{error}</p>
      ) : null}

      <Button
        type="submit"
        data-test-id="otp-submit-button"
        className="h-12 w-full rounded-xl bg-gradient-to-r from-login-primary to-login-bg-end text-base font-semibold text-white transition-all duration-300 hover:from-login-primary-hover hover:to-login-primary"
        disabled={isVerifying || otp.join("").length !== 6}
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          data-test-id="otp-resend-button"
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
