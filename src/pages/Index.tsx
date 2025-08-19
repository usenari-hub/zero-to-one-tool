import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTopCourses } from "@/hooks/useTopCourses";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import heroIvy from "@/assets/hero-bacon-ivy.jpg";
import { SharedLayout } from "@/components/SharedLayout";
import { AcademicTimeline } from "@/components/AcademicTimeline";
import { Footer } from "@/components/Footer";
import { Clapperboard, Heart } from "lucide-react";

const MotionButton = motion(Button);

const Index = () => {
  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const defaultSidebarOpen = typeof window !== "undefined" ? (localStorage.getItem("sidebar:open") ?? "true") === "true" : true;
  const sections = [
    { id: "admissions", label: "Admissions" },
    { id: "study-guides", label: "Study Guides" },
    { id: "departments", label: "Departments" },
    { id: "transcripts", label: "Transcripts" },
    { id: "alumni", label: "Alumni" },
  ];

  // GPA simulation
  const [gpa, setGpa] = useState(0.0);

  // Academic progression
  const degreeProgression = useMemo(
    () => [
      "👨‍🎓 Freshman",
      "📚 Sophomore",
      "🎯 Junior",
      "🏆 Senior",
      "👨‍💼 Graduate Student",
      "👨‍🏫 Professor",
      "👑 Dean!",
    ],
    []
  );
  const [degreeStep, setDegreeStep] = useState(0);
  

  // Stats counters
  const statsRef = useRef<HTMLDivElement | null>(null);
  const countersRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const [countersStarted, setCountersStarted] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Navbar scrolled effect
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GPA simulation interval
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.6) {
        setGpa((prev) => Math.min(4.0, prev + Math.random() * 0.3));
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Degree progression animation
  useEffect(() => {
    const step = () => {
      setDegreeStep((s) => {
        const next = Math.min(s + 1, degreeProgression.length - 1);
        if (next === degreeProgression.length - 1) {
          // reset after a delay
          setTimeout(() => setDegreeStep(0), 5000);
        }
        return next;
      });
    };
    const id = setInterval(step, 1500);
    return () => clearInterval(id);
  }, [degreeProgression.length]);

  // Stats counters when visible
  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersRef.current = statsRef.current!.querySelectorAll("[data-target]") as NodeListOf<HTMLElement>;
          countersRef.current.forEach((el) => animateCounter(el));
          setCountersStarted(true);
          io.disconnect();
        }
      });
    });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, [countersStarted]);

  const animateCounter = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.target || "0");
    let current = 0;
    const totalSteps = 60; // ~1 sec @ 60fps
    const increment = target / totalSteps;
    const step = () => {
      current = Math.min(target, current + increment);
      if (target >= 1000000) {
        el.textContent = `$${Math.ceil(current).toLocaleString()}`;
      } else if (target < 10) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.ceil(current).toLocaleString();
      }
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Actions
  const navigate = useNavigate();

  const enrollNow = () => {
    navigate("/auth");
  };

  const postToMarketplace = () => {
    navigate("/listings");
  };

  const enrollInMetaListing = () => {
    toast({
      title: "Ultimate Academic Challenge 🚀",
      description:
        "Help sell the entire University of Bacon. First-degree payout: 50% of the $100,000 pool ($50,000) bacon.",
    });
  };

  const showDeansListInfo = () => {
    toast({
      title: "Dean's List 🌟",
      description:
        "Top 5% performer! 20% bonus on future bacon earnings and exclusive catalog access.",
    });
  };

// Fetch real course data and stats
const { courses: topCourses, loading: coursesLoading } = useTopCourses();
const { 
  totalBaconEarned, 
  totalUsers, 
  totalListings, 
  averageGPA, 
  charityFund,
  loading: statsLoading 
} = useRealTimeStats();
const topCoursesApiRef = useRef<CarouselApi | null>(null);
useEffect(() => {
  const id = setInterval(() => topCoursesApiRef.current?.scrollNext(), 5000);
  return () => clearInterval(id);
}, []);

return (
  <SharedLayout>
    <div>

      <main>
        {/* Top Courses - Ultra Compact */}
        <aside aria-label="Top Courses" className="py-1 sm:py-4">
          <div className="container">
            <Card className="shadow-elegant">
              <CardHeader className="pb-1 sm:pb-3">
                <CardTitle className="text-sm sm:text-lg">Top Courses</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Highlights this week</CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <Carousel setApi={(api) => (topCoursesApiRef.current = api)} className="relative">
                  <CarouselContent>
                    {coursesLoading ? (
                      // Loading skeleton
                      Array.from({ length: 4 }).map((_, i) => (
                        <CarouselItem key={`skeleton-${i}`} className="px-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div className="rounded-md border bg-card p-2 sm:p-4 animate-pulse">
                            <div className="h-3 bg-muted rounded w-20 mb-2"></div>
                            <div className="h-4 bg-muted rounded w-full mb-1"></div>
                            <div className="h-3 bg-muted rounded w-24 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                            <div className="h-3 bg-muted rounded w-20"></div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : topCourses.length > 0 ? (
                      topCourses.map((c, i) => (
                        <CarouselItem key={c.id || i} className="px-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div className="rounded-md border bg-card p-2 sm:p-4 cursor-pointer hover:shadow-md transition-shadow"
                               onClick={() => navigate(`/listings/${c.id}`)}>
                            <div className="text-[9px] sm:text-[10px] uppercase tracking-wide text-muted-foreground">{c.department}</div>
                            <div className="mt-1 font-display text-xs sm:text-sm text-[hsl(var(--brand-academic))] line-clamp-2">{c.title}</div>
                            <div className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Anonymous listing • {c.classSize}</div>
                            <div className="mt-2 text-xs sm:text-sm"><span className="font-medium">Tuition:</span> {c.tuition}</div>
                            <div className="text-xs sm:text-sm"><span className="font-medium">Rewards:</span> {c.rewards}</div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      // No data fallback
                      <CarouselItem className="px-1 basis-full">
                        <div className="rounded-md border bg-card p-4 text-center text-muted-foreground">
                          <p className="text-sm">No courses available at the moment</p>
                          <p className="text-xs mt-1">Check back soon for new listings!</p>
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 sm:left-2 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8" />
                  <CarouselNext className="right-1 sm:right-2 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8" />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Hero - Aggressively Mobile Optimized */}
        <section className="campus-hero relative overflow-hidden">
          <div className="container grid gap-2 sm:gap-6 md:gap-8 py-3 sm:py-6 md:py-8 lg:py-12 lg:grid-cols-2 items-center">
            {/* Content - Mobile First */}
            <div className="text-background order-2 lg:order-1 space-y-2 sm:space-y-4 md:space-y-6">
              {/* Modernised hero heading emphasising the mission of the platform. */}
              <h1 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg text-gold-emboss leading-tight neon-glow">Earn Your Bacon</h1>
              <h2 className="font-display text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-accent drop-shadow leading-tight neon-glow">Turn Your Network into Net Worth</h2>
              <p className="text-xs sm:text-base md:text-lg opacity-90 leading-relaxed">A social marketplace where every connection pays off.</p>
              
              {/* Kevin Bacon explanation - Ultra Condensed for mobile */}
              <div className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm md:text-base opacity-95">
                <Clapperboard className="h-3 w-3 sm:h-5 sm:w-5 text-accent mt-0.5 flex-shrink-0" aria-hidden />
                <p className="leading-relaxed">
                  <span className="hidden sm:inline">Inspired by the legendary "Six Degrees of Kevin Bacon" game — the idea that everyone in Hollywood is connected to Kevin Bacon within six steps. We've taken this brilliant concept and made it profitable!</span>
                  <span className="sm:hidden">Six degrees of Kevin Bacon — now profitable!</span>
                </p>
              </div>
              
              {/* Buttons - Mobile Stacked */}
              <div className="flex flex-col gap-2 sm:gap-3 w-full sm:flex-row sm:w-auto">
                <MotionButton 
                  className="lift w-full sm:w-auto text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-3 neon-glow" 
                  variant="hero" 
                  onClick={enrollNow} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  🚀 Sign In / Sign Up
                </MotionButton>
                <MotionButton 
                  className="lift w-full sm:w-auto text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-3 neon-glow" 
                  variant="secondary" 
                  onClick={postToMarketplace} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  🔍 Browse Listings
                </MotionButton>
              </div>

              {/* Academic Journey - Minimal for mobile */}
              <div className="pt-1 sm:pt-4">
                <h3 className="font-display text-xs sm:text-base md:text-lg text-background/95 mb-1 sm:mb-2">Your Academic Journey:</h3>
                <AcademicTimeline items={degreeProgression} currentStep={degreeStep} />
              </div>
            </div>

            {/* Hero Image - Ultra Compact for Mobile */}
            <figure className="relative w-full h-32 sm:h-56 md:h-64 lg:h-80 xl:aspect-square rounded-lg sm:rounded-2xl overflow-hidden border bg-card shadow-elegant animate-fade-in order-1 lg:order-2">
              <img src={heroIvy} alt="Ivy‑League campus hero with golden crest and bacon motif" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              <figcaption className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-1 sm:left-2 md:left-3 right-1 sm:right-2 md:right-3">
                <span className="inline-flex rounded-md bg-background/80 backdrop-blur px-1 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold text-foreground shadow">Earn Your Degree Online!</span>
              </figcaption>
            </figure>
          </div>
        </section>

{/* Departments - Mobile Optimized */}
<section id="departments" className="container mobile-section-padding scroll-reveal scroll-mt-24">
          <header className="text-center mb-4 sm:mb-6">
            <h2 className="font-display mobile-h2 text-[hsl(var(--brand-academic))]">Our Distinguished Faculties</h2>
            <p className="text-base sm:text-lg text-muted-foreground italic max-w-2xl mx-auto px-4 sm:px-0">Choose your specialization and start earning bacon from day one</p>
          </header>
          <div className="mobile-grid mt-6 sm:mt-8">
            {departments.map((d) => (
              <Card key={d.title} className="scroll-reveal mobile-card">
                <CardHeader className="pb-3">
                  <div className="text-3xl sm:text-4xl mb-2">{d.icon}</div>
                  <CardTitle className="font-display text-lg sm:text-xl text-[hsl(var(--brand-academic))]">{d.title}</CardTitle>
                  <CardDescription className="italic text-sm sm:text-base">{d.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm sm:text-base">{d.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Study Guides - Mobile Optimized */}
        <section id="study-guides" className="scroll-reveal scroll-mt-24 bg-[hsl(var(--brand-academic))] text-background py-8 sm:py-12 md:py-16">
          <div className="container">
            <h2 className="text-center font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl text-accent">Study Guides</h2>
            <p className="text-center opacity-90 italic mt-2 text-sm sm:text-base">Real courses from our growing catalog</p>
            <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {coursesLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="text-center rounded-xl bg-white/10 p-4 sm:p-6 backdrop-blur animate-pulse">
                    <div className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-full mx-auto mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-5/6 mx-auto"></div>
                  </div>
                ))
              ) : topCourses.length > 0 ? (
                topCourses.slice(0, 3).map((course, i) => (
                  <div key={course.id} className="scroll-reveal text-center rounded-xl bg-white/10 p-4 sm:p-6 backdrop-blur cursor-pointer hover:bg-white/20 transition-colors"
                       onClick={() => navigate(`/listings/${course.id}`)}>
                    <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent text-[hsl(var(--brand-academic))] font-display text-lg sm:text-2xl shadow">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-base sm:text-lg lg:text-xl text-accent line-clamp-2">{course.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm italic opacity-90">{course.department} • {course.location}</p>
                    <p className="mt-2 opacity-90 text-xs sm:text-sm leading-relaxed">
                      <span className="font-medium">Tuition:</span> {course.tuition} • <span className="font-medium">Rewards:</span> {course.rewards}
                    </p>
                  </div>
                ))
              ) : (
                // Fallback to static courses if no real data
                courses.map((c, i) => (
                  <div key={i} className="scroll-reveal text-center rounded-xl bg-white/10 p-4 sm:p-6 backdrop-blur">
                    <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-accent text-[hsl(var(--brand-academic))] font-display text-lg sm:text-2xl shadow">{c.num}</div>
                    <h3 className="font-display text-base sm:text-lg lg:text-xl text-accent">{c.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm italic opacity-90">{c.code}</p>
                    <p className="mt-2 opacity-90 text-xs sm:text-sm leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* How University of Bacon Works - Mobile Optimized */}
        <section id="how-it-works" className="scroll-reveal scroll-mt-24 container py-8 sm:py-12 lg:py-16">
          <header className="mb-4 sm:mb-6 text-center">
            <h2 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl text-[hsl(var(--brand-academic))]">🎓 How University of Bacon Works</h2>
            <p className="text-muted-foreground italic text-sm sm:text-base">Freshman Orientation: Getting Started</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start">
            <article className="lg:col-span-2 space-y-4 sm:space-y-6">
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">Step 1: Enroll &amp; Get Verified</h3>
                <p className="text-sm sm:text-base leading-relaxed">Sign up and choose your verification level - from "Freshman" (basic email/phone) all the way up to "Dean's List" (full background check). Higher verification = access to bigger deals and more bacon!</p>
              </section>
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">Step 2: Post Your "Course Catalog"</h3>
                <p className="text-sm sm:text-base leading-relaxed mb-2">Got something to sell? Create your listing like you're designing a course:</p>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">
                  <li>Course Title: "2019 MacBook Pro - Mint Condition"</li>
                  <li>Course Description: All the juicy details</li>
                  <li>Tuition Fee: Your asking price</li>
                  <li className="hidden sm:list-item">Professor Rewards: Set how much bacon you'll pay your referral chain (we recommend 15-25% of sale price)</li>
                  <li className="sm:hidden">Professor Rewards: Set bacon percentage (15-25% recommended)</li>
                  <li>Class Size: Choose 1-6 degrees deep for your referral network</li>
                </ul>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground italic">All listings are published anonymously to prevent system bypassing.</p>
              </section>
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">The Academic Chain Reaction</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li>🔗 <strong>Degree 1:</strong> Sarah sees your MacBook and refers it to Jake.</li>
                  <li>🔗 <strong>Degree 2:</strong> Jake passes it to his sister Emma who's laptop shopping.</li>
                  <li>🔗 <strong>Degree 3-6:</strong> This continues until someone says "YES!" and buys.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl">📚 The Bacon Distribution</h3>
                <p className="text-sm sm:text-base leading-relaxed mb-2">When Emma buys your MacBook for $1,200 with a 20% reward pool ($240 in bacon):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div>Degree 1: 50% = $120 🥓</div>
                  <div>Degree 2: 25% = $60 🥓</div>
                  <div>Degree 3: 10% = $24 🥓</div>
                  <div>Degree 4: 7.5% = $18 🥓</div>
                  <div>Degree 5: 5% = $12 🥓</div>
                  <div>Degree 6: 2.5% = $6 🥓</div>
                </div>
                <p className="mt-2 text-sm sm:text-base">Everyone wins: You sold your MacBook, Emma got what she wanted, and Sarah & Jake earned bacon!</p>
              </section>
            </article>
            
            {/* Bacon Money Sign Visual - Hidden on small mobile */}
            <div className="hidden sm:flex flex-col items-center justify-center lg:sticky lg:top-24">
              <div className="relative">
                <img 
                  src="/lovable-uploads/9b625b57-f1b6-47fb-a476-9a2bab04aa54.png" 
                  alt="Bacon Money Sign" 
                  className="w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-contain animate-pulse"
                />
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl opacity-75 animate-pulse" />
              </div>
              <div className="mt-4 sm:mt-6 text-center max-w-xs">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-[hsl(var(--brand-academic))] leading-tight">
                  "You don't even have to know the buyer to earn bacon!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Student Body Stats - Mobile Optimized */}
        <section ref={statsRef} className="scroll-reveal bg-gradient-to-tr from-accent to-[hsl(var(--accent))] py-8 sm:py-12 lg:py-20">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="rounded-lg sm:rounded-xl bg-white/10 p-3 sm:p-6 text-white backdrop-blur">
              <span className="block font-display text-2xl sm:text-3xl lg:text-4xl drop-shadow" data-target={totalBaconEarned}>
                {statsLoading ? "$0" : `$${totalBaconEarned.toLocaleString()}`}
              </span>
              <span className="mt-1 sm:mt-2 block font-semibold text-xs sm:text-sm lg:text-base">Total Bacon Earned</span>
            </div>
            <div className="rounded-lg sm:rounded-xl bg-white/10 p-3 sm:p-6 text-white backdrop-blur">
              <span className="block font-display text-2xl sm:text-3xl lg:text-4xl drop-shadow" data-target={totalListings}>
                {statsLoading ? "0" : totalListings.toLocaleString()}
              </span>
              <span className="mt-1 sm:mt-2 block font-semibold text-xs sm:text-sm lg:text-base">Active Courses</span>
            </div>
            <div className="rounded-lg sm:rounded-xl bg-white/10 p-3 sm:p-6 text-white backdrop-blur">
              <span className="block font-display text-2xl sm:text-3xl lg:text-4xl drop-shadow" data-target={totalUsers}>
                {statsLoading ? "0" : totalUsers.toLocaleString()}
              </span>
              <span className="mt-1 sm:mt-2 block font-semibold text-xs sm:text-sm lg:text-base">Enrolled Students</span>
            </div>
            <div className="rounded-lg sm:rounded-xl bg-white/10 p-3 sm:p-6 text-white backdrop-blur">
              <span className="block font-display text-2xl sm:text-3xl lg:text-4xl drop-shadow" data-target={averageGPA}>
                {statsLoading ? "0.0" : averageGPA.toFixed(1)}
              </span>
              <span className="mt-1 sm:mt-2 block font-semibold text-xs sm:text-sm lg:text-base">Average Student GPA</span>
            </div>
          </div>
        </section>

        {/* Special Announcement */}
        <section className="scroll-reveal bg-gradient-primary text-background py-16">
          <div className="container max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent text-[hsl(var(--brand-academic))] px-3 py-1 text-xs font-bold uppercase tracking-wide shadow pulse">🔥 Hot Listing</span>
            <h2 className="mt-3 font-display text-3xl text-accent">FIRST COURSE LISTING!</h2>
            <p className="mt-2 text-xl font-semibold">The Dean is selling the entire university!</p>
            <p className="mt-2 opacity-90">Help us find a buyer for University of Bacon and the first student to successfully refer could earn <strong className="text-accent">50% of the $100,000 payout pool</strong>.</p>
            <div className="relative mt-6 rounded-2xl p-[2px] bg-gradient-to-r from-yellow-400/80 via-amber-300/80 to-yellow-500/80 shadow-glow">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur ring-1 ring-white/20">
                <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(90deg,transparent,black,transparent)] opacity-20 animate-fade-in bg-gradient-to-r from-transparent via-white to-transparent" />
                <p><strong>Course Title:</strong> Complete Social Commerce University Platform</p>
                <p className="mt-2"><strong>Asking Price:</strong> $400,000</p>
                <p className="mt-2"><strong>First Degree Payout:</strong> 50% of $100,000 = $50,000 bacon</p>
                <ul className="mt-2 list-disc pl-6 text-left space-y-1 text-sm">
                  <li>Degree 1: 50% = $50,000</li>
                  <li>Degree 2: 25% = $25,000</li>
                  <li>Degree 3: 10% = $10,000</li>
                  <li>Degree 4: 7.5% = $7,500</li>
                  <li>Degree 5: 5% = $5,000</li>
                  <li>Degree 6: 2.5% = $2,500</li>
                </ul>
                <p className="mt-2 text-sm opacity-80">Think you know someone who'd want to buy an innovative social commerce platform? This could be the referral of a lifetime!</p>
              </div>
            </div>
            <MotionButton onClick={enrollInMetaListing} className="mt-6 bg-accent text-[hsl(var(--brand-academic))] hover:opacity-90 lift" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>🎯 I Know Someone Who'd Buy This!</MotionButton>
          </div>
        </section>

        {/* Fees */}
        <section id="admissions" className="scroll-reveal scroll-mt-24 bg-muted/50 py-20">
          <div className="container text-center">
            <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))]">📝 Course Registration Fees</h2>
            <p className="mt-2 text-lg text-muted-foreground">Transparent pricing for posting to our course catalog</p>
            <p className="mt-1 text-sm italic text-muted-foreground">Think of it as advertising tuition — get exposure to thousands of referrers!</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              {fees.map((f) => (
                <div key={f.title} className="rounded-xl bg-card p-6 shadow-elegant border-t-4" style={{ borderTopColor: f.border }}>
                  <h3 className="font-display text-xl" style={{ color: f.color }}>{f.title}</h3>
                  <div className="mt-2 text-3xl font-bold text-[hsl(var(--brand-academic))]">{f.price}</div>
                  <p className="mt-1 text-muted-foreground">{f.range}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
</section>

        {/* Transcripts */}
        <section id="transcripts" className="scroll-reveal scroll-mt-24 bg-background py-20">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))]">📜 Official Transcripts</h2>
            <p className="mt-2 text-muted-foreground">Request sealed, certified transcripts delivered digitally.</p>
            <div className="mt-6">
              <MotionButton className="lift" variant="hero" onClick={() => toast({ title: 'Transcript Request', description: 'Your transcript request portal will open shortly.' })} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Request Transcripts
              </MotionButton>
            </div>
          </div>
        </section>

        {/* Alumni */}
        <section id="alumni" className="scroll-reveal scroll-mt-24 bg-secondary py-20">
          <div className="container text-center">
            <h2 className="font-display text-3xl text-[hsl(var(--brand-academic))]">🎓 Alumni Network</h2>
            <p className="mt-2 text-muted-foreground">Stay connected, mentor students, and earn alumni bacon bonuses.</p>
            <div className="mt-6 flex justify-center">
              <MotionButton className="lift" variant="outline" onClick={() => toast({ title: 'Alumni', description: 'Thanks for staying connected! Alumni portal coming soon.' })} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Join Alumni Portal
              </MotionButton>
            </div>
          </div>
        </section>

        {/* Charity Impact Fund Section */}
        <section className="bg-gradient-to-r from-[hsl(var(--brand-academic))] to-[hsl(var(--brand-academic-dark))] text-background py-8 sm:py-12 md:py-16">
          <div className="container">
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <div className="p-6 text-center">
                <h3 className="text-xl font-display text-[hsl(var(--brand-academic))] mb-2 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Charity Impact Fund
                </h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-2xl mx-auto">
                  Every time an item sells before all 6 referral degrees are filled, unclaimed funds automatically support student financial aid and educational initiatives.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                      {statsLoading ? "$0" : `$${Math.round(charityFund.totalDonated).toLocaleString()}`}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Donated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[hsl(var(--brand-academic))]">{charityFund.partnersCount}</div>
                    <div className="text-xs text-muted-foreground">Charity Partners</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[hsl(var(--brand-academic))]">
                      {statsLoading ? "0" : charityFund.studentsHelped.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Students Helped</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-[hsl(var(--brand-academic))]/10 text-[hsl(var(--brand-academic))] rounded">Student Emergency Fund</span>
                  <span className="px-2 py-1 bg-[hsl(var(--brand-academic))]/10 text-[hsl(var(--brand-academic))] rounded">Textbook Assistance Program</span>
                  <span className="px-2 py-1 bg-[hsl(var(--brand-academic))]/10 text-[hsl(var(--brand-academic))] rounded">Digital Access Initiative</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      {/* Dean's List Badge - Mobile Optimized */}
      <button onClick={showDeansListInfo} className="fixed right-3 sm:right-6 top-1/2 z-50 grid h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 -translate-y-1/2 place-items-center rounded-full bg-accent text-[hsl(var(--brand-academic))] font-bold shadow-glow transition-transform hover:scale-110 touch-target" aria-label="Learn about Dean's List benefits">
        <span className="text-[10px] sm:text-xs leading-tight text-center">
          <span className="block">DEAN'S</span>
          <span className="block">LIST</span>
        </span>
      </button>
    </div>
  </SharedLayout>
  );
};

export default Index;

// Content data
const departments = [
  { icon: "💻", title: "School of Technology", subtitle: "Electronics • Software • Gadgets", text: "Master the art of connecting tech buyers with sellers. From smartphones to servers, become the go-to networker in the digital marketplace." },
  { icon: "🚗", title: "Automotive Academy", subtitle: "Cars • Motorcycles • Boats", text: "Rev up your networking skills in high-value vehicle transactions. Big-ticket items mean bigger bacon payouts!" },
  { icon: "🏠", title: "Real Estate Institute", subtitle: "Homes • Commercial • Investments", text: "The ultimate networking challenge. Master million-dollar connections and earn bacon that could change your life." },
  { icon: "🎨", title: "Arts & Collectibles College", subtitle: "Art • Antiques • Memorabilia", text: "Connect collectors with their dream pieces. Where passion meets profit in the most rewarding way." },
  { icon: "⚡", title: "Services Department", subtitle: "Skills • Consulting • Freelance", text: "Network service providers with those who need them. From consulting to creative work, everyone wins." },
  { icon: "🌟", title: "Luxury Goods Seminary", subtitle: "Premium • Exclusive • High-End", text: "Connect ultra-high-net-worth individuals with their luxury desires." },
];

const courses = [
  { num: "101", title: "Discover & Refer", code: "BACON 101 - Introduction to Social Commerce", text: "Identify perfect matches in our catalog and refer items to people in your network. Master the fundamentals of social commerce." },
  { num: "201", title: "Build Academic Chains", code: "BACON 201 - Advanced Network Theory", text: "Your referrals can refer to their network too, creating chains up to 6 degrees. Everyone in the chain earns when someone buys!" },
  { num: "301", title: "Graduate with Honors", code: "BACON 301 - Monetization & Payouts", text: "When deals close, bacon is automatically distributed to your account. Cash out anytime or reinvest in posting your own courses." },
];

const achievements = [
  { emoji: "🎓", title: "Freshman Year", subtitle: "Basic Member Status", bullets: ["Refer items up to $500", "Earn up to $50 bacon per transaction", "Access to Intro to Networking", "Basic verification required"] },
  { emoji: "📚", title: "Graduate School", subtitle: "Verified Member Status", bullets: ["Refer items up to $5,000", "Earn up to $250 bacon per transaction", "Early access to premium courses", "Enhanced verification required"] },
  { emoji: "👨‍🏫", title: "Professor Status", subtitle: "Premium Member Status", bullets: ["Unlimited referral values", "Unlimited bacon potential", "Featured as networking expert", "Access to exclusive seminars"] },
];

const footerLinks = [
  { title: "Academic Departments", links: ["School of Technology", "Automotive Academy", "Real Estate Institute", "Arts & Collectibles"] },
  { title: "Student Life", links: ["Course Catalog", "Honor Roll", "Dean's List", "Alumni Network"] },
  { title: "Academic Support", links: ["Student Handbook", "Graduation Requirements", "Academic Integrity", "Student Services"] },
  { title: "Administration", links: ["About the University", "Faculty Directory", "Campus News", "Contact Admissions"] },
];

const fees = [
  { title: "Community College", price: "$5", range: "Items up to $500", desc: "Perfect for everyday items and electronics.", color: "hsl(var(--primary))", border: "hsl(var(--primary))" },
  { title: "State University", price: "$15", range: "Items $501-$2,000", desc: "Higher value electronics and furniture.", color: "hsl(var(--accent))", border: "hsl(var(--accent))" },
  { title: "Private University", price: "$35", range: "Items $2,001-$10,000", desc: "Vehicles and high-end equipment.", color: "hsl(var(--brand-academic))", border: "hsl(var(--brand-academic))" },
  { title: "Ivy League", price: "$75", range: "Items $10,001+", desc: "Real estate, luxury vehicles, acquisitions.", color: "hsl(var(--foreground))", border: "hsl(var(--foreground))" },
];
