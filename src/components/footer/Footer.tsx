import Link from "next/link";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-background/10 bg-foreground text-background dark:border-foreground/10 dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-325 px-4 py-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/" className="inline-flex items-center">
                  <span className="logoWrap logoWrap--footer" aria-hidden="true">
                    <Image
                      src="/Quickcar_Web_Logo_Tight.png"
                      alt=""
                      width={200}
                      height={36}
                      className="logo logoWhite"
                      style={{ height: 36, width: "auto" }}
                      unoptimized
                    />
                  </span>
                  <span className="sr-only">QuickCar</span>
                </Link>
              </div>
              <p className="mt-1 text-xs font-medium tracking-wide text-background/55 dark:text-foreground/55">
                Operating under FMCSA regulations for interstate vehicle transport.
              </p>
              <div className="mt-2 space-y-1 text-sm text-background/70 dark:text-foreground/70">
                <div className="flex items-center gap-2">
                  <Image
                    src="/hero/FMCSA.png"
                    alt="FMCSA"
                    width={86}
                    height={22}
                    className="h-5.5 w-auto opacity-90"
                  />
                </div>
                <p className="flex items-center gap-2 text-background/60 dark:text-foreground/60">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4 flex-none text-primary/80"
                    fill="none"
                  >
                    <path
                      d="M4.25 10.5l3.15 3.15L15.75 5.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    USDOT:{" "}
                    <span className="cursor-default border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-primary/60 hover:text-background dark:hover:text-foreground">
                      4350129
                    </span>
                  </span>
                </p>
                <p className="flex items-center gap-2 text-background/60 dark:text-foreground/60">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4 flex-none text-primary/80"
                    fill="none"
                  >
                    <path
                      d="M4.25 10.5l3.15 3.15L15.75 5.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>MC: 01700790</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4 flex-none text-primary/80"
                    fill="none"
                  >
                    <path
                      d="M4.25 10.5l3.15 3.15L15.75 5.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Licensed &amp; Bonded</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4 flex-none text-primary/80"
                    fill="none"
                  >
                    <path
                      d="M4.25 10.5l3.15 3.15L15.75 5.3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Nationwide 50-State Coverage</span>
                </p>
              </div>

              <a
                href="https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=4350129"
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 pt-3 text-sm font-medium text-background/70 transition-colors duration-200 hover:text-background dark:text-foreground/70 dark:hover:text-foreground"
              >
                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-primary/80 after:transition-all after:duration-300 group-hover:after:w-full">
                  Verify Registration
                </span>
                <span className="text-primary/80 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>

          <div className="space-y-4 lg:justify-self-center">
            <p className="text-sm font-semibold tracking-wide text-background/85 dark:text-foreground/85">Company</p>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2 text-sm">
              {[
                { label: "About Us", href: "/about-us" },
                { label: "How It Works", href: "/#how" },
                { label: "Services", href: "/#services" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Blog", href: "/blog" },
                { label: "Routes", href: "/routes" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative block w-fit text-background/65 transition-colors duration-200 hover:text-background dark:text-foreground/65 dark:hover:text-foreground"
                >
                  <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-current after:opacity-60 after:transition-all after:duration-300 group-hover:after:w-full">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 lg:justify-self-end">
            <p className="text-sm font-semibold tracking-wide text-background/85 dark:text-foreground/85">Contact</p>

            <div className="space-y-2 text-sm">
              <a
                href="tel:+16467311022"
                className="flex items-center gap-2 text-background/75 transition-colors duration-200 hover:text-background dark:text-foreground/75 dark:hover:text-foreground"
              >
                <Phone className="h-4 w-4 flex-none text-primary/80" aria-hidden="true" />
                <span>Main Line: (646) 731-1022</span>
              </a>

              <a
                href="mailto:support@quickcartrucking.com"
                className="flex items-center gap-2 text-background/65 transition-colors duration-200 hover:text-background dark:text-foreground/65 dark:hover:text-foreground"
              >
                <Mail className="h-4 w-4 flex-none text-primary/80" aria-hidden="true" />
                <span>support@quickcartrucking.com</span>
              </a>
            </div>

            <div className="space-y-1 text-sm text-background/55 dark:text-foreground/55">
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-none text-primary/80" aria-hidden="true" />
                <div>
                  <p>Mon–Sat: 8:00 AM–6:00 PM</p>
                  <p>Sun: 10:00 AM–3:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-primary/80" aria-hidden="true" />
                <div>
                  <p>14 Harwood Ct, Suite 415 #1034</p>
                  <p>Scarsdale, NY 10583</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-background/10 pt-2 dark:border-foreground/10">
          <div className="flex flex-col gap-2 text-sm text-background/55 sm:flex-row sm:items-center sm:justify-between dark:text-foreground/55">
            <p>
              © {year} Quickcar Trucking LLC <span className="text-background/35 dark:text-foreground/35">•</span> All rights
              reserved.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/privacy"
                className="group relative inline-flex transition-colors duration-200 hover:text-background dark:hover:text-foreground"
              >
                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-current after:opacity-60 after:transition-all after:duration-300 group-hover:after:w-full">
                  Privacy Policy
                </span>
              </Link>
              <span className="text-background/35 dark:text-foreground/35">•</span>
              <Link
                href="/terms"
                className="group relative inline-flex transition-colors duration-200 hover:text-background dark:hover:text-foreground"
              >
                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-current after:opacity-60 after:transition-all after:duration-300 group-hover:after:w-full">
                  Terms of Service
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
