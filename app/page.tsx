"use client";
import { useState } from "react";
import Tool from "@/components/Tool";
import Reveal from "@/components/Reveal";
import HeroBg from "@/components/HeroBg";
import StackFlow from "@/components/StackFlow";
import { LOGOS } from "@/components/Logos";
import { dict } from "@/lib/i18n";

export default function Home() {
  const [lang, setLang] = useState<"en" | "fa">("en");
  const L = dict[lang];
  const fa = lang === "fa";
  return (
    <main dir={fa ? "rtl" : "ltr"} lang={lang}
      style={fa ? { fontFamily: "var(--font-vazir), var(--font-outfit), sans-serif" } : undefined}>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
        <span className="flex items-center gap-3 text-2xl"><img src="/logo.svg" alt="" width={36} height={36} />Feature Selector</span>
        <div className="flex gap-3">
          <button onClick={() => setLang(fa ? "en" : "fa")} className="rounded-full border border-coral px-5 py-2 text-coral">{L.toggle}</button>
          <a href="#tool" className="rounded-full bg-coral px-5 py-2 text-bg">{L.cta}</a>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <HeroBg />
        <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-72 text-center md:pt-32">
          <p className="rise text-xl text-mute">{L.tag}</p>
          <h1 dir="ltr" className="rise mt-6 text-4xl leading-tight font-medium sm:text-5xl md:text-8xl" style={{ animationDelay: "150ms" }}>Mean / Std Feature Selector</h1>
          <p className="rise mx-auto mt-8 max-w-2xl text-lg text-mute md:text-2xl" style={{ animationDelay: "300ms" }}>{L.intro}</p>
          <a href="#tool" className="rise mt-10 inline-block rounded-full bg-coral px-8 py-3.5 text-xl text-bg transition hover:scale-105" style={{ animationDelay: "450ms" }}>{L.start}</a>
        </section>
      </div>

      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-3xl md:text-4xl">{L.built}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {L.stack.map(([n, d], i) => (
              <Reveal key={n} delay={i * 120}>
                <div className="h-full rounded-2xl border border-line bg-card/70 p-5 transition hover:-translate-y-1 hover:border-coral/60">
                  <div className="mb-4 text-ink">{LOGOS[n]}</div>
                  <h3 dir="ltr" className="text-xl">{n}</h3>
                  <p className="mt-2 text-mute">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <StackFlow />
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-3xl md:text-4xl">{L.how}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {L.steps.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 150}>
                <div className="h-full rounded-2xl border border-line bg-card/70 p-6">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-bg">{n}</span>
                  <h3 className="mt-4 text-2xl">{t}</h3>
                  <p className="mt-2 text-mute">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xl text-mute">{L.formula}</p>
        </section>
      </Reveal>

      <section id="tool" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-3xl md:text-4xl">{L.run}</h2>
        <Tool L={L} />
      </section>

      <Reveal>
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-card p-8 shadow-[0_12px_0_-2px_#121211,0_30px_60px_-12px_rgba(0,0,0,0.7)] transition-transform duration-500 [transform:perspective(1200px)_rotateX(4deg)] hover:[transform:perspective(1200px)_rotateX(0deg)]">
            <div aria-hidden className="pixels absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="relative">
              <h2 className="mb-8 text-3xl md:text-4xl">{L.faq}</h2>
              {L.qa.map(([q, a]) => (
                <details key={q} className="border-t border-line py-5 last:border-b">
                  <summary className="cursor-pointer text-xl">{q}</summary>
                  <p className="mt-3 text-mute">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <footer className="mt-16 border-t border-line">
        <div dir="ltr" aria-hidden className="relative h-20 overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
          <svg viewBox="0 0 24 24" fill="currentColor" className="absolute left-0 h-9 w-9 text-coral"
            style={{ top: "calc(50% - 18px)", animation: "fly 14s linear infinite" }}>
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-12">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card/80 text-mute md:flex-row">
            <p className="flex-1 p-6">{L.footer1}</p>
            <div className="border-t border-dashed border-line md:border-s md:border-t-0" />
            <p className="flex-1 p-6 text-ink">{L.footer2}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
