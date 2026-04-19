"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LanguagesIcon } from "lucide-react";
import * as React from "react";

const languages = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
  { label: "Española", value: "es" },
  { label: "Português", value: "pt" },
  { label: "한국인", value: "ko" },
];

export function LanguageSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <LanguagesIcon className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {languages.map((l) => (
          <DropdownMenuItem key={l.value} onClick={() => setLang(l.label)}>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
