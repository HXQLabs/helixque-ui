"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: readonly string[] | ComboboxOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  allowCustom?: boolean;
  emptyLabel?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  multiple = false,
  allowCustom = false,
  emptyLabel = "No option found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Normalize options to { label, value }
  const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
    return options.map((opt) =>
      typeof opt === "string" ? { value: opt, label: opt } : opt
    );
  }, [options]);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(currentValue)
        ? selectedValues.filter((v) => v !== currentValue)
        : [...selectedValues, currentValue];
      onChange(newValues);
    } else {
      onChange(currentValue === value ? "" : currentValue);
      setOpen(false);
    }
  };

  const handleCustomSelect = () => {
    if (!allowCustom || !query) return;
    const customValue = query.trim();
    if (multiple) {
        if (!selectedValues.includes(customValue)) {
            onChange([...selectedValues, customValue]);
        }
    } else {
        onChange(customValue);
        setOpen(false);
    }
    setQuery("");
  }

  const handleRemove = (e: React.MouseEvent, valToRemove: string) => {
    e.stopPropagation();
    if (multiple) {
        onChange(selectedValues.filter(v => v !== valToRemove));
    } else {
        onChange("");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2 px-3"
        >
          {selectedValues.length > 0 ? (
             <div className="flex flex-wrap gap-1 items-center">
                 {multiple ? (
                     selectedValues.map((val) => {
                         const label = normalizedOptions.find(opt => opt.value === val)?.label || val;
                         return (
                             <Badge key={val} variant="secondary" className="rounded-md px-1.5 py-0.5 gap-1 font-normal">
                                 {label}
                                 <div 
                                    className="cursor-pointer hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                    onClick={(e) => handleRemove(e, val)}
                                 >
                                     <X className="h-3 w-3" />
                                 </div>
                             </Badge>
                         )
                     })
                 ) : (
                    <span className="truncate">
                        {normalizedOptions.find(opt => opt.value === value)?.label || value}
                    </span>
                 )}
             </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
             <CommandEmpty className="py-2 px-2 text-sm text-center text-muted-foreground">
                {allowCustom && query ? (
                   <div 
                     className="cursor-pointer bg-accent/50 p-2 rounded-sm hover:bg-accent text-accent-foreground"
                     onClick={handleCustomSelect}
                   >
                     Use "{query}"
                   </div>
                ) : (
                    emptyLabel
                )}
            </CommandEmpty>
            <CommandGroup>
              {normalizedOptions
                .filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()))
                .map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
