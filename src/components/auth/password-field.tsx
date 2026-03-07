"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "./form-field";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  inputClassName?: string;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  error,
  inputClassName,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      inputClassName={inputClassName}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-1 h-full text-gray-400 hover:text-brand-500 hover:bg-transparent"
        aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </FormField>
  );
}
