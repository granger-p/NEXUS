"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUp,
  Bot,
  Code2,
  Command,
  FileCode2,
  FolderGit2,
  Heart,
  MessageSquare,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Globe,
} from "lucide-react";

const initialChats = [
  "Building a REST API",
  "Debugging authentication",
  "Understanding React hooks",
  "Database architecture",
];

const suggestions = [
  {
    icon: FolderGit2,
    title: "Understand my codebase",
    description: "Explore architecture, files and dependencies.",
    prompt: "Help me understand my codebase architecture.",
  },
  {
    icon: Code2,
    title: "Build something new",
    description: "Turn an idea into clean, working code.",
    prompt: "Help me build a new feature.",
  },
  {
    icon: Zap,
    title: "Debug an issue",
    description: "Track down bugs and find solutions.",
    prompt: "Help me debug an issue in my code.",
  },
  {
    icon: Sparkles,
    title: "Improve my code",
    description: "Refactor, optimize and improve quality.",
    prompt: "Help me improve my existing code.",
  },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Workspace");
  const [chats, setChats] = useState(initialChats);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="flex h-screen overflow-hidden bg-[#090711] text-white">
      {/* SIDEBAR */}
      <aside
        className={`relative z-20 flex shrink-0 flex-col border-r border-white/[0.06] bg-[#0D0B16] transition-all duration-300 ${
          sidebarOpen ? "w-[270px]" : "w-[76px]"
        }`}
      >
        {/* BRAND */}
        <div className="flex h-[78px] items-center justify-between border-b border-white/[0.05] px-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-[0_0_25px_rgba(139,92,246,0.25)]">
              <Command size={22} strokeWidth={2.2} />
              <div className="absolute inset-0 rounded-xl border border-white/20" />
            </div>

            {sidebarOpen && (
              <div>
                <h1 className="text-[19px] font-bold tracking-[0.16em]">
                  NEXUS
                </h1>
                <p className="text-[9px] tracking-[0.28em] text-violet-400">
                  AI ENGINEERING
                </p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mx-auto mt-4 rounded-lg p-2 text-gray-500 hover:bg-white/[0.06] hover:text-white"
          >
            <PanelLeftOpen size={19} />
          </button>
        )}

        {/* NEW CHAT */}
        <div className="px-4 pt-6">
          <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-3 py-3 text-sm font-medium shadow-[0_5px_25px_rgba(124,58,237,0.18)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
            <Plus size={18} />
            {sidebarOpen && <span>New conversation</span>}
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="mt-9 px-3">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-gray-600">
              WORKSPACE
            </p>
          )}

          {[
            { name: "Workspace", icon: Bot },
            { name: "Projects", icon: FolderGit2 },
            { name: "Code Explorer", icon: FileCode2 },
            { name: "Terminal", icon: Terminal },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                title={!sidebarOpen ? item.name : undefined}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-all ${
                  activeNav === item.name
                    ? "border border-violet-500/10 bg-violet-500/[0.12] text-violet-300"
                    : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
              >
                <Icon size={18} />
                {sidebarOpen && item.name}
                {activeNav === item.name && sidebarOpen && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#A78BFA]" />
                )}
              </button>
            );
          })}
        </div>

        {/* CHAT HISTORY */}
        <div className="mt-10 flex-1 overflow-y-auto px-3">
          {sidebarOpen && (
            <div className="mb-4 flex items-center justify-between px-3">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-600">
                RECENT CHATS
              </p>
              <Search size={14} className="text-gray-600" />
            </div>
          )}

          {chats.map((chat, index) => (
            <div
              key={index}
              className="group mb-1 flex items-center rounded-xl transition hover:bg-white/[0.04]"
            >
              <button className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left">
                <MessageSquare
                  size={16}
                  className="shrink-0 text-gray-600"
                />

                {sidebarOpen && (
                  <span className="truncate text-[12px] text-gray-400 group-hover:text-white">
                    {chat}
                  </span>
                )}
              </button>

              {sidebarOpen && (
                <button
                  title="Remove sample chat"
                  onClick={() =>
                    setChats(chats.filter((_, i) => i !== index))
                  }
                  className="mr-2 hidden rounded-md p-1.5 text-gray-600 hover:bg-red-500/10 hover:text-red-400 group-hover:block"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* SYSTEM STATUS */}
        {sidebarOpen && (
          <div className="mx-4 mb-5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-400">
                All systems operational
              </span>
            </div>
            <p className="mt-2 text-[10px] text-gray-600">
              Your workspace is ready.
            </p>
          </div>
        )}

        {/* PROFILE */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500/30 to-purple-800/30 text-sm font-semibold text-violet-200">
              P
            </div>

            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium">Developer</p>
                  <p className="text-[10px] text-gray-600">
                    Personal workspace
                  </p>
                </div>
                <Settings2 size={17} className="text-gray-500" />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* AMBIENT BACKGROUND */}
        <div className="pointer-events-none absolute -top-[350px] left-1/2 h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-purple-700/[0.13] blur-[160px]" />

        <div className="pointer-events-none absolute -bottom-[400px] right-[-200px] h-[600px] w-[600px] rounded-full bg-indigo-700/[0.07] blur-[150px]" />

        {/* TOPBAR */}
        <header className="relative z-10 flex h-[78px] shrink-0 items-center justify-between border-b border-white/[0.06] px-6 md:px-10">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-gray-300">
              {activeNav}
              <ChevronDown size={14} className="text-gray-600" />
            </div>
            <p className="mt-1 text-[10px] text-gray-600">
              Your intelligent engineering environment
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.05] px-3 py-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
              <span className="text-[10px] text-emerald-400">
                Systems online
              </span>
            </div>

            <button className="rounded-xl border border-white/[0.07] p-2.5 text-gray-500 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300">
              <Settings2 size={17} />
            </button>
          </div>
        </header>

        {/* WELCOME AREA */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
          <div className="my-auto flex w-full flex-col items-center py-10">
            {/* LOGO */}
            <div className="animate-float relative mb-8 flex h-[82px] w-[82px] items-center justify-center rounded-[27px] border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-purple-800/20 to-indigo-900/20 shadow-[0_0_70px_rgba(139,92,246,0.15)]">
              <Command
                size={37}
                strokeWidth={1.6}
                className="text-violet-300"
              />
              <div className="absolute inset-0 rounded-[27px] border border-white/[0.04]" />
            </div>

            {/* BADGE */}
            <div className="mb-6 flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-4 py-2">
              <Sparkles size={13} className="text-violet-400" />
              <span className="text-[9px] font-semibold tracking-[0.2em] text-violet-300">
                YOUR AI ENGINEERING PARTNER
              </span>
            </div>

            {/* HEADING */}
            <h2 className="text-center text-[38px] font-semibold leading-tight tracking-[-0.04em] sm:text-[54px]">
              Think deeper.
              <span className="mt-2 block bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Build smarter.
              </span>
            </h2>

            <p className="mt-6 max-w-[490px] text-center text-[13px] leading-7 text-gray-500 sm:text-[14px]">
              From understanding complex codebases to solving challenging
              engineering problems, NEXUS is built to think alongside you.
            </p>

            {/* SUGGESTIONS */}
            <div className="mt-12 grid w-full max-w-[680px] grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    onClick={() => setInput(item.prompt)}
                    className="group rounded-2xl border border-white/[0.07] bg-[#13101E]/75 p-5 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:shadow-[0_15px_45px_rgba(124,58,237,0.08)]"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.08] text-violet-300 transition group-hover:border-violet-400/30 group-hover:bg-violet-500/20">
                      <Icon size={19} />
                    </div>

                    <h3 className="text-[13px] font-medium text-gray-200 transition group-hover:text-violet-200">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[11px] leading-5 text-gray-500">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* COMPOSER */}
            <div className="mt-10 w-full max-w-[680px]">
              <div className="rounded-2xl border border-violet-400/20 bg-[#151120]/95 p-3 shadow-[0_0_60px_rgba(139,92,246,0.07)] backdrop-blur-xl transition-all duration-300 focus-within:border-violet-400/40 focus-within:shadow-[0_0_50px_rgba(139,92,246,0.12)]">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask NEXUS anything about your codebase..."
                  rows={2}
                  className="w-full resize-none bg-transparent px-3 py-3 text-[13px] leading-6 text-white outline-none placeholder:text-gray-600"
                />

                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-2 text-gray-500 transition hover:bg-white/[0.05] hover:text-violet-300">
                      <Paperclip size={17} />
                    </button>

                    <button className="rounded-lg p-2 text-gray-500 transition hover:bg-white/[0.05] hover:text-violet-300">
                      <Globe size={17} />
                    </button>

                    <span className="ml-2 hidden text-[10px] text-gray-600 sm:block">
                      NEXUS AI · Engineering mode
                    </span>
                  </div>

                  <button
                    disabled={!input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-purple-900/30 transition hover:scale-105 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp size={19} />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] text-gray-600">
                NEXUS can make mistakes. Always review generated code.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="relative z-10 flex h-12 shrink-0 items-center justify-center border-t border-white/[0.04]">
          <p className="text-[9px] tracking-[0.2em] text-gray-600">
            NEXUS AI · BUILT FOR ENGINEERS
          </p>
        </footer>

        {/* SIGNATURE */}
        <div className="absolute bottom-3 right-5 z-20 flex items-center gap-1.5 text-[10px] text-gray-600">
          Made with{" "}
          <Heart size={11} className="fill-purple-400 text-purple-400" />
          by <span className="font-medium text-violet-300">Priti</span>
        </div>
      </section>
    </main>
  );
}