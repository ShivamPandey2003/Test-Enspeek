import React from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          size?: "normal" | "compact";
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
const COMPACT_CAPTCHA_QUERY = "(max-width: 380px)";

type CaptchaWidgetProps = {
  onVerify: (token: string | null) => void;
  resetSignal?: number;
};

type CaptchaSize = "normal" | "compact";

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

const getShouldUseCompactCaptcha = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(COMPACT_CAPTCHA_QUERY).matches;
};

const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({
  onVerify,
  resetSignal = 0,
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const [useCompactCaptcha, setUseCompactCaptcha] = React.useState(
    getShouldUseCompactCaptcha
  );

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
          onVerify(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(COMPACT_CAPTCHA_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setUseCompactCaptcha(event.matches);
    };
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    setUseCompactCaptcha(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange);
    } else {
      legacyMediaQuery.addListener?.(handleViewportChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleViewportChange);
      } else {
        legacyMediaQuery.removeListener?.(handleViewportChange);
      }
    };
  }, []);

  if (!RECAPTCHA_SITE_KEY) {
    return (
      <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
        reCAPTCHA site key is missing. Add `VITE_REACT_RECAPTCHA` to enable OTP auth.
      </div>
    );
  }

  const captchaSize: CaptchaSize = useCompactCaptcha ? "compact" : "normal";

  return (
    <div className="flex w-full max-w-full justify-center">
      {isReady ? (
        <RecaptchaInstance
          key={captchaSize}
          size={captchaSize}
          resetSignal={resetSignal}
          onVerify={onVerify}
        />
      ) : (
        <div className={captchaSize === "compact" ? "min-h-[144px] w-[164px]" : "min-h-[78px] w-[304px] max-w-full"} />
      )}
    </div>
  );
};

const RecaptchaInstance = ({
  size,
  resetSignal,
  onVerify,
}: {
  size: CaptchaSize;
  resetSignal: number;
  onVerify: (token: string | null) => void;
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<number | null>(null);
  const onVerifyRef = React.useRef(onVerify);

  React.useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  React.useEffect(() => {
    let mounted = true;

    onVerifyRef.current(null);

    window.grecaptcha?.ready(() => {
      if (!mounted || !containerRef.current || widgetIdRef.current !== null) {
        return;
      }

      widgetIdRef.current = window.grecaptcha?.render(containerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        size,
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onVerifyRef.current(null),
        "error-callback": () => onVerifyRef.current(null),
      }) ?? null;
    });

    return () => {
      mounted = false;
      onVerifyRef.current(null);
    };
  }, [size]);

  React.useEffect(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
      onVerifyRef.current(null);
    }
  }, [resetSignal]);

  return (
    <div
      ref={containerRef}
      className={size === "compact" ? "min-h-[144px] w-[164px]" : "min-h-[78px] w-[304px] max-w-full"}
    />
  );
};

export default CaptchaWidget;
