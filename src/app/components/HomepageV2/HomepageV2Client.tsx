"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { PortfolioItem } from "../../../types/portfolio.types";
import styles from "./HomepageV2.module.scss";
import HeroSection from "./sections/HeroSection";
import ManifestoSection from "./sections/ManifestoSection";
import SelectedWorkSection from "./sections/SelectedWorkSection";
import CapabilitiesSection from "./sections/CapabilitiesSection";
import CTABand from "./sections/CTABand";

interface HomepageV2ClientProps {
  portfolioItems: PortfolioItem[];
}

export default function HomepageV2Client({ portfolioItems }: HomepageV2ClientProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let ticking = false;

    const update = () => {
      const progress = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.4)));
      const radius = Math.round(progress * 48);
      const scale = 1 - progress * 0.02;

      hero.style.borderRadius = `0 0 ${radius}px ${radius}px`;
      hero.style.transform = `scale(${scale})`;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const revealed = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || revealed.has(entry.target)) return;
          revealed.add(entry.target);
          if (
            entry.target.classList.contains("reveal") ||
            entry.target.classList.contains("reveal-line")
          ) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.1,
      }
    );

    document.querySelectorAll(".reveal, .reveal-line").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleScrollToWork = () => {
    const workSection = document.getElementById("selected-work");
    if (workSection) {
      window.scrollTo({ top: workSection.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <main className={styles.homepage}>
      <HeroSection ref={heroRef} onScrollClick={handleScrollToWork} />

      <ManifestoSection />

      <SelectedWorkSection portfolioItems={portfolioItems} />

      <CapabilitiesSection />

      <CTABand />

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLinks}>
            <a href="mailto:hello@intelligentproject.com">hello@intelligentproject.com</a>
            <Link href="/about-us">Про нас</Link>
            <Link href="/projects">Проєкти</Link>
          </div>
          <div className={styles.footerCopyright}>
            © {new Date().getFullYear()} Intelligent Project
          </div>
        </div>
      </footer>
    </main>
  );
}
