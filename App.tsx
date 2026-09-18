import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlatformScene from "./PlatformScene";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    id: "01",
    title: "Custom models",
    summary: "Purpose-built product logic, data structures, and intelligent systems shaped around your operation.",
    detail: "We turn business rules into scalable software foundations, from technical architecture to custom AI and data models.",
  },
  {
    id: "02",
    title: "Product design",
    summary: "Clear interfaces and durable design systems that make complex software feel natural.",
    detail: "Research, product strategy, UX, UI, and prototyping are handled as one connected product-design discipline.",
  },
  {
    id: "03",
    title: "Configuration",
    summary: "Flexible SaaS environments configured for your team, workflows, permissions, and growth.",
    detail: "We assemble the right feature set, access model, automation, and infrastructure for a reliable production environment.",
  },
  {
    id: "04",
    title: "Implementation",
    summary: "Production-ready integrations with the platforms your business already depends on.",
    detail: "APIs, migrations, testing, deployment, and ongoing optimisation connect the product to your existing technology stack.",
  },
];

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow arrow-down" : "arrow"} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCapability, setActiveCapability] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "error" | "success">("idle");

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".site-header", { y: -28, opacity: 0, duration: 0.75 })
        .from(".hero-word", { yPercent: 112, rotate: 2.5, duration: 1.15, stagger: 0.1 }, "-=0.4")
        .from(".hero-detail", { y: 24, opacity: 0, duration: 0.75, stagger: 0.1 }, "-=0.55")
        .from(".platform-scene", { opacity: 0, scale: 0.92, duration: 1.2 }, "-=1.0");

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      gsap.to(".marquee-track", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".statement-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCalendar = () => {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CaChi Cloud//Launch//EN",
      "BEGIN:VEVENT",
      "UID:cachi-cloud-launch-20260924@cachicloud.com",
      "DTSTAMP:20260101T000000Z",
      "DTSTART;VALUE=DATE:20260924",
      "DTEND;VALUE=DATE:20260925",
      "SUMMARY:CaChi Cloud official web platform launch",
      "DESCRIPTION:The official CaChi Cloud web platform launches today.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cachi-cloud-launch.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormStatus("error");
      return;
    }
    setFormStatus("success");
  };

  return (
    <div ref={rootRef} className="site-shell">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="CaChi Cloud home" onClick={() => setMenuOpen(false)}>
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>CaChi Cloud</span>
        </a>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <button type="button" onClick={() => scrollTo("#capabilities")}>Capabilities</button>
          <button type="button" onClick={() => scrollTo("#approach")}>Approach</button>
          <button type="button" onClick={() => scrollTo("#team")}>Team</button>
          <button type="button" onClick={() => scrollTo("#launch")}>Launch</button>
        </nav>

        <button className="header-action" type="button" onClick={() => scrollTo("#launch")}>
          Get launch notice <Arrow />
        </button>
        <button
          className={menuOpen ? "menu-toggle is-open" : "menu-toggle"}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <PlatformScene />
          <div className="hero-content">
            <p className="hero-kicker hero-detail"><span /> Official platform / Launch 2026</p>
            <h1 id="hero-title" aria-label="CaChi Cloud">
              <span className="word-clip"><span className="hero-word">CaChi</span></span>
              <span className="word-clip"><span className="hero-word hero-word-outline">Cloud</span></span>
            </h1>

            <div className="hero-bottom">
              <div className="hero-intro hero-detail">
                <p>The official CaChi Cloud web platform launches on</p>
                <time dateTime="2026-09-24">Thursday, 24 September 2026.</time>
              </div>
              <div className="hero-actions hero-detail">
                <button className="primary-button" type="button" onClick={() => scrollTo("#launch")}>
                  Notify me <Arrow />
                </button>
                <button className="text-button" type="button" onClick={addToCalendar}>
                  Add to calendar <Arrow down />
                </button>
              </div>
              <p className="hero-note hero-detail">SaaS, engineered end to end.<br />Built for businesses in motion.</p>
            </div>
          </div>
          <button className="scroll-cue" type="button" onClick={() => scrollTo("#capabilities")} aria-label="Scroll to capabilities">
            <span>Scroll to explore</span>
            <i />
          </button>
        </section>

        <section className="capabilities-section" id="capabilities">
          <div className="section-number">01 / Capabilities</div>
          <div className="row g-0 capability-layout">
            <div className="col-lg-5">
              <div className="capability-heading" data-reveal>
                <p className="eyebrow">A complete production partner</p>
                <h2>From first logic<br />to live product.</h2>
                <p>CaChi Cloud creates, configures, and implements SaaS products as one continuous system.</p>
              </div>
            </div>
            <div className="col-lg-7 capability-list" data-reveal>
              {capabilities.map((capability, index) => {
                const isActive = activeCapability === index;
                return (
                  <article className={isActive ? "capability-row is-active" : "capability-row"} key={capability.id}>
                    <button
                      type="button"
                      aria-expanded={isActive}
                      onClick={() => setActiveCapability(index)}
                    >
                      <span className="capability-id">{capability.id}</span>
                      <span className="capability-title">{capability.title}</span>
                      <span className="capability-summary">{capability.summary}</span>
                      <span className="capability-toggle" aria-hidden="true">{isActive ? "-" : "+"}</span>
                    </button>
                    <div className="capability-detail" aria-hidden={!isActive}>
                      <p>{capability.detail}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="statement-section" id="approach">
          <div className="section-number light">02 / How we build</div>
          <div className="statement-copy" data-reveal>
            <p className="eyebrow">No gaps between idea and implementation</p>
            <h2>Software should fit the business.<br /><span>Not the other way around.</span></h2>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span>Model</span><i />
              <span>Design</span><i />
              <span>Configure</span><i />
              <span>Integrate</span><i />
              <span>Model</span><i />
              <span>Design</span><i />
              <span>Configure</span><i />
              <span>Integrate</span><i />
            </div>
          </div>
          <div className="approach-notes row g-0">
            <p className="col-md-4" data-reveal>Strategy and architecture align first, so every feature has a reason to exist.</p>
            <p className="col-md-4" data-reveal>Design and engineering advance together, reducing handoffs and rework.</p>
            <p className="col-md-4" data-reveal>Implementation connects cleanly with the tools, data, and teams already in place.</p>
          </div>
         </section>

        <section className="cofounders-section" id="team">
          <div className="section-number">03 / Co-Founders</div>
          <div className="cofounders-intro" data-reveal>
            <p className="eyebrow">Meet the visionaries</p>
            <h2>Building the future<br />of SaaS together.</h2>
          </div>
          <div className="cofounders-grid">
            <article className="cofounder-card" data-reveal>
              <div className="cofounder-avatar">
                <span className="avatar-initials">CA</span>
                <div className="avatar-glow" />
              </div>
              <div className="cofounder-info">
                <h3>Chinedu Albert</h3>
                <p className="cofounder-title">Chief Executive Officer</p>
                <p className="cofounder-bio">Visionary leader driving the strategic direction and business growth of CaChi Cloud.</p>
              </div>
            </article>
            <article className="cofounder-card" data-reveal>
              <div className="cofounder-avatar">
                <span className="avatar-initials">CE</span>
                <div className="avatar-glow" />
              </div>
              <div className="cofounder-info">
                <h3>Caleb Etekpe</h3>
                <p className="cofounder-title">Chief Technology Officer</p>
                <p className="cofounder-bio">Technical mastermind behind the platform's architecture and innovative solutions.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="launch-section" id="launch">
          <div className="launch-date" data-reveal>
            <p>Thursday</p>
            <time dateTime="2026-09-24">24.09.26</time>
          </div>
          <div className="launch-content" data-reveal>
            <p className="eyebrow">Be there from day one</p>
            <h2>The cloud is<br />taking shape.</h2>
            <p>Leave your email and we will let you know when the official CaChi Cloud platform goes live.</p>

            {formStatus === "success" ? (
              <div className="form-success" role="status">
                <span>You're on the launch list.</span>
                <button type="button" onClick={addToCalendar}>Add the date <Arrow down /></button>
              </div>
            ) : (
              <form className="launch-form" onSubmit={submitEmail} noValidate>
                <label htmlFor="launch-email">Work email</label>
                <div className="input-line">
                  <input
                    id="launch-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (formStatus === "error") setFormStatus("idle");
                    }}
                    aria-invalid={formStatus === "error"}
                    aria-describedby={formStatus === "error" ? "email-error" : undefined}
                  />
                  <button type="submit" aria-label="Join launch list"><Arrow /></button>
                </div>
                {formStatus === "error" && <p className="form-error" id="email-error">Enter a valid email address.</p>}
              </form>
            )}
          </div>
        </section>
      </main>

      <footer>
        <a className="brand-mark footer-brand" href="#top">
          <span className="brand-symbol" aria-hidden="true"><i /><i /></span>
          <span>CaChi Cloud</span>
        </a>
        <p>Custom SaaS products. Designed, configured, implemented.</p>
        <p>&copy; 2026 CaChi Cloud</p>
      </footer>
    </div>
  );
}