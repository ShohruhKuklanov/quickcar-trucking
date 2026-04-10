"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Globe, Phone } from "lucide-react"

type MenuKey = "how" | "services" | "why" | "support" | null

type MegaItemData = {
    title: string
    desc: string
    href: string
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState<MenuKey>(null)
    const navRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pillRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40)
        }
        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        document.body.classList.toggle("mega-open", open !== null)
        return () => {
            document.body.classList.remove("mega-open")
        }
    }, [open])

    const megaBase =
        "absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[560px] " +
        "bg-white border border-foreground/10 " +
        "rounded-b-3xl rounded-t-none shadow-xl p-8 animate-fadeIn isolate z-[60]"

    const megaBaseWide =
        "absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[760px] " +
        "bg-white border border-foreground/10 " +
        "rounded-b-3xl rounded-t-none shadow-xl p-8 animate-fadeIn isolate z-[60]"

    const updatePillForIndex = (index: number) => {
        const navEl = navRef.current
        const btnEl = itemRefs.current[index]
        const pillEl = pillRef.current
        if (!navEl || !btnEl) return

        const navRect = navEl.getBoundingClientRect()
        const btnRect = btnEl.getBoundingClientRect()
        if (!pillEl) return

        pillEl.style.left = `${btnRect.left - navRect.left}px`
        pillEl.style.width = `${btnRect.width}px`
        pillEl.style.opacity = "1"
    }

    const cancelClose = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
    }

    const scheduleClose = () => {
        cancelClose()
        closeTimerRef.current = setTimeout(() => {
            if (pillRef.current) pillRef.current.style.opacity = "0"
            setOpen(null)
        }, 180)
    }

    return (
        <header
            className={`navbar fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                open !== null
                    ? "bg-white shadow-sm"
                    : scrolled
                      ? "backdrop-blur-xl bg-white/80 shadow-sm"
                      : "bg-white"
            }`}
        >
            <div className="container max-w-350 mx-auto px-8 h-12 relative flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="logo flex items-center">
                    <span className="logoWrap" aria-hidden="true">
                        <Image
                            src="/Quickcar_Web_Logo_Tight.png"
                            alt="Quickcar Trucking"
                            width={220}
                            height={40}
                            priority
                            unoptimized
                            className="logo"
                        />
                    </span>
                </Link>

                {/* CENTER NAV - PERFECT CENTER */}
                <div
                    ref={navRef}
                    className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-4 text-sm font-medium tracking-wide"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    {/* Animated pill background */}
                    <div
                        ref={pillRef}
                        className="absolute top-1/2 -translate-y-1/2 h-10 rounded-xl bg-primary/10 transition-all duration-300 ease-out opacity-0"
                    />

                    {/* HOW */}
                    <div
                        className="relative"
                        onMouseEnter={() => {
                            cancelClose()
                            updatePillForIndex(0)
                            setOpen("how")
                        }}
                    >
                        <button
                            ref={(el) => {
                                itemRefs.current[0] = el
                            }}
                            className="relative z-10 px-5 py-2 text-[#111827] hover:text-primary transition-colors"
                        >
                            How it works
                        </button>

                        {open === "how" && (
                            <div
                                className={megaBase}
                                onMouseEnter={cancelClose}
                                onMouseLeave={scheduleClose}
                            >
                                <MegaMenuList
                                    items={[
                                        {
                                            title: "How to ship a car",
                                            desc: "Guide to auto transport",
                                            href: "/how-to-ship-a-car",
                                        },
                                        {
                                            title: "Car shipping costs",
                                            desc: "Calculate your estimate",
                                            href: "/car-shipping-costs",
                                        },
                                        {
                                            title: "TruePrice Guarantee",
                                            desc: "30-day price lock",
                                            href: "/trueprice-guarantee",
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>

                    {/* SERVICES */}
                    <div
                        className="relative"
                        onMouseEnter={() => {
                            cancelClose()
                            updatePillForIndex(1)
                            setOpen("services")
                        }}
                    >
                        <button
                            ref={(el) => {
                                itemRefs.current[1] = el
                            }}
                            className="relative z-10 px-5 py-2 text-[#111827] hover:text-primary transition-colors"
                        >
                            Services
                        </button>

                        {open === "services" && (
                            <div
                                className={megaBaseWide}
                                onMouseEnter={cancelClose}
                                onMouseLeave={scheduleClose}
                            >
                                <p className="text-[#111827]/60 text-sm mb-8">We offer</p>
                                <MegaMenuList
                                    layout="grid2"
                                    items={[
                                        {
                                            title: "Door-to-door transport",
                                            desc: "Straight from/to your home or office",
                                            href: "/learn/door-to-door-transport",
                                        },
                                        {
                                            title: "Cross country car shipping",
                                            desc: "Coast-to-coast vehicle transport",
                                            href: "/cross-country-car-shipping",
                                        },
                                        {
                                            title: "Open car transport",
                                            desc: "Quick and affordable option",
                                            href: "/learn/open-car-transport",
                                        },
                                        {
                                            title: "Enclosed auto transport",
                                            desc: "Safe and clean option",
                                            href: "/learn/enclosed-auto-transport",
                                        },
                                        {
                                            title: "Expedited auto transport",
                                            desc: "Guaranteed pick-up date",
                                            href: "/learn/expedited-auto-transport",
                                        },
                                        {
                                            title: "Popular routes",
                                            desc: "Common shipping lanes",
                                            href: "/routes",
                                        },
                                        {
                                            title: "Dealer auto transport",
                                            desc: "Dealership and auction logistics",
                                            href: "/dealer-auto-transport",
                                        },
                                        {
                                            title: "Military car shipping",
                                            desc: "PCS and relocation support",
                                            href: "/military-pcs-car-shipping",
                                        },
                                        {
                                            title: "Snowbird car shipping",
                                            desc: "Seasonal relocation lanes",
                                            href: "/snowbird-car-shipping",
                                        },
                                        {
                                            title: "Auto transport by state",
                                            desc: "Browse state and city pages",
                                            href: "/auto-transport",
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>

                    {/* WHY */}
                    <div
                        className="relative"
                        onMouseEnter={() => {
                            cancelClose()
                            updatePillForIndex(2)
                            setOpen("why")
                        }}
                    >
                        <button
                            ref={(el) => {
                                itemRefs.current[2] = el
                            }}
                            className="relative z-10 px-5 py-2 text-[#111827] hover:text-primary transition-colors"
                        >
                            Why Quickcar
                        </button>

                        {open === "why" && (
                            <div
                                className={megaBase}
                                onMouseEnter={cancelClose}
                                onMouseLeave={scheduleClose}
                            >
                                <p className="text-[#111827]/60 text-sm mb-8">Our brand</p>
                                <MegaMenuList
                                    items={[
                                        {
                                            title: "Who we are",
                                            desc: "Our story & experience",
                                            href: "/about-us",
                                        },
                                        {
                                            title: "Vision and mission",
                                            desc: "What we believe in",
                                            href: "/learn/vision-and-mission",
                                        },
                                        {
                                            title: "Our reputation",
                                            desc: "Industry knowledge and expertise",
                                            href: "/learn/our-reputation",
                                        },
                                        {
                                            title: "Blog",
                                            desc: "Shipping tips and guides",
                                            href: "/blog",
                                        },
                                        {
                                            title: "Reviews",
                                            desc: "Feedback from our clients",
                                            href: "/learn/reviews",
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>

                    {/* SUPPORT */}
                    <div
                        className="relative"
                        onMouseEnter={() => {
                            cancelClose()
                            updatePillForIndex(3)
                            setOpen("support")
                        }}
                    >
                        <button
                            ref={(el) => {
                                itemRefs.current[3] = el
                            }}
                            className="relative z-10 px-5 py-2 text-[#111827] hover:text-primary transition-colors"
                        >
                            Support
                        </button>

                        {open === "support" && (
                            <div
                                className={megaBase}
                                onMouseEnter={cancelClose}
                                onMouseLeave={scheduleClose}
                            >
                                <MegaMenuList
                                    items={[
                                        {
                                            title: "Contact us",
                                            desc: "Support and information",
                                            href: "/learn/contact-us",
                                        },
                                        {
                                            title: "Resources",
                                            desc: "Guides and solutions",
                                            href: "/learn/resources",
                                        },
                                        {
                                            title: "Help center",
                                            desc: "Questions and answers",
                                            href: "/learn/help-center",
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT ICONS */}
                <div className="flex items-center gap-3">
                    <button
                        className="hidden sm:inline-flex text-[#111827] transition hover:scale-110 hover:text-primary"
                        type="button"
                        aria-label="Change region"
                        title="Change region"
                    >
                        <Globe size={20} />
                    </button>
                    <Link
                        href="tel:+16467311022"
                        className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary hover:shadow-md sm:px-3.5"
                        aria-label="Call Quickcar Trucking"
                    >
                        <Phone size={16} />
                        <span className="hidden lg:inline">(646) 731-1022</span>
                        <span className="lg:hidden">Call Now</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export { Navbar }
export default Navbar

function MegaMenuList({
    items,
    layout = "list",
}: {
    items: MegaItemData[]
    layout?: "list" | "grid2"
}) {
    const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
    const highlightRef = useRef<HTMLDivElement | null>(null)

    const updateBgForIndex = (index: number) => {
        const el = itemRefs.current[index]
        if (!el) return
        if (!highlightRef.current) return

        highlightRef.current.style.top = `${el.offsetTop}px`
        highlightRef.current.style.height = `${el.offsetHeight}px`
        highlightRef.current.style.opacity = "1"
    }

    if (layout === "grid2") {
        return (
            <div className="columns-2 gap-6">
                {items.map((item, index) => (
                    <MegaItem
                        key={item.href}
                        title={item.title}
                        desc={item.desc}
                        href={item.href}
                        className="mb-4 inline-block w-full break-inside-avoid hover:bg-primary/10"
                        innerRef={(el) => {
                            itemRefs.current[index] = el
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <div
            className="relative"
            onMouseLeave={() => {
                if (highlightRef.current) highlightRef.current.style.opacity = "0"
            }}
        >
            <div
                ref={highlightRef}
                className="absolute left-0 right-0 rounded-xl bg-primary/10 transition-all duration-300 ease-out pointer-events-none opacity-0"
            />
            <div className="space-y-4">
                {items.map((item, index) => (
                    <MegaItem
                        key={item.href}
                        title={item.title}
                        desc={item.desc}
                        href={item.href}
                        innerRef={(el) => {
                            itemRefs.current[index] = el
                        }}
                        onMouseEnter={() => {
                            updateBgForIndex(index)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

function MegaItem({
    title,
    desc,
    href,
    className,
    innerRef,
    onMouseEnter,
}: {
    title: string
    desc: string
    href: string
    className?: string
    innerRef?: (el: HTMLAnchorElement | null) => void
    onMouseEnter?: () => void
}) {
    return (
        <Link
            href={href}
            ref={innerRef}
            onMouseEnter={onMouseEnter}
            className={`relative z-10 block group rounded-xl p-2 transition-colors ${className ?? ""}`}
        >
            <h3 className="text-sm font-medium tracking-wide text-[#111827] transition-colors group-hover:text-primary">
                {title}
            </h3>
            <p className="mt-1 text-sm text-[#111827]/70 transition-colors group-hover:text-primary">
                {desc}
            </p>
        </Link>
    )
}

