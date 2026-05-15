import { useState, useEffect, useCallback, useRef } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import DynamicModel from "./DynamicModel";
import EmailPermissionsTable from "../common/list/shareModaltable";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../services/apiService";

interface EmailEntry {
  email: string;
  share: boolean;
  modifyInput: boolean;
  output: boolean;
  initiateSample: boolean;
}
export default function ShareStudyModal({
  isOpen,
  onClose,
  studyName,
}: ShareStudyModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [addedEmails, setAddedEmails] = useState<EmailEntry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useMutation({
    mutationKey: ["lookUp"],
    mutationFn: async (query: string) => {
      const resp = await apiRequest("post", "user/lookup", {
        email_address: query,
      });
      return resp.response || [];
    },
  });

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      try {
        const result = await fetchSuggestions.mutateAsync(inputValue);
        if (Array.isArray(result)) {
          const emailList = result
            .map((item: any) => item.emailAddress)
            .filter(
              (email: string) =>
                email && !addedEmails.some((entry) => entry.email === email)
            );

          setSuggestions(emailList);
        }
      } catch (error) {}
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue, addedEmails]);

  const addEmail = useCallback((email: string) => {
    setAddedEmails((prev) => [
      ...prev,
      {
        email,
        share: false,
        modifyInput: false,
        output: false,
        initiateSample: false,
      },
    ]);
    setInputValue("");
    setSuggestions([]);
  }, []);

  const toggleCheckbox = useCallback(
    (index: number, field: keyof Omit<EmailEntry, "email">) => {
      setAddedEmails((prev) =>
        prev.map((entry, i) =>
          i === index ? { ...entry, [field]: !entry[field] } : entry
        )
      );
    },
    []
  );

  if (!isOpen) return null;

  return (
    <DynamicModel
      Title={`Share Study: ${studyName}`}
      ButtonText="Share"
      isOpen={isOpen}
      onClick={() => {}}
      onClose={onClose}
      className="max-w-4xl max-h-screen overflow-y-auto"
      footerContent={
        <p className="text-sm theme-text-default">
          * Output shared will be visible to users only when{" "}
          <strong>{studyName}</strong> is initiated for sample collection.
        </p>
      }
    >
      <div className="mb-4">
        <label className="block mb-2">Enter name or email</label>
        <Input
          variant="questionnaire"
          className="questionnaire-border border"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="eg. abc@ke.com ..."
        />

        {suggestions.length > 0 && (
          <div className="relative">
            <div className="theme-surface theme-border mt-1 z-10 max-h-42 overflow-y-auto rounded-lg border shadow-lg">
              {suggestions.map((email, index) => (
                <div
                  onClick={() => addEmail(email)}
                  key={index}
                  className="theme-border flex items-center justify-between border-b p-3 hover:bg-[var(--color-surface-soft)] last:border-b-0"
                >
                  <span className="text-sm theme-text-strong">{email}</span>
                  <Button
                    size="sm"
                    onClick={() => addEmail(email)}
                    className="px-3 py-1 text-xs"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <EmailPermissionsTable
        addedEmails={addedEmails}
        toggleCheckbox={toggleCheckbox}
      />
    </DynamicModel>
  );
}
