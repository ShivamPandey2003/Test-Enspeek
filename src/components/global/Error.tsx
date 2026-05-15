import React from 'react';
import { FiAlertCircle } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { GoHome } from "react-icons/go";
import Button from "../ui/Button";

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showRetry?: boolean;
  showHome?: boolean;
}

const Error: React.FC<ErrorPageProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an issue while loading your data. Please try again later.',
  onRetry,
  onGoHome,
  showRetry = true,
  showHome = false,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mb-6 h-16 w-16 theme-text-muted">
        <FiAlertCircle className="w-full h-full" />
      </div>

      <h2 className="mb-3 text-2xl font-semibold theme-text-strong">
        {title}
      </h2>

      <p className="mb-8 max-w-md leading-relaxed theme-text-default">
        {message}
      </p>

      <div className="flex gap-3">
        {showRetry && (
          <Button type="button" varinat="theme" onClick={handleRetry} className="rounded-lg px-6 py-2.5 font-medium">
            <LuRefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}

        {showHome && (
          <Button type="button" varinat="outline" onClick={handleGoHome} className="rounded-lg px-6 py-2.5 font-medium">
            <GoHome className="w-4 h-4" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;
