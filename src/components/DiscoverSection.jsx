import { useState, useEffect, useRef } from "react";
import { Zap, Waves, Heart, Star, Anchor, Sun, Compass, Activity, Smile, ArrowRight, Loader2 } from "lucide-react";
import { attractionService } from "../services/attractionService";

const iconMap = {
  Zap: <Zap size={24} />,
  Waves: <Waves size={24} />,
  Heart: <Heart size={24} />,
  Star: <Star size={24} />,
  Anchor: <Anchor size={24} />,
  Sun: <Sun size={24} />,
  Compass: <Compass size={24} />,
  Activity: <Activity size={24} />,
  Smile: <Smile size={24} />
};

export default function DiscoverSection() {
  const [attractionList, setAttractionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let active = true;
    attractionService.listPublic()
      .then(data => {
        if (active) {
          setAttractionList(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load attractions:", err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (attractionList.length === 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % attractionList.length;
      const cards = container.children;
      if (cards[idx]) {
        cards[idx].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [attractionList]);

  if (loading) {
    return (
      <section id="attractions" className="py-32 bg-white flex items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </section>
    );
  }

  if (attractionList.length === 0) {
    return null;
  }

  // Triple the items to ensure the loop is seamless even on large screens
  const doubledAttractions = [...attractionList, ...attractionList, ...attractionList];

  return (
    <section id="attractions" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-fadeSlide">
          World Class Attractions
        </div>
        <h2 className="text-[2.2rem] md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
          Endless Adventure for Every Age
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          From high-speed thrills to relaxed family zones, we've designed every corner
          of YOYO Fun N Foods for maximum joy and safety.
        </p>
      </div>

      {/* Desktop Infinite Scroll Container */}
      <div className="relative group hidden md:block">
        <div className="flex animate-infinite-scroll hover:[animation-play-state:paused] gap-8 py-10 px-4 w-max">
          {doubledAttractions.map((item, idx) => {
            const IconNode = iconMap[item.icon_name] || <Zap size={24} />;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="w-[380px] h-[520px] relative rounded-[3rem] overflow-hidden group/card shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                  loading="lazy"
                />
                <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-8 left-8">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {item.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center">
                      {IconNode}
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                    {item.description}
                  </p>
                  <button className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest group/btn">
                    Explore More
                    <div className="h-0.5 w-8 bg-blue-500 transition-all duration-300 group-hover/btn:w-16" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Swipe Container */}
      <div className="md:hidden relative w-full overflow-hidden">
        <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-5 py-8 px-6 no-scrollbar w-full">
          {attractionList.map((item) => {
            const IconNode = iconMap[item.icon_name] || <Zap size={20} />;
            return (
              <div
                key={item.id}
                className="w-[280px] sm:w-[320px] h-[420px] shrink-0 snap-center relative rounded-[2.5rem] overflow-hidden group/card shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {item.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center">
                      {IconNode}
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-2 font-medium">
                    {item.description}
                  </p>
                  <button className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest group/btn">
                    Explore More
                    <div className="h-0.5 w-6 bg-blue-500 transition-all duration-300 group-hover/btn:w-12" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
