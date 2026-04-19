"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Languages } from "lucide-react";
import { useState } from "react";

const languages = [
  { label: "English", code: "en" },
  { label: "Deutsch", code: "de" },
  { label: "Española", code: "es" },
  { label: "Português", code: "pt" },
  { label: "한국인", code: "ko" },
];

export function LanguageSelector() {
  const [, setSelected] = useState(languages[0]);

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <DropdownMenuContent align="center">
          {languages.map((lang) => (
            <DropdownMenuItem key={lang.code} onClick={() => setSelected(lang)}>
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>Language</TooltipContent>
    </Tooltip>
  );
}
