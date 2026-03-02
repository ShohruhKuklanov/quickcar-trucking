"use client";

import { useId, useMemo } from "react";
import { ClipboardList, ShieldCheck, Truck } from "lucide-react";

type Step = {
  title: string;
  description: string;
  Icon: typeof ClipboardList;
};

export function HowItWorks() {
  const id = useId();
  const steps = useMemo<Step[]>(
    () => [
      {
        title: "Request your quote",
        description:
          "Tell us your pickup and delivery locations, your vehicle details, and your preferred timing. In minutes, you’ll get a clear estimate and next-step options — with no guesswork and no pressure.",
        Icon: ClipboardList,
      },
      {
        title: "We lock in a vetted carrier",
        description:
          "We coordinate your route with trusted, vetted carrier partners and confirm a pickup window that fits your schedule. You’ll know what to expect, when to expect it, and you’ll have a real person to guide you from booking to pickup.",
        Icon: ShieldCheck,
      },
      {
        title: "Door-to-door delivery",
        description:
          "Your vehicle is picked up and delivered as close to your door as possible, with consistent updates along the way. We help coordinate timing, keep communication simple, and make sure the process stays smooth from pickup to final drop-off.",
        Icon: Truck,
      },
    ],
    [],
  );

  return (
    <section id="how" className="hiw py-10 md:py-12 bg-white">
      <div className="hiw-shell mx-auto max-w-[1200px] px-6">
        <header className="hiw-header">
          <div className="max-w-2xl">
            <h2 className="hiw-title">How it works</h2>
            <p className="hiw-subtitle">A simple, proven process — built for speed and clarity.</p>
          </div>
        </header>

        <div className="hiw-indicator">
          <ol className="hiw-steps" aria-label="3-step process">
            {steps.map((step, index) => {
              const iconId = `${id}-hiw-step-icon-${index}`;
              return (
                <li key={step.title} className="hiw-step">
                  <div className={"hiw-stepPill hiw-stepPill--" + (index + 1)}>
                    <span className={"hiw-stepIcon hiw-stepIcon--" + (index + 1)} aria-hidden="true" id={iconId}>
                      <step.Icon className="hiw-stepSvg" aria-hidden="true" />
                    </span>
                    <span className="hiw-stepText">
                      <span className="hiw-stepKicker">Step {index + 1}</span>
                      <span className="hiw-stepLabel">{step.title}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Transport concept: slow animated gradient flow across the progress track */}
          <div className="hiw-track" aria-hidden="true">
            <div className="hiw-trackFlow" />
          </div>
        </div>

        <div className="hiw-cards" aria-label="Step details">
          {steps.map((step, index) => {
            const thirdClass = index === 2 ? " hiw-card--third" : "";
            return (
              <article
                key={step.title}
                className={"hiw-card" + thirdClass}
              >
                <div className="hiw-cardTop">
                  <div className="hiw-cardIcon" aria-hidden="true">
                    <step.Icon className="hiw-cardSvg" aria-hidden="true" />
                  </div>

                  <div className="hiw-cardHeading">
                    <p className="hiw-cardKicker">Step {index + 1}</p>
                    <h3 className="hiw-cardTitle">{step.title}</h3>
                  </div>
                </div>

                <p className="hiw-cardBody">{step.description}</p>
                <p className="hiw-cardFooter">Fast quotes. Reliable carriers. Door-to-door delivery.</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
