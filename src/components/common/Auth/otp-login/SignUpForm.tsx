import React from "react";
import { LuArrowRight } from "react-icons/lu";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import CaptchaWidget from "./CaptchaWidget";

type SignUpFormProps = {
  firstname: string;
  lastname: string;
  email: string;
  errors: Partial<{
    firstname?: string;
    lastname?: string;
    email?: string;
  }>;
  isPending: boolean;
  onChange: (field: "firstname" | "lastname" | "email", value: string) => void;
  onSubmit: (captchaToken: string) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ firstname, lastname, email, errors, isPending, onChange, onSubmit }) => {
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
    <form className="space-y-3" onSubmit={handleSubmit} noValidate>
      <div>
        <Input
          id="otp-signup-firstname"
          variant="login"
          type="text"
          value={firstname}
          onChange={(event) => onChange("firstname", event.target.value)}
          placeholder="First name"
          autoComplete="given-name"
        />
        {errors.firstname ? (
          <p className="mt-1 text-sm text-[var(--color-core-danger)]">{errors.firstname}</p>
        ) : null}
      </div>

      <div>
        <Input
          id="otp-signup-lastname"
          variant="login"
          type="text"
          value={lastname}
          onChange={(event) => onChange("lastname", event.target.value)}
          placeholder="Last name"
          autoComplete="family-name"
        />
        {errors.lastname ? (
          <p className="mt-1 text-sm text-[var(--color-core-danger)]">{errors.lastname}</p>
        ) : null}
      </div>

      <div>
        <Input
          id="otp-signup-email"
          variant="login"
          type="email"
          value={email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-[var(--color-core-danger)]">{errors.email}</p>
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
          {isPending ? "Processing..." : "Continue"}
          {!isPending ? <LuArrowRight className="ml-2 h-4 w-4" /> : null}
        </span>
      </Button>
    </form>
  );
};

export default SignUpForm;
