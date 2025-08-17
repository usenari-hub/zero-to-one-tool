import { useEffect, useMemo } from "react";
import { BookOpen, GraduationCap, Users, ScrollText, Building2, List } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useScrollSpy } from "@/hooks/use-scrollspy";

const SECTIONS = [
  { id: "listings", label: "Listings", icon: List, path: "/listings" },
  { id: "admissions", label: "Admissions", icon: GraduationCap, path: undefined },
  { id: "curriculum", label: "Curriculum", icon: BookOpen, path: undefined },
  { id: "transcripts", label: "Transcripts", icon: ScrollText, path: undefined },
  { id: "alumni", label: "Alumni", icon: Users, path: undefined },
] as const;

const STUDY_GUIDES = [
  "Freshman Orientation: Getting Started",
  "Posting to the Course Catalog",
  "Referral Chain Basics",
];

const DEPARTMENT_COURSE_PLACEHOLDERS = [
  { department: "Automotive", headlines: [
    "Classic Mustang Lead",
    "Luxury SUV Referral",
    "Motorcycle Flip 101",
  ] },
  { department: "Real Estate", headlines: [
    "2BR Downtown Condo",
    "Suburban Family Home",
    "Investor Duplex Deal",
  ] },
  { department: "Arts & Collectibles", headlines: [
    "Vintage Comic Collection",
    "Mid‑Century Art Piece",
    "Signed Sports Memorabilia",
  ] },
  { department: "Luxury Goods", headlines: [
    "Rolex Submariner Listing",
    "Hermès Birkin Referral",
    "Patek Philippe Collector",
  ] },
  { department: "Business", headlines: [
    "SaaS Startup Acquisition",
    "Local Franchise Sale",
    "E‑commerce Brand Exit",
  ] },
];

export function AppSidebar() {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useScrollSpy(ids);
  const { state, open } = useSidebar();

  // Persist state to localStorage for user preference
  useEffect(() => {
    localStorage.setItem("sidebar:open", String(open));
  }, [open]);

  const onClickScroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className={`${state === "collapsed" ? "w-14" : "w-64"} transition-all duration-300`}>
      <SidebarRail />
      <SidebarContent className="sidebar-content">
        {/* Bacon Logo - Mobile Optimized */}
        <div className="flex justify-center py-3 sm:py-4 border-b border-sidebar-border">
          <img 
            src="/lovable-uploads/4c9e5e09-0cd6-4c8b-9085-5ffc8177d095.png" 
            alt="University of Bacon crest logo" 
            className={`object-contain ${state === "collapsed" ? "h-8 w-8 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-16 sm:w-16"}`}
          />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm">Ivy Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECTIONS.map(({ id, label, icon: Icon, path }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton asChild className={`touch-target ${activeId === id ? "bg-accent/40 text-[hsl(var(--brand-academic))] ring-1 ring-accent" : "hover:bg-sidebar-accent"}`}>
                    {path ? (
                      <a href={path} className="flex items-center text-sm sm:text-base">
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {state !== "collapsed" && <span>{label}</span>}
                      </a>
                    ) : (
                      <a href={`#${id}`} onClick={onClickScroll(id)} className="flex items-center text-sm sm:text-base">
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        {state !== "collapsed" && <span>{label}</span>}
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {state !== "collapsed" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs sm:text-sm">Study Guides</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {STUDY_GUIDES.slice(0, 3).map((h, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild className="hover:bg-sidebar-accent/60 text-xs sm:text-sm">
                        <span className="truncate">{h}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs sm:text-sm">Courses</SidebarGroupLabel>
              <SidebarGroupContent>
                {DEPARTMENT_COURSE_PLACEHOLDERS.slice(0, 2).map((d) => (
                  <div key={d.department} className="mt-2">
                    <div className="px-2 text-[10px] uppercase tracking-wide text-muted-foreground">{d.department}</div>
                    <SidebarMenu>
                      {d.headlines.slice(0, 2).map((h, i) => (
                        <SidebarMenuItem key={i}>
                          <SidebarMenuButton asChild className="hover:bg-sidebar-accent/60 text-xs">
                            <span className="truncate">{h}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
