/**
 * Xpixel Solar Panel Conditioner - Main Application
 * React + TypeScript + Zustand + Tailwind CSS
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import {
  Sun,
  Moon,
  Droplets,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ArrowRight,
  Beaker,
  FlaskConical,
  Wind,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  ShoppingCart,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartDrawer, CartBadge } from '@/components/cart/CartDrawer';
import { useCartStore, MOCK_PRODUCT, MOCK_VARIANTS } from '@/store/useCartStore';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// PRODUCT VARIANT SELECTOR
// ============================================================================

function ProductVariantSelector() {
  const [selectedVariant, setSelectedVariant] = useState(MOCK_VARIANTS[0]);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  const handleAddToCart = () => {
    addItem(MOCK_PRODUCT, selectedVariant, 1);
    setCartOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MOCK_VARIANTS.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedVariant(variant)}
            className={`px-4 py-2 rounded-xl border-2 transition-all ${
              selectedVariant.id === variant.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="font-medium">{variant.label}</span>
            <span className="ml-2 text-sm text-muted-foreground">{variant.priceDisplay}</span>
          </button>
        ))}
      </div>
      <Button onClick={handleAddToCart} className="w-full" size="lg">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Add to Cart - {selectedVariant.priceDisplay}
      </Button>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [isDark, setIsDark] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Hero entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.3 });

      heroTl
        .fromTo('.hero-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' })
        .fromTo('.hero-label', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.6')
        .fromTo(
          '.hero-title span',
          { y: 50, opacity: 0, rotateX: 25 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo('.hero-cta', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3')
        .fromTo('.solar-ray', { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 1, stagger: 0.1, ease: 'power2.out' }, '-=0.8');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Scroll animations for sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section 2 - No-Scrub Promise
      gsap.fromTo(
        '.s2-card',
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section2Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s2-image',
        { x: 100, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section2Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );

      // Section 3 - Clinging Gel
      gsap.fromTo(
        '.s3-image',
        { x: -100, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section3Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s3-card',
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section3Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );

      // Section 4 - Anti-Static Shield
      gsap.fromTo(
        '.s4-card',
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section4Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s4-image',
        { x: 100, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section4Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );

      // Section 5 - Technical Excellence
      gsap.fromTo(
        '.s5-heading',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: section5Ref.current, start: 'top 80%', end: 'top 50%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s5-card',
        { y: 80, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: { trigger: '.s5-cards', start: 'top 85%', end: 'top 50%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s5-ingredients',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: '.s5-ingredients', start: 'top 90%', end: 'top 60%', scrub: 1 },
        }
      );

      // Section 6 - 1 Cap Economy
      gsap.fromTo(
        '.s6-image',
        { x: -80, opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section6Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s6-card',
        { x: 80, opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section6Ref.current, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      );

      // Section 7 - CTA
      gsap.fromTo(
        '.s7-cta-card',
        { x: -60, y: 40, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section7Ref.current, start: 'top 80%', end: 'top 30%', scrub: 1 },
        }
      );
      gsap.fromTo(
        '.s7-contact-card',
        { x: 60, y: 40, opacity: 0 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section7Ref.current, start: 'top 80%', end: 'top 30%', scrub: 1 },
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-background transition-colors duration-300">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />

      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-border/50">
        <a href="/" className="text-xl font-heading font-bold text-foreground">
          Xpixel
        </a>
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollToSection(section2Ref)}
            className="hidden md:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection(section5Ref)}
            className="hidden md:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Specs
          </button>
          <a href="/b2b" className="hidden md:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            B2B
          </a>
          <CartBadge />
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Section 1: Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="hero-bg absolute inset-0">
          <img src="/images/Header2.jpg" alt="Solar farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-navy/40 via-midnight-navy/50 to-midnight-navy/70" />
        </div>

        {/* Solar Rays SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.35 }}>
          <defs>
            <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B6BFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B6BFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              className="solar-ray"
              x1="52%"
              y1="42%"
              x2={`${78 + i * 4}%`}
              y2={`${18 + i * 4}%`}
              stroke="url(#rayGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
            />
          ))}
        </svg>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <span className="hero-label font-mono text-xs tracking-[0.2em] uppercase text-white/70 mb-6">
            Professional Solar Care
          </span>
          <h1 className="hero-title font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-[0.95] tracking-tight mb-6">
            <span className="inline-block">Restore</span>{' '}
            <span className="inline-block text-primary">30%</span>{' '}
            <span className="inline-block">Efficiency</span>{' '}
            <span className="inline-block">Instantly.</span>
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
            The industrial-grade conditioner that cleans and protects your solar investment—without scrubbing.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <Button onClick={() => scrollToSection(section7Ref)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Order Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href="/b2b">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-2xl">
                <Building2 className="mr-2 w-5 h-5" />
                B2B Inquiry
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: No-Scrub Promise */}
      <section ref={section2Ref} className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/solar-panels-sky-02.jpg" alt="Solar panels" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-navy/60 via-midnight-navy/40 to-transparent" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Card */}
            <div className="s2-card bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">Core Feature</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground mb-6 leading-tight">
                No-Scrub Formula
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Spray, wait 5 minutes, rinse. Xpixel lifts dust, exhaust film, and water spots without brushing—protecting
                anti-reflective coatings.
              </p>
              <ProductVariantSelector />
            </div>

            {/* Product Image */}
            <div className="s2-image flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img src="/images/product-2.jpg" alt="Xpixel Solar Panel Conditioner" className="relative w-full max-w-md rounded-3xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Clinging Gel Technology */}
      <section ref={section3Ref} className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/solar-panels-sky-03.jpg" alt="Solar installation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-midnight-navy/60 via-midnight-navy/40 to-transparent" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Product Image */}
            <div className="s3-image flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img src="/images/product-Gallon.jpg" alt="Xpixel Solar Panel Conditioner" className="relative w-full max-w-md rounded-3xl shadow-2xl" />
              </div>
            </div>

            {/* Text Card */}
            <div className="s3-card bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-card border border-border order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-primary" />
                </div>
                <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  Advanced Technology
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground mb-6 leading-tight">
                Clinging Gel Technology
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Engineered for 30° inclines. The gel holds position longer than liquids—so the chemistry works before you
                rinse.
              </p>
              <button className="group flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                View performance data
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Anti-Static Shield */}
      <section ref={section4Ref} className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/solar-farm-horizon.jpg" alt="Solar farm horizon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-navy/60 via-midnight-navy/40 to-transparent" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Card */}
            <div className="s4-card bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  Long-term Protection
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground mb-6 leading-tight">
                Anti-Static Shield
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Silicone emulsion leaves a dust-repellent layer. After rinsing, surfaces stay smoother—so efficiency stays
                higher, longer.
              </p>
              <button className="group flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                Compare vs detergents
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Product Image */}
            <div className="s4-image flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img src="/images/300ml 5L.jpg" alt="Xpixel Solar Panel Conditioner" className="relative w-full max-w-md rounded-3xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Technical Excellence */}
      <section ref={section5Ref} className="relative py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="s5-heading text-center mb-16">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 block">Specifications</span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Technical Excellence</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed for professionals. Safe for coatings. Compatible with real-world water.
            </p>
          </div>

          {/* Spec Cards */}
          <div className="s5-cards grid md:grid-cols-3 gap-6 mb-12">
            {/* pH Neutral */}
            <div className="s5-card bg-card rounded-3xl p-8 shadow-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <FlaskConical className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-card-foreground mb-3">pH Neutral</h3>
              <p className="text-muted-foreground leading-relaxed">
                7.0 formula won't etch glass or degrade anti-reflective layers.
              </p>
            </div>

            {/* Hard Water Killer */}
            <div className="s5-card bg-card rounded-3xl p-8 shadow-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Droplets className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-card-foreground mb-3">Hard Water Killer</h3>
              <p className="text-muted-foreground leading-relaxed">Sodium gluconate binds minerals to prevent white spots.</p>
            </div>

            {/* Coating Safe */}
            <div className="s5-card bg-card rounded-3xl p-8 shadow-card border border-border hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-card-foreground mb-3">Coating Safe</h3>
              <p className="text-muted-foreground leading-relaxed">Tested on AR coatings; no haze, no micro-scratching.</p>
            </div>
          </div>

          {/* Ingredients Strip */}
          <div className="s5-ingredients bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
            <h3 className="font-heading text-2xl font-bold text-card-foreground mb-6">What's Inside</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {['Surfactant', 'Silicone Emulsion', 'Sodium Gluconate', 'Deionized Water'].map((item) => (
                <span key={item} className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">No abrasives. No strong acids or alkalis.</p>
          </div>
        </div>
      </section>

      {/* Section 6: 1 Cap Economy */}
      <section ref={section6Ref} className="relative py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Product Image */}
            <div className="s6-image">
              <div className="relative bg-card rounded-3xl p-8 shadow-card border border-border">
                <img src="/images/product-2.jpg" alt="Xpixel Bottle" className="w-full max-w-sm mx-auto rounded-2xl" />
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full font-heading font-bold text-lg">
                  300ml
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="s6-card bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border">
              <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4 block">
                Value Proposition
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground mb-8 leading-tight">
                1 Cap. 5 Panels. 30 Washes.
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">1 cap (5ml) → 5 panels</p>
                    <p className="text-muted-foreground text-sm">Precise dosing for optimal coverage</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wind className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">300ml bottle → 30 washes</p>
                    <p className="text-muted-foreground text-sm">Long-lasting professional supply</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">10-panel system → ~3 months supply</p>
                    <p className="text-muted-foreground text-sm">Economical maintenance schedule</p>
                  </div>
                </div>
              </div>

              <ProductVariantSelector />
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA + Contact */}
      <section ref={section7Ref} className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/images/solar-sunset-bg.jpg" alt="Solar sunset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/80 via-midnight-navy/60 to-midnight-navy/40" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-24">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* CTA Card */}
              <div className="s7-cta-card bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-card border border-border">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-card-foreground mb-4">
                  Ready to restore full output?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Order today. Ships within 48 hours. Bulk pricing available for installers.
                </p>
                <div className="space-y-4">
                  <ProductVariantSelector />
                  <a href="/b2b">
                    <Button variant="outline" className="w-full mt-4">
                      <Building2 className="mr-2 w-5 h-5" />
                      Request B2B Quote
                    </Button>
                  </a>
                </div>
              </div>

              {/* Contact Card */}
              <div className="s7-contact-card bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-card border border-border">
                <h3 className="font-heading text-xl font-bold text-card-foreground mb-6">
                  Questions? Speak with product support.
                </h3>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/923447201118"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">WhatsApp</p>
                      <p className="text-muted-foreground text-sm">+92 344 720 1118</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Email</p>
                      <p className="text-muted-foreground text-sm">support@xpixel.eco</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Support Hours</p>
                      <p className="text-muted-foreground text-sm">Mon–Fri 09:00–18:00 UTC+5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-card border border-border mb-16">
              <h3 className="font-heading text-2xl font-bold text-card-foreground mb-8 text-center">
                Xpixel vs Ordinary Detergents
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-heading font-semibold text-card-foreground">Feature</th>
                      <th className="text-center py-4 px-4 font-heading font-semibold text-primary">Xpixel</th>
                      <th className="text-center py-4 px-4 font-heading font-semibold text-muted-foreground">
                        Ordinary Detergents
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Anti-Reflective Coating Safe', xpixel: true, ordinary: false },
                      { feature: 'pH Neutral Formula', xpixel: true, ordinary: false },
                      { feature: 'Hard Water Compatible', xpixel: true, ordinary: false },
                      { feature: 'Anti-Static Protection', xpixel: true, ordinary: false },
                      { feature: 'No Residue Formula', xpixel: true, ordinary: false },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-4 px-4 text-card-foreground">{row.feature}</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4">
                          <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-midnight-navy text-white py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">© 2026 Xpixel. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms
              </a>
              <a href="/admin" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-3 h-3" />
                Admin
              </a>
            </div>
          </div>
        </footer>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923447201118"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Contact on WhatsApp"
      >
        <Phone className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

export default App;
