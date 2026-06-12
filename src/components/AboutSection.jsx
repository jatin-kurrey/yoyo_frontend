import React, { useEffect, useRef, useState, Fragment } from "react";
import { Smile, Lightbulb, Zap, ShieldCheck, Heart, Award } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { settingsService } from "../services/settingsService";

const ICON_MAP = {
  Smile: <Smile className="h-8 w-8 text-lime-300" />,
  Lightbulb: <Lightbulb className="h-8 w-8 text-lime-300" />,
  Zap: <Zap className="h-8 w-8 text-lime-300" />,
  ShieldCheck: <ShieldCheck className="h-8 w-8 text-lime-300" />,
  Heart: <Heart className="h-8 w-8 text-lime-300" />,
  Award: <Award className="h-8 w-8 text-lime-300" />,
};

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const data = await settingsService.public();
        if (active) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings in AboutSection:", err);
      }
    }
    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // 🎥 VIDEO – BLUR TO CLEAR
      gsap.fromTo(
        videoRef.current,
        { filter: "blur(6px)", scale: 1.05 },
        {
          filter: "blur(0px)",
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // 🖼️ IMAGES – SOFT SCALE IN
      gsap.from(".soft-image", {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // 📝 TEXT – PURE FADE
      gsap.from(".soft-text", {
        opacity: 0,
        duration: 1,
        ease: "power1.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const videoSrc = settings?.about_video_url || "/about-bg.mp4";

  return (
    <section ref={sectionRef} className="relative py-16 md:py-28 overflow-hidden">
      {/* 🎥 BACKGROUND VIDEO */}
      {videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc} // re-render video player when URL changes
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* VERY LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-center">

          {/* LEFT IMAGE */}
          <div className="soft-image relative">
            <img
              src={settings?.about_image_1_url || "https://images.unsplash.com/photo-1629834598512-77a443808b73?q=80&w=687&auto=format&fit=crop"}
              className="h-[350px] md:h-[520px] w-full rounded-[40px] object-cover"
              alt="YOYO waterpark entrance and attractions"
              loading="lazy" width={687} height={520}
            />
          </div>

          {/* CENTER CONTENT */}
          <div className="text-white">
            <span className="soft-text inline-block mb-4 -rotate-6 rounded-md bg-yellow-400 px-4 py-1 text-xs font-bold text-black">
              ABOUT US
            </span>

            <h2 className="soft-text font-heading text-4xl md:text-[2.8rem] lg:text-[3.4rem] leading-tight font-extrabold">
              {settings?.about_headline ? (
                settings.about_headline.split("<br />").map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    <br />
                  </Fragment>
                ))
              ) : (
                <>
                  Central India's <br />
                  Favorite Water <br />
                  Park Destination
                </>
              )}
            </h2>

            <p className="soft-text mt-5 max-w-md text-sm text-white/80">
              {settings?.about_description || "At YOYO Fun N Foods, every visit is a splash of excitement and joy. Families create unforgettable memories with thrilling rides, delicious food, and endless fun."}
            </p>

            <hr className="soft-text my-8 border-white/30" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.isArray(settings?.about_bullets) && settings.about_bullets.length > 0 ? (
                settings.about_bullets.map((item, idx) => (
                  <div key={idx} className="soft-text flex gap-4">
                    {ICON_MAP[item.icon] || ICON_MAP.Smile}
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-white/80">{item.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="soft-text flex gap-4">
                    <Smile className="h-8 w-8 text-lime-300" />
                    <div>
                      <h4 className="font-semibold">Family-Friendly Fun</h4>
                      <p className="text-sm text-white/80">
                        Safe rides, clean facilities, and activities designed for
                        all ages to enjoy together.
                      </p>
                    </div>
                  </div>

                  <div className="soft-text flex gap-4">
                    <Lightbulb className="h-8 w-8 text-lime-300" />
                    <div>
                      <h4 className="font-semibold">Thrilling Adventures</h4>
                      <p className="text-sm text-white/80">
                        High-speed slides, massive wave pools, and exciting
                        attractions await at every turn.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>


          {/* RIGHT IMAGE */}
          <div className="soft-image relative hidden lg:block">
            <span className="soft-text absolute -top-4 right-10 rotate-6 rounded-md bg-lime-400 px-3 py-1 text-xs font-bold text-black">
              WATERPARK
            </span>

            <img
              src={settings?.about_image_2_url || "https://plus.unsplash.com/premium_photo-1661378818245-0fe1239e5bdc?q=80&w=687&auto=format&fit=crop"}
              className="h-[420px] w-full rounded-[40px] object-cover"
              alt="Scenic view of waterpark pool area"
              loading="lazy" width={687} height={420}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
