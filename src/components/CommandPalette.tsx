"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, BookOpen, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  name: string;
  icon: React.ElementType;
  action: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const routes = [
    { id: "route-dashboard", name: "Dashboard", path: "/dashboard", icon: Home },
    { id: "route-profile", name: "Profile", path: "/profile", icon: User },
    { id: "route-docs", name: "Documentation", path: "/docs", icon: BookOpen },
    { id: "route-settings", name: "Settings", path: "/settings", icon: Settings },
  ];

  const mockActions = [
    { id: "action-logout", name: "Mock: Logout", action: () => alert("Logged Out") },
    { id: "action-theme", name: "Mock: Toggle Theme", action: () => alert("Theme Toggled") },
  ];

  const allCommands: Command[] = [
    ...routes.map((r) => ({
      ...r,
      action: () => {
        router.push(r.path);
        setIsOpen(false);
      },
    })),
    ...mockActions.map((a) => ({
      ...a,
      icon: Settings,
      action: () => {
        a.action();
        setIsOpen(false);
      },
    })),
  ];

  const filteredCommands = allCommands.filter((command) =>
    command.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current && isOpen && filteredCommands.length > 0) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, isOpen, filteredCommands.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        selected.action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-0 sm:px-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)} 
        aria-hidden="true" 
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="relative w-full max-w-full sm:max-w-[640px] bg-slate-900 border border-slate-800 sm:rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center border-b border-slate-800 px-4 min-h-[56px]">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search routes and actions... (Cmd+K)"
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 pt-[1px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-activedescendant={
              filteredCommands[selectedIndex] ? filteredCommands[selectedIndex].id : undefined
            }
          />
        </div>

        <ul
          id="command-palette-results"
          ref={listRef}
          role="listbox"
          className="max-h-[300px] sm:max-h-[400px] overflow-y-auto p-2"
        >
          {filteredCommands.length === 0 && (
            <li className="p-4 text-center text-slate-500 text-sm">
              No results found for "{query}"
            </li>
          )}
          {filteredCommands.map((command, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li
                key={command.id}
                id={command.id}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex items-center px-4 py-2 min-h-[44px] cursor-pointer rounded-md text-sm transition-colors",
                  isSelected
                    ? "bg-slate-800 text-sky-400"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
                onClick={() => command.action()}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <command.icon className="w-4 h-4 mr-3 shrink-0" />
                <span>{command.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
