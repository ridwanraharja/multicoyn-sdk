import { useState } from "react";

type ModalView = "form" | "processing" | "success";

export function usePaymentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>("form");

  const open = () => {
    setIsOpen(true);
    setView("form");
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setView("form"), 300);
  };

  const showProcessing = () => setView("processing");
  const showSuccess = () => setView("success");
  const showForm = () => setView("form");

  return {
    isOpen,
    view,
    open,
    close,
    showProcessing,
    showSuccess,
    showForm,
  };
}
