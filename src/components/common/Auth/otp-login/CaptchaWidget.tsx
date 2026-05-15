import React from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

const RECAPTCHA_SCRIPT_ID = "enspeek-recaptcha-script";
const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_REACT_RECAPTCHA ||
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  "";

type CaptchaWidgetProps = {
  onVerify: (token: string | null) => void;
  resetSignal?: number;
};

const loadRecaptchaScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });

const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({
  onVerify,
  resetSignal = 0,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<number | null>(null);
  const onVerifyRef = React.useRef(onVerify);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  React.useEffect(() => {
    let mounted = true;

    loadRecaptchaScript()
      .then(() => {
        if (mounted) {
          setIsReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsReady(false);
          onVerifyRef.current(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!isReady || !containerRef.current || !window.grecaptcha || !RECAPTCHA_SITE_KEY) {
      return;
    }

    window.grecaptcha.ready(() => {
      if (!containerRef.current || widgetIdRef.current !== null) {
        return;
      }

      widgetIdRef.current = window.grecaptcha?.render(containerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onVerifyRef.current(null),
        "error-callback": () => onVerifyRef.current(null),
      }) ?? null;
    });
  }, [isReady]);

  React.useEffect(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
      onVerifyRef.current(null);
    }
  }, [resetSignal]);

  if (!RECAPTCHA_SITE_KEY) {
    return (
      <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
        reCAPTCHA site key is missing. Add `VITE_REACT_RECAPTCHA` to enable OTP auth.
      </div>
    );
  }

  return <div ref={containerRef} className="mx-auto min-h-[78px] w-fit" />;
};

export default CaptchaWidget;
