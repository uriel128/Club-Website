import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Lenis from "lenis";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Code2,
  Compass,
  Copy,
  Heart,
  Mail,
  MapPin,
  Menu,
  Minus,
  Plus,
  Sparkles,
  Terminal,
  Users,
  X,
} from "lucide-react";
import RotatingText from "./components/react-bits/RotatingText";
import DiscordIcon from "./components/DiscordIcon";
import { chapter, faqs, officers, programs, resources } from "./data/chapter";

type Modal = "join" | "privacy" | "build" | "career" | "community" | null;
const navItems = [
  ["About", "#about"],
  ["Events", "#events"],
  ["Resources", "#resources"],
  ["Our team", "#team"],
];
const resourceIcons = {
  code: Code2,
  book: BookOpen,
  terminal: Terminal,
  briefcase: BriefcaseBusiness,
  people: Users,
  compass: Compass,
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DiscordLink({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      className={`discord-link ${className}`}
      href={chapter.discord}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        children ? undefined : "Join our Discord community (opens in a new tab)"
      }
    >
      <DiscordIcon />
      {children}
    </a>
  );
}

function App() {
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [category, setCategory] = useState("All resources");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const activeProgram = programs.find((program) => program.id === modal);

  useEffect(() => {
    if (reduced || motionPaused) return;
    const instance = new Lenis({
      autoRaf: true,
      duration: 1.05,
      anchors: { offset: -90 },
      smoothWheel: true,
    });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, [reduced, motionPaused]);

  useEffect(() => {
    const element = dialog.current;
    if (modal && element && !element.open) {
      restoreFocus.current = document.activeElement as HTMLElement;
      element.showModal();
      lenis.current?.stop();
      document.body.style.overflow = "hidden";
    } else if (!modal) {
      element?.close();
      lenis.current?.start();
      document.body.style.overflow = "";
      restoreFocus.current?.focus({ preventScroll: true });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, []);

  function makeDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setDraft({
      subject: `${form.get("topic")} — ${form.get("name")}`,
      body: `Hi ColorStack FSC,\n\n${form.get("message")}\n\n${form.get("name")}\nReply to: ${form.get("email")}`,
    });
    setCopied(false);
    setCopyError(false);
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(
        `To: ${chapter.email}\nSubject: ${draft.subject}\n\n${draft.body}`,
      );
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <MotionConfig reducedMotion={motionPaused ? "always" : "user"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-bar">
          <a
            className="brand"
            href="#home"
            aria-label="ColorStack at Farmingdale home"
          >
            <img
              src="/images/colorstack-logo.png"
              width="46"
              height="46"
              alt=""
            />
            <span>
              ColorStack
              <span className="brand-campus">FARMINGDALE STATE COLLEGE</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <DiscordLink className="nav-discord" />
            <button
              className="button button-green nav-join"
              onClick={() => setModal("join")}
            >
              Join the chapter <ArrowUpRight size={17} />
            </button>
            <button
              className="menu-toggle icon-button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                  <ArrowUpRight size={20} />
                </a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setModal("join");
                }}
              >
                Join the chapter <ArrowUpRight size={20} />
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section id="home" className="hero container">
          <div className="hero-copy">
            <motion.div className="eyebrow hero-eyebrow" initial={false}>
              <span className="status-dot" /> A COMMUNITY FOR YOUR NEXT CHAPTER
            </motion.div>
            <h1>
              Find your
              <br />
              people. Build
              <br />
              <span className="future-line">
                your{" "}
                <RotatingText
                  texts={["future.", "skills.", "story."]}
                  mainClassName="rotating-word"
                  rotationInterval={3400}
                  staggerDuration={0.025}
                  auto={!reduced && !motionPaused}
                />
              </span>
            </h1>
            <p className="hero-description">
              Big ambitions are better together. A home for Black and Latinx
              students in computing at Farmingdale State College—and everyone
              ready to grow with us.
            </p>
            <div className="hero-buttons">
              <button
                className="button button-green button-large"
                onClick={() => setModal("join")}
              >
                Find your community <ArrowUpRight size={19} />
              </button>
              <a className="text-link" href="#events">
                See what’s next <ArrowDown size={17} />
              </a>
            </div>
            <div className="hero-note">
              <span className="tiny-stack" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>Rooted in community. Built for possibility.</span>
            </div>
          </div>
          <Reveal className="hero-art" delay={0.12}>
            <div className="art-topline">
              <span>COLORSTACK / FSC</span>
              <span className="art-plus">+</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <motion.div
              className="stack-sculpture"
              aria-hidden="true"
              animate={
                !reduced && !motionPaused
                  ? { y: [0, -12, 0], rotate: [-13, -10, -13] }
                  : { y: 0, rotate: -13 }
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="sculpture-layer layer-one" />
              <div className="sculpture-layer layer-two" />
              <div className="sculpture-layer layer-three" />
            </motion.div>
            <span className="sparkle sparkle-one" aria-hidden="true">
              ✳
            </span>
            <span className="sparkle sparkle-two" aria-hidden="true">
              +
            </span>
            <div className="art-label label-build">
              <span className="label-dot" /> built for belonging
            </div>
            <div className="code-sticker">
              <span className="code-sticker-top">
                <i />
                <i />
                <i />
                <span>the next chapter</span>
              </span>
              <code>
                <span>const</span> future = {"{"}
                <br />
                &nbsp; you: <em>"unlimited"</em>,<br />
                &nbsp; us: <em>"in your corner"</em>
                <br />
                {"}"};
              </code>
            </div>
            <div className="art-bottom">
              <span>
                Different backgrounds.
                <br />
                <strong>One shared future.</strong>
              </span>
              <div className="fsc-seal">
                FSC<span>LONG ISLAND, NY</span>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="values-strip" aria-label="Our values">
          <div className="container values-inner">
            <span>COME AS YOU ARE.</span>
            <span className="asterisk" aria-hidden="true">
              ✳
            </span>
            <span>BUILD WHAT’S NEXT.</span>
            <span className="asterisk" aria-hidden="true">
              ✳
            </span>
            <span>BRING SOMEONE WITH YOU.</span>
            <span className="asterisk last-asterisk" aria-hidden="true">
              ✳
            </span>
          </div>
        </div>

        <section id="about" className="section container about-section">
          <Reveal className="about-heading">
            <div className="eyebrow">
              <span className="section-number">01 /</span> THE WHY BEHIND THE
              STACK
            </div>
            <h2>
              Talent is everywhere.
              <br />
              <span className="muted-heading">Opportunity should be, too.</span>
            </h2>
          </Reveal>
          <Reveal className="about-description">
            <p className="lead">
              You shouldn’t have to figure it all out on your own.
            </p>
            <p>
              We’re ColorStack at Farmingdale State College: a student community
              working to increase the number of Black and Latinx computing
              graduates who launch rewarding technical careers.
            </p>
            <p>
              Through academic support, technical growth, mentorship, and real
              connection, we’re making room for more of us in tech. Wherever
              you’re starting, there’s a place for you here.
            </p>
            <a
              className="text-link"
              href="https://www.colorstack.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet the national movement <ArrowUpRight size={17} />
            </a>
          </Reveal>
          <Reveal className="chapter-facts">
            <div>
              <span className="fact-icon">
                <Users size={22} />
              </span>
              <strong>Student-led.</strong>
              <p>Built by Rams, for Rams.</p>
            </div>
            <div>
              <span className="fact-icon">
                <Heart size={22} />
              </span>
              <strong>No chapter dues.</strong>
              <p>Your curiosity is your starting point.</p>
            </div>
            <div>
              <span className="fact-icon">
                <Compass size={22} />
              </span>
              <strong>Room for you.</strong>
              <p>Every background. Every starting point.</p>
            </div>
          </Reveal>
        </section>

        <section className="programs-section section">
          <div className="container">
            <Reveal className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="section-number">02 /</span> FIND YOUR
                  MOMENTUM
                </div>
                <h2>
                  More than a club.
                  <br />A head start.
                </h2>
              </div>
              <p>
                Good people. Shared knowledge.
                <br />A little push toward what’s possible.
              </p>
            </Reveal>
            <div className="program-grid">
              {programs.map((program, index) => (
                <Reveal
                  key={program.id}
                  delay={index * 0.08}
                  className={`program-card program-${program.id}`}
                >
                  <div className="program-top">
                    <span>
                      {program.number} / {program.category}
                    </span>
                    {index === 0 ? (
                      <Code2 />
                    ) : index === 1 ? (
                      <ArrowUpRight />
                    ) : (
                      <Users />
                    )}
                  </div>
                  <div
                    className={`program-visual visual-${program.id}`}
                    aria-hidden="true"
                  >
                    {index === 0 ? (
                      <>
                        <span>{"{"}</span>
                        <i />
                        <span>{"}"}</span>
                      </>
                    ) : index === 1 ? (
                      <>
                        <i />
                        <i />
                        <i />
                        <ArrowUpRight />
                      </>
                    ) : (
                      <>
                        <i />
                        <i />
                        <i />
                        <i />
                      </>
                    )}
                  </div>
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <div className="program-tags">
                    {program.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <button
                    className="card-link"
                    onClick={() => setModal(program.id as Modal)}
                  >
                    Explore {program.category.toLowerCase()}{" "}
                    <ArrowUpRight size={21} />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="section container events-section">
          <Reveal className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="section-number">03 /</span> BETTER WHEN YOU’RE
                HERE
              </div>
              <h2>
                Your next connection
                <br />
                starts here.
              </h2>
            </div>
            <DiscordLink className="text-link">
              Get updates on Discord <ArrowUpRight size={17} />
            </DiscordLink>
          </Reveal>
          <Reveal className="event-feature">
            <div className="event-art" aria-hidden="true">
              <div className="event-grid" />
              <span className="event-star">✳</span>
              <span className="event-art-text">
                GOOD
                <br />
                THINGS
                <br />
                <em>AHEAD.</em>
              </span>
              <span className="event-art-footer">
                LET’S MAKE THEM HAPPEN, TOGETHER.
              </span>
            </div>
            <div className="event-copy">
              <span className="pill">
                <span className="status-dot" /> OUR NEXT CHAPTER IS TAKING SHAPE
              </span>
              <h3>
                A fresh calendar.
                <br />A whole lot of possibility.
              </h3>
              <p>
                We’re putting our next gatherings together. Think shared ideas,
                new skills, and people you’ll be glad you met.
              </p>
              <div className="event-meta">
                <span>
                  <CalendarDays size={18} /> Dates to be announced
                </span>
                <span>
                  <MapPin size={18} /> Farmingdale State College
                </span>
              </div>
              <DiscordLink className="button button-green">
                Be first to hear <ArrowUpRight size={18} />
              </DiscordLink>
              <p className="small-note">
                Confirmed dates and locations will appear here and in Discord.
              </p>
            </div>
          </Reveal>
          <div className="event-preview-label">
            ON OUR RADAR <span>Programming we’re planning</span>
          </div>
          <div className="event-preview-grid">
            <button onClick={() => setModal("build")}>
              <span className="event-mini-icon">
                <Terminal />
              </span>
              <span>
                <strong>Build & learn sessions</strong>
                <span>Bring your laptop. Leave with a new skill.</span>
              </span>
              <ArrowUpRight />
            </button>
            <button onClick={() => setModal("career")}>
              <span className="event-mini-icon">
                <BriefcaseBusiness />
              </span>
              <span>
                <strong>Career conversations</strong>
                <span>Find a little clarity for your next move.</span>
              </span>
              <ArrowUpRight />
            </button>
          </div>
        </section>

        <section id="resources" className="section resources-section">
          <div className="container">
            <Reveal className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="section-number">04 /</span> KEEP THIS IN YOUR
                  CORNER
                </div>
                <h2>
                  A few good tools.
                  <br />A lot of open doors.
                </h2>
              </div>
              <p>
                Start learning. Get unstuck.
                <br />
                Take the next step at your own pace.
              </p>
            </Reveal>
            <div
              className="resource-filters"
              role="group"
              aria-label="Filter resources"
            >
              {["All resources", "Build", "Career", "Community"].map(
                (filter) => (
                  <button
                    key={filter}
                    aria-pressed={category === filter}
                    className={category === filter ? "active" : ""}
                    onClick={() => setCategory(filter)}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              {
                resources.filter(
                  (resource) =>
                    category === "All resources" ||
                    resource.category === category,
                ).length
              }{" "}
              resources shown
            </p>
            <div className="resource-grid">
              {resources
                .filter(
                  (resource) =>
                    category === "All resources" ||
                    resource.category === category,
                )
                .map((resource) => {
                  const Icon =
                    resourceIcons[resource.icon as keyof typeof resourceIcons];
                  return (
                    <a
                      className="resource-card"
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="resource-top">
                        <Icon size={25} />
                        <ArrowUpRight size={20} />
                      </div>
                      <span className="eyebrow">{resource.type}</span>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <span className="resource-domain">
                        {new URL(resource.url).hostname.replace("www.", "")}{" "}
                        <span className="sr-only">(opens in a new tab)</span>
                      </span>
                    </a>
                  );
                })}
            </div>
          </div>
        </section>

        <section id="team" className="section container team-section">
          <Reveal className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="section-number">05 /</span> STUDENTS MAKING IT
                HAPPEN
              </div>
              <h2>
                Your people,
                <br />
                behind the scenes.
              </h2>
            </div>
            <p>
              Meet the founding board.
              <br />
              Same campus. Shared commitment.
            </p>
          </Reveal>
          <div className="team-grid">
            {officers.map((officer, index) => (
              <Reveal
                className="team-card"
                key={officer.name}
                delay={index * 0.07}
              >
                <div
                  className={`team-portrait portrait-${officer.color}`}
                  aria-hidden="true"
                >
                  <div className="portrait-lines" />
                  <span className="portrait-number">0{index + 1}</span>
                  <span className="portrait-initials">{officer.initials}</span>
                  <span className="portrait-star">✳</span>
                </div>
                <span className="team-role">{officer.role}</span>
                <h3>{officer.name}</h3>
                <p>{officer.detail}</p>
              </Reveal>
            ))}
          </div>
          <div className="advisor-row">
            <span>
              <span className="advisor-icon">
                <BookOpen size={18} />
              </span>
              <strong>Frank Victor</strong>
              <span>Faculty advisor</span>
            </span>
            <a
              className="text-link"
              href={`mailto:${chapter.email}?subject=Getting%20involved%20with%20ColorStack%20FSC`}
            >
              Want to help shape the chapter? <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section className="join-section">
          <div className="container join-inner">
            <Reveal>
              <div className="eyebrow">
                YOUR NEXT CHAPTER STARTS WITH A HELLO.
              </div>
              <h2>
                You bring you.
                <br />
                <span>We’ll bring the community.</span>
              </h2>
              <p>
                No perfect résumé. No need to have it all figured out.
                <br />
                Just a little curiosity and a willingness to show up.
              </p>
              <div className="join-actions">
                <button
                  className="button button-gold button-large"
                  onClick={() => setModal("join")}
                >
                  Let’s build something together <ArrowUpRight size={19} />
                </button>
                <DiscordLink className="join-discord" />
              </div>
            </Reveal>
            <div className="join-decoration" aria-hidden="true">
              <span>✳</span>
              <div className="join-circle" />
              <div className="join-circle second" />
            </div>
          </div>
        </section>

        <section className="section container faq-section" id="faq">
          <Reveal>
            <div className="eyebrow">
              <span className="section-number">06 /</span> A LITTLE MORE CLARITY
            </div>
            <h2>
              Good questions.
              <br />
              Real answers.
            </h2>
            <p>
              Still curious about something?
              <br />
              <a className="inline-link" href={`mailto:${chapter.email}`}>
                We’re an email away.
              </a>
            </p>
          </Reveal>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                className={`faq-item ${faqOpen === index ? "is-open" : ""}`}
                key={faq.question}
              >
                <h3>
                  <button
                    id={`faq-question-${index}`}
                    aria-expanded={faqOpen === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  >
                    {faq.question}
                    <span>
                      {faqOpen === index ? (
                        <Minus size={19} />
                      ) : (
                        <Plus size={19} />
                      )}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  hidden={faqOpen !== index}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section section" id="contact">
          <div className="container contact-grid">
            <Reveal>
              <div className="eyebrow">
                <span className="section-number">07 /</span> KEEP THE
                CONVERSATION GOING
              </div>
              <h2>
                Say hello.
                <br />
                Start something.
              </h2>
              <p>
                Questions about joining? An idea for a workshop?
                <br />
                Interested in supporting our students? We’re listening.
              </p>
              <a className="contact-email" href={`mailto:${chapter.email}`}>
                {chapter.email}
                <ArrowUpRight size={24} />
              </a>
              <div className="contact-links">
                <DiscordLink className="contact-discord" />
                <span>
                  Find us in Discord.
                  <br />
                  <strong>The conversation starts here.</strong>
                </span>
              </div>
              <span className="contact-location">
                <MapPin size={16} /> Farmingdale State College · Long Island, NY
              </span>
            </Reveal>
            <form className="contact-form" onSubmit={makeDraft}>
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="First and last name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label>
                What’s on your mind?
                <select name="topic" defaultValue="Membership">
                  <option>Membership</option>
                  <option>Events & workshops</option>
                  <option>Partnerships & sponsorship</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                Your message
                <textarea
                  name="message"
                  required
                  rows={4}
                  maxLength={3000}
                  placeholder="Tell us a little about it…"
                />
              </label>
              <button className="button button-green" type="submit">
                Prepare your email <ArrowUpRight size={18} />
              </button>
              <p className="form-note">
                We’ll prepare a draft for your email app. Nothing is sent or
                stored by this website.
              </p>
              {draft && (
                <div className="draft-result" role="status">
                  <strong>
                    <Check size={17} /> Your email draft is ready.
                  </strong>
                  <p>
                    Open your email app to review and send it, or copy the
                    message.
                  </p>
                  <div>
                    <a
                      className="text-link"
                      href={`mailto:${chapter.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}
                    >
                      Open email app <Mail size={16} />
                    </a>
                    <button
                      className="text-link"
                      type="button"
                      onClick={copyDraft}
                    >
                      {copied ? "Copied!" : "Copy message"}{" "}
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copyError && (
                    <>
                      <p>
                        Your browser couldn’t copy automatically. Select and
                        copy your draft below.
                      </p>
                      <textarea
                        aria-label="Email draft to copy"
                        readOnly
                        value={`To: ${chapter.email}\nSubject: ${draft.subject}\n\n${draft.body}`}
                      />
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <a className="brand footer-brand" href="#home">
              <img
                src="/images/colorstack-logo.png"
                width="50"
                height="50"
                alt=""
              />
              <span>
                ColorStack
                <span className="brand-campus">FARMINGDALE STATE COLLEGE</span>
              </span>
            </a>
            <p>
              Different backgrounds.
              <br />
              One shared future.
            </p>
            <div className="footer-links">
              <a href="#about">Our mission</a>
              <a href="#events">Events</a>
              <a href="#resources">Resources</a>
              <a href="#contact">Get in touch</a>
            </div>
            <div className="footer-socials">
              <DiscordLink />
              <a
                className="icon-button"
                href={`mailto:${chapter.email}`}
                aria-label="Email ColorStack FSC"
              >
                <Mail />
              </a>
            </div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            Better, together<span>↗</span>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} ColorStack at Farmingdale State
              College.
            </span>
            <div>
              <button
                onClick={() => setMotionPaused(!motionPaused)}
                aria-pressed={motionPaused}
              >
                {motionPaused ? "Resume motion" : "Pause motion"}
              </button>
              <button onClick={() => setModal("privacy")}>Privacy</button>
              <a
                href="https://www.colorstack.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ColorStack National <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className="site-dialog"
        aria-labelledby="dialog-title"
        onCancel={() => setModal(null)}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const bounds = dialog.current.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              setModal(null);
          }
        }}
      >
        <button
          className="dialog-close icon-button"
          aria-label="Close dialog"
          onClick={() => setModal(null)}
        >
          <X />
        </button>
        {modal === "join" ? (
          <>
            <span className="dialog-symbol">
              <Sparkles size={30} />
            </span>
            <div className="eyebrow">THERE’S A PLACE FOR YOU HERE</div>
            <h2 id="dialog-title">Let’s make it official.</h2>
            <p>
              Start with a hello. Here’s how to become part of our Farmingdale
              chapter.
            </p>
            <ol className="join-steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Find your people.</h3>
                  <p>
                    Join Discord to meet the community and hear about upcoming
                    gatherings.
                  </p>
                  <DiscordLink className="text-link">
                    Join our Discord <ArrowUpRight size={17} />
                  </DiscordLink>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Get on the chapter roster.</h3>
                  <p>Email the team to request the official roster form.</p>
                  <a
                    className="text-link"
                    href={`mailto:${chapter.email}?subject=Chapter%20membership%20%E2%80%94%20roster%20form%20request&body=Hi%20ColorStack%20FSC%2C%0A%0AI%E2%80%99d%20like%20to%20join%20the%20chapter.%20Could%20you%20please%20send%20me%20the%20official%20roster%20form%3F%0A%0AThank%20you!`}
                  >
                    Request the roster form <ArrowUpRight size={17} />
                  </a>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Show up. You belong here.</h3>
                  <p>
                    Attend at least one general body meeting this semester to
                    become an active member.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => {
                      setModal(null);
                      requestAnimationFrame(() =>
                        document
                          .getElementById("events")
                          ?.scrollIntoView({
                            behavior:
                              reduced || motionPaused ? "instant" : "smooth",
                          }),
                      );
                    }}
                  >
                    Explore what’s next <ArrowRight size={17} />
                  </button>
                </div>
              </li>
            </ol>
            <p className="dialog-footnote">
              Open to eligible FSC undergraduates who support our mission. No
              mandatory chapter dues.{" "}
              <a href="#faq" onClick={() => setModal(null)}>
                See membership details.
              </a>
            </p>
          </>
        ) : modal === "privacy" ? (
          <>
            <div className="eyebrow">YOUR PRIVACY</div>
            <h2 id="dialog-title">Simple by design.</h2>
            <p>
              This website does not create accounts, use analytics cookies, or
              store contact form submissions. Contact form details stay in your
              browser while you prepare your email.
            </p>
            <p>
              Choosing “Open email app” passes your draft to your email
              application. The chapter receives it only after you send it. The
              copy button places your draft on your device’s clipboard.
            </p>
            <p>
              Vercel hosts this site and may process technical request data to
              serve and secure it. Discord and other linked websites have their
              own privacy policies.
            </p>
            <a className="text-link" href={`mailto:${chapter.email}`}>
              Privacy questions? Email us <ArrowUpRight size={17} />
            </a>
          </>
        ) : activeProgram ? (
          <>
            <span className="dialog-symbol">
              <Code2 size={30} />
            </span>
            <div className="eyebrow">{activeProgram.category}</div>
            <h2 id="dialog-title">{activeProgram.title}</h2>
            <p>{activeProgram.detail}</p>
            <div className="dialog-tags">
              {activeProgram.tags.map((tag) => (
                <span className="pill" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="program-dialog-note">
              <CalendarDays size={22} />
              <span>
                Specific sessions, dates, and locations will be shared once
                confirmed.
              </span>
            </div>
            <DiscordLink className="button button-green">
              Connect on Discord <ArrowUpRight size={17} />
            </DiscordLink>
          </>
        ) : null}
      </dialog>
    </MotionConfig>
  );
}

export default App;
