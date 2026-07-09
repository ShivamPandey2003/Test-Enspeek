import React from "react";
import { LuUserRound } from "react-icons/lu";
import { cn } from "../../../../utils";
import { ChatAgentIcon } from "../../../../assets/icons";

type ChatAvatarProps = {
  type: "ai" | "user";
  label: string;
  title: string;
};

const ChatAvatar = ({ type, label, title }: ChatAvatarProps) => (
  <div className="mt-0.5 flex w-10 shrink-0 flex-col items-center gap-1">
    <div
      aria-label={title}
      title={title}
      className={cn(
        "inline-flex h-9 w-9 select-none items-center justify-center rounded-full text-center shadow-sm",
        type === "user"
          ? "bg-brand-primary text-white"
          : "border border-border-default bg-white"
      )}
    >
      {type === "user" ? (
        <LuUserRound className="h-5 w-5" />
      ) : (
        <img
          src={ChatAgentIcon}
          alt=""
          aria-hidden="true"
          className="h-6 w-6 object-contain"
        />
      )}
    </div>
    <span className="max-w-12 truncate pb-0.5 text-center text-[10px] font-semibold leading-4 text-text-supporting">
      {label}
    </span>
  </div>
);

export default React.memo(ChatAvatar);
