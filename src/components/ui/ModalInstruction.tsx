import React from "react";

interface ModalInstructionProps {
  children: React.ReactNode;
}

const ModalInstruction: React.FC<ModalInstructionProps> = ({ children }) => {
  return (
    <div className="mt-4 rounded-[16px] home-panel-soft-bg px-4 py-3">
      <p className="home-muted text-sm leading-6">{children}</p>
    </div>
  );
};

export default ModalInstruction;
