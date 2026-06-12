import { useState, useEffect } from "react";
import { Utensils, Coffee, Users, ShieldCheck, Loader2 } from "lucide-react";
import { restaurantService } from "../services/restaurantService";
import { settingsService } from "../services/settingsService";
import WhatsAppIcon from "./common/WhatsAppIcon";

const iconMap = {
  Utensils: <Utensils size={24} />,
  Coffee: <Coffee size={24} />,
  Users: <Users size={24} />,
  ShieldCheck: <ShieldCheck size={24} />
};

const WhatsAppIconLocal = () => <WhatsAppIcon />;

export default function RestaurantSection() {
  const [foodCards, setFoodCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNum, setWhatsappNum] = useState("919752586956");

  useEffect(() => {
    let active = true;
    restaurantService.listItems()
      .then(data => {
        if (active) {
          setFoodCards(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load restaurant items:", err);
        if (active) setLoading(false);
      });

    // Fetch site settings for WhatsApp number
    settingsService.public()
      .then(data => {
        if (active && data?.whatsapp_number) {
          setWhatsappNum(data.whatsapp_number.replace(/\D/g, ''));
        }
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hi%20YOYO%2C%20I%20want%20to%20enquire%20about%20Restaurant%20and%20food%20options.`;

  if (loading) {
    return (
      <section id="restaurant" className="py-24 bg-white flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </section>
    );
  }

  if (foodCards.length === 0) {
    return null;
  }

  // Filter or take first 4 items to keep UI aligned perfectly
  const displayedCards = foodCards.slice(0, 4);

  return (
    <section id="restaurant" className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-orange-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Taste the Joy</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Food & <span className="text-orange-600 italic">Restaurant</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Enjoy delicious meals, snacks, and refreshing drinks during your visit. From quick bites to full family feasts, our hygienic kitchen serves it all.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20">
              <WhatsAppIconLocal /> Ask on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedCards.map((card, i) => {
            const IconNode = iconMap[card.icon_name] || <Utensils size={24} />;
            return (
              <div 
                key={card.id || i} 
                className="group relative bg-gray-50 rounded-[40px] p-4 border border-gray-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-orange-600/5 hover:-translate-y-2"
              >
                <div className="relative h-48 w-full rounded-[32px] overflow-hidden mb-6">
                  <img src={card.image_url} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" width={400} height={192} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md w-10 h-10 rounded-2xl flex items-center justify-center text-orange-600 shadow-lg">
                    {IconNode}
                  </div>
                </div>
                <div className="px-4 pb-6">
                  <h3 className="text-xl font-black text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/10"
          >
            Explore Food Options
          </a>
        </div>
      </div>
    </section>
  );
}
