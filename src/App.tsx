import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import RotatingText from "./components/react-bits/RotatingText";
import DiscordIcon from "./components/DiscordIcon";
import { chapter } from "./data/chapter";

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

function DiscordLink({ className = "" }: { className?: string }) {
  return (
    <a
      className={`discord-link ${className}`}
      href={chapter.discord}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Discord community (opens in a new tab)"
    >
      <DiscordIcon />
    </a>
  );
}

function App() {
  const reduced = useReducedMotion();
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    if (reduced || motionPaused) return;
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.05,
      anchors: { offset: -90 },
      smoothWheel: true,
    });
    return () => lenis.destroy();
  }, [reduced, motionPaused]);

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
          <nav className="nav-actions" aria-label="Main navigation">
            <DiscordLink className="nav-discord" />
            <a className="button button-green nav-apply" href={chapter.apply}>
              Apply <ArrowUpRight size={17} />
            </a>
          </nav>
        </div>
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
              <a
                className="button button-green button-large"
                href={chapter.apply}
              >
                Apply to ColorStack <ArrowUpRight size={19} />
              </a>
              <a className="text-link" href="#join">
                How to join <ArrowDown size={17} />
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
            <div className="eyebrow">COLORSTACK AT FARMINGDALE</div>
            <h2>
              A place to belong.
              <br />
              <span className="muted-heading">A future to build.</span>
            </h2>
            <p className="about-summary">
              We’re a student community supporting Black and Latinx students in
              computing at Farmingdale State College through connection,
              learning, and career growth.
            </p>
          </Reveal>
          <Reveal className="registration">
            <div id="join">
              <h3>Join in two steps.</h3>
              <ol className="registration-steps">
                <li>
                  <span className="step-number" aria-hidden="true">
                    1
                  </span>
                  <div>
                    <a className="step-link" href={chapter.apply}>
                      Fill out the application <ArrowUpRight size={17} />
                    </a>
                    <p>Apply to ColorStack to get started.</p>
                  </div>
                </li>
                <li>
                  <span className="step-number" aria-hidden="true">
                    2
                  </span>
                  <div>
                    <a
                      className="step-link discord-link"
                      href={chapter.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DiscordIcon /> Join our Discord{" "}
                      <ArrowUpRight size={17} />
                    </a>
                    <p>Follow the directions there to finish joining.</p>
                  </div>
                </li>
              </ol>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-main">
            <span className="footer-title">Let’s stay connected.</span>
            <div className="footer-contact">
              <a className="footer-email" href={`mailto:${chapter.email}`}>
                <Mail size={19} />
                {chapter.email}
              </a>
              <DiscordLink className="footer-discord" />
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {chapter.name}.
            </span>
            <button
              onClick={() => setMotionPaused(!motionPaused)}
              aria-pressed={motionPaused}
            >
              {motionPaused ? "Resume motion" : "Pause motion"}
            </button>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}

export default App;
