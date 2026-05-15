export type AuthMode = "signin" | "signup";

export type AuthStep = "form" | "otp";

export type VerifyCaptchaResponse = {
  header?: {
    code: number;
    message: string;
  };
  response?: {
    success?: boolean;
  };
};

export type SignupResponse = {
  header?: {
    code: number;
    message: string;
  };
  response?: {
    user_id: string;
    firstname: string;
    lastname: string;
    email: string;
    user_type: number;
  };
};

export type LoginOtpResponse = {
  header?: {
    code: number;
    message: string;
  };
  response?: Record<string, never>;
};

export type ResendOtpResponse = {
  header?: {
    code: number;
    message: string;
  };
  response?: {
    email: string;
    resend_attempt: number;
    message: string;
  };
};

export type VerifyOtpResponse = {
  code: number;
  message: string;
  response: {
    apitoken: string;
    firstname: string;
    lastname: string;
    usertype: string;
    grp: number;
    enabled: number;
  };
};

export type AuthApiEnvelope<T> = T | { response: T };

export type SignInFormState = {
  email: string;
};

export type SignUpFormState = {
  firstname: string;
  lastname: string;
  email: string;
};
