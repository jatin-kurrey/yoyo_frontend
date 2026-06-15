import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Clock, MapPin, Ticket, Star, ArrowRight } from "lucide-react";
import { heroService } from "../services/heroService";
import { settingsService } from "../services/settingsService";
import { ticketService } from "../services/ticketService";

const FALLBACK_SLIDES = [
  {
    image_url: "https://images.unsplash.com/photo-1708157730402-67cc5b19e335?q=80&w=1600&auto=format&fit=crop",
    headline: "Best Water Park in Indore for Family Fun & Kids Safety",
    subheadline: "Slides, wave pools, kids zone & full-day fun — starting at ₹499",
    cta_url: "/tickets",
    cta_text: "Book Tickets Now"
  },
  {
    image_url: "https://images.unsplash.com/photo-1739295194212-0602c4d1e797?q=80&w=1600&auto=format&fit=crop",
    headline: "Thrilling Slides & Massive Wave Pools Await You",
    subheadline: "Experience the ultimate adrenaline rush with 15+ world-class attractions.",
    cta_url: "/gallery",
    cta_text: "View Attractions"
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);
  const [infoIndex, setInfoIndex] = useState(0);
  const [settings, setSettings] = useState(null);
  const [lowestPrice, setLowestPrice] = useState("₹499");

  useEffect(() => {
    async function fetchSlides() {
      try {
        const data = await heroService.list();
        if (data && data.length > 0) {
          const mapped = data.map(slide => ({
            ...slide,
            headline: slide.title || slide.headline,
            subheadline: slide.subtitle || slide.subheadline || slide.description,
            cta_text: slide.cta_label || slide.cta_text,
          }));
          setSlides(mapped);
        }
      } catch (error) {
        console.error("Failed to load hero slides:", error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchSettings() {
      try {
        const data = await settingsService.public();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings in Hero:", error);
      }
    }
    async function fetchTickets() {
      try {
        const data = await ticketService.list();
        if (data && data.length > 0) {
          const minPrice = Math.min(...data.map(t => t.price));
          setLowestPrice(`₹${minPrice}`);
        }
      } catch (error) {
        console.error("Failed to load tickets in Hero:", error);
      }
    }
    fetchSlides();
    fetchSettings();
    fetchTickets();
  }, []);

  const getLocationCityAndSub = () => {
    if (!settings?.address) return { city: "Durg", sub: "Chhattisgarh" };
    const parts = settings.address.split(",");
    if (parts.length < 2) return { city: parts[0]?.trim().replace(/^(District|Tehsil)\s+/i, "") || "Durg", sub: "" };
    const city = parts[parts.length - 2]?.trim().replace(/^(District|Tehsil)\s+/i, "") || "Durg";
    const sub = parts[parts.length - 3]?.trim().replace(/^(District|Tehsil)\s+/i, "") || "Chhattisgarh";
    return { city, sub };
  };

  const loc = getLocationCityAndSub();

  const getOpeningHours = () => {
    if (!settings?.opening_hours) return "10:00 - 18:00";
    return settings.opening_hours.replace(/Open Today:\s*/i, "");
  };

  const quickInfo = [
    {
      label: "Starts From",
      value: lowestPrice,
      sub: "/ Person",
      icon: <Ticket size={22} />,
      colorClass: "text-blue-400 bg-blue-500/20",
      accent: "text-blue-400"
    },
    {
      label: "Location",
      value: loc.city,
      sub: loc.sub,
      icon: <MapPin size={22} />,
      colorClass: "text-orange-400 bg-orange-500/20",
      accent: "text-orange-400"
    },
    {
      label: "Status",
      value: "Open",
      sub: getOpeningHours(),
      icon: <Clock size={22} />,
      colorClass: "text-emerald-400 bg-emerald-500/20",
      accent: "text-emerald-400"
    }
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInfoIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-visible min-h-screen lg:h-screen">
      {/* HERO MAIN */}
      <div className="relative h-full w-full overflow-hidden bg-slate-950">
        {slides.map((slide, i) => {
          const validUrl = isValidUrl(slide.image_url) ? slide.image_url : "";
          return (
          <div
            key={slide.id || i}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            style={{ backgroundImage: validUrl ? `url(${validUrl})` : undefined }}
          >
            {/* Immersive Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-slate-950/90" />
            
            {/* Animated Water Reflections (Subtle Overlay) */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>
          );
        })}

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center pt-32 pb-48">
          <div className="mx-auto max-w-6xl px-6 text-center text-white">
            {/* ... (badges, h1, p, links remain same) ... */}
            {/* Status & Trust Badge Row */}
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
              <div className="inline-flex items-center gap-2 bg-emerald-500/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 border border-emerald-400/30">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Open Today: 10 AM - 6 PM
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-lg px-5 py-2 border border-white/20 shadow-xl">
                <Star className="text-amber-400 fill-amber-400" size={14} />
                <span className="text-[10px] font-black tracking-widest uppercase text-white/90">Top Rated Family Destination</span>
              </div>
            </div>

            <h1 className="[font-family:'Outfit',sans-serif] font-black tracking-tighter leading-[1] text-[2rem] md:text-7xl lg:text-8xl mb-8 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 line-clamp-2">
              {slides[index].headline.split(' ').map((word, i) => {
                const isThrilling = word.toLowerCase().includes('thrilling');
                const isWaterpark = word.toLowerCase().includes('waterpark');
                return (
                  <span 
                    key={i} 
                    className={isThrilling || isWaterpark ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300" : "text-white"}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-sm md:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed opacity-90 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 px-4 line-clamp-2">
              {slides[index].subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
              <Link
                to={slides[index].cta_url || "/tickets"}
                className="group relative w-full sm:w-auto rounded-2xl bg-blue-600 px-10 py-5 text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:bg-blue-700 hover:-translate-y-1 shadow-[0_20px_50px_rgba(37,99,235,0.4)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {slides[index].cta_text || "Book Tickets Now"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Link>
              
              <Link
                to="/gallery"
                className="w-full sm:w-auto rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/20 px-10 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-white transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/30"
              >
                Explore Attractions
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-12 bg-white" : "w-4 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* QUICK INFO BAR */}
      <div className="absolute -bottom-8 md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-full max-w-6xl z-40">
        
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-px rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.4)] border border-white/20 bg-white/10 backdrop-blur-3xl">
          {quickInfo.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-8 bg-transparent hover:bg-white/10 transition-all group ${
                idx === 1 ? "border-x border-white/10" : ""
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${item.colorClass} group-hover:bg-white group-hover:text-slate-900`}>
                {item.icon}
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${item.accent}`}>{item.label}</p>
                <p className="text-2xl font-black text-white leading-none">
                  {item.value} <span className="text-sm font-medium text-white/50">{item.sub}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Smooth Auto-Play Carousel Layout */}
        <div className="md:hidden w-[90%] mx-auto overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-3xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.4)] relative">
          <div className="relative h-[85px] w-full flex items-center justify-center overflow-hidden py-4 px-6">
            {quickInfo.map((item, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center gap-4 px-8 transition-all duration-700 ease-in-out ${
                  idx === infoIndex 
                    ? "opacity-100 translate-y-0 scale-100 visible" 
                    : "opacity-0 translate-y-4 scale-95 invisible"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.colorClass}`}>
                  {item.icon}
                </div>
                <div>
                  <p className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${item.accent}`}>{item.label}</p>
                  <p className="text-lg font-black text-white leading-none">
                    {item.value} <span className="text-[10px] font-medium text-white/50">{item.sub}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Subtle dots indicator for carousel */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {quickInfo.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === infoIndex ? "w-4 bg-white" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function isValidUrl(str) {
  if (!str || typeof str !== "string") return false;
  try {
    const url = new URL(str);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "ftp:";
  } catch {
    return str.startsWith("/") && !str.includes("..") && !str.includes("\\");
  }
}
