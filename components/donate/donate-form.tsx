"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

const frequencies = ["One-time", "Monthly"] as const;
const amounts = ["10", "25", "50", "100"] as const;

const choice = "cursor-pointer border font-medium";
const on = "border-accent bg-accent text-accent-ink";
const off = "border-ink bg-white text-ink";

/**
 * Prototype only: nothing is charged or sent. The payment provider, currency and amounts are still open
 * decisions (docs/02-open-questions.md, "Donations").
 */
export function DonateForm() {
  const [frequency, setFrequency] = useState(0);
  const [amount, setAmount] = useState(1);

  return (
    <Reveal
      as="form"
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-6 bg-panel px-5 py-7 md:max-w-[620px] md:flex-[1_1_480px] md:p-10"
    >
      <div className="flex flex-col gap-3">
        <Eyebrow>Make a donation</Eyebrow>
        <p className="text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-accent md:text-[2.125rem]">
          Choose how you&apos;d like to give.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[0.8125rem] font-medium">How often</div>
        <div className="flex gap-3">
          {frequencies.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={frequency === i}
              onClick={() => setFrequency(i)}
              className={cn(choice, "min-h-12 flex-1 text-[0.9375rem] md:min-h-[52px]", frequency === i ? on : off)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[0.8125rem] font-medium">Amount</div>
        <div className="flex flex-wrap gap-3">
          {amounts.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={amount === i}
              onClick={() => setAmount(i)}
              className={cn(
                choice,
                "min-h-[52px] basis-[calc(50%-6px)] text-[1.0625rem] md:flex-[1_1_90px] md:basis-auto",
                amount === i ? on : off,
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="other-amount" className="text-[0.8125rem] font-medium">
          Or enter another amount
        </label>
        <input
          id="other-amount"
          type="text"
          inputMode="numeric"
          placeholder="Other amount"
          className="min-h-[52px] border border-ink bg-white px-4 text-body text-ink"
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="min-h-14 w-full cursor-pointer bg-accent text-link uppercase text-accent-ink transition-[filter] duration-200 hover:brightness-90"
        >
          Continue: {amounts[amount]}, {frequencies[frequency].toLowerCase()}
        </button>
        <p className="text-[0.8125rem] leading-normal text-muted">
          [To confirm: currency, suggested amounts and the payment provider.]
        </p>
      </div>
    </Reveal>
  );
}
