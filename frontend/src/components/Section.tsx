"use client";

import type { ReactNode } from "react";

type SectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
  id?: string;
  fullHeight?: boolean;
  className?: string;
};

export function Section({ eyebrow, title, body, children, id, fullHeight = false, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto flex w-full max-w-7xl flex-col items-stretch px-5 ${fullHeight ? "h-[100svh] snap-start snap-always overflow-hidden py-4 md:px-8 md:py-6" : "py-14 md:px-8 md:py-20"} ${className}`}
    >
      <div className={`w-full ${fullHeight ? "shrink-0" : ""}`}>
        <div className={`mb-3 text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-muted ${fullHeight ? "md:mb-2" : ""}`}>
          {eyebrow}
        </div>
        <h2 className={`display-font max-w-3xl leading-[0.92] ${fullHeight ? "text-xl md:text-[2.6rem]" : "text-3xl md:text-5xl"}`}>{title}</h2>
        <p className={`mt-2 max-w-3xl text-muted ${fullHeight ? "text-xs leading-5 md:text-[0.9rem] md:leading-6" : "text-[0.98rem] leading-7 md:text-[1.02rem]"}`}>{body}</p>
      </div>
      {children ? <div className={`w-full ${fullHeight ? "mt-3 min-h-0 flex-1 overflow-hidden md:mt-4" : "mt-8 md:mt-10"}`}>{children}</div> : null}
    </section>
  );
}
