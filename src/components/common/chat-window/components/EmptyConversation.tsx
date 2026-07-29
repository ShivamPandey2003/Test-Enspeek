import { LuBotMessageSquare, LuSparkles } from "react-icons/lu";
import { CHAT_AGENT_LABEL } from "../../../../config/chatAgent";

const EmptyConversation = () => (
  <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 text-center">
    <div className="relative flex h-18 w-18 items-center justify-center rounded-[20px] bg-gradient-to-br from-login-primary to-action shadow-lg">
      <LuBotMessageSquare className="h-8 w-8 text-white" />
      <LuSparkles className="absolute -right-3 -top-3 h-4 w-4 text-amber-400" />
      <LuSparkles className="absolute -left-3 bottom-1 h-3.5 w-3.5 text-violet-500" />
    </div>
    <div className="mt-6">
      <p className="questionnaire-heading text-lg font-semibold">
        No conversation yet
      </p>
      <p className="home-highlight mt-2 text-sm leading-6">
        Ask {CHAT_AGENT_LABEL} for help with studies, questionnaires, reports, or the next step in your workflow.
      </p>
    </div>
  </div>
);

export default EmptyConversation;
