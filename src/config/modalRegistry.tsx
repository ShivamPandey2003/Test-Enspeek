import type { ComponentType } from "react";

type ModalRegistryProps = {
  isOpen: boolean;
  onClose: () => void;
  payload?: Record<string, unknown> | null;
};

export type ModalRegistryEntry = {
  id: string;
  component?: ComponentType<ModalRegistryProps>;
};

export const modalRegistry: Record<string, ModalRegistryEntry> = {};

export default modalRegistry;
