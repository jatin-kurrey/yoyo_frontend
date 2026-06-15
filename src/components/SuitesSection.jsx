import { useState, useEffect } from "react";
import { Home, Hotel, ShieldCheck, Zap, X, Check, Loader2 } from "lucide-react";
import { settingsService } from "../services/settingsService";
import { apiRequest } from "../services/api";
import WhatsAppIcon from "./common/WhatsAppIcon";

const roomCards = [
  {
    title: "AC Premium Rooms",
    desc: "Luxury air-conditioned rooms for a refreshing rest after your waterpark adventure.",
    icon: <Zap size={24} />,
    isBookable: true
  },
  {
    title: "Family Suites",
    desc: "Spacious suites designed for larger families with all modern amenities.",
    icon: <Home size={24} />,
    isBookable: true
  },
  {
    title: "Clean Washrooms",
    desc: "Maintaining the highest standards of sanitation and hygiene for your comfort.",
    icon: <ShieldCheck size={24} />,
    isBookable: false
  },
  {
    title: "Easy Booking",
    desc: "Hassle-free reservation process with instant confirmation and support.",
    icon: <Hotel size={24} />,
    isBookable: false
  }
];

const WhatsAppIconLocal = () => <WhatsAppIcon />;

export default function SuitesSection() {
  const [whatsappNum, setWhatsappNum] = useState("919752586956");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("AC Premium Rooms");

  // Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
    guestsCount: 2,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
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

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hi%20YOYO%2C%20I%20want%20to%20check%20room%20availability%20and%20Suite%20booking.`;

  const handleOpenBooking = (roomTitle = "AC Premium Rooms") => {
    setSelectedRoom(roomTitle);
    setFormData({
      name: "",
      phone: "",
      email: "",
      checkInDate: "",
      checkOutDate: "",
      guestsCount: 2,
      message: `Enquiring for stay in ${roomTitle}`
    });
    setSubmitted(false);
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const subject = `Suite stay enquiry: ${selectedRoom}`;
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: subject,
        message: `Stay Enquiry Details:
- Room: ${selectedRoom}
- Check-In: ${formData.checkInDate}
- Check-Out: ${formData.checkOutDate}
- Guests: ${formData.guestsCount}
- Extra Info: ${formData.message || 'None'}`
      };
      
      // Submit stay enquiry as a contact/message lead
      await apiRequest('/contact', {
        method: 'POST',
        body: payload
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
      }, 2500);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit booking enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="suites" className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* UPPER TITLE AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=800&auto=format&fit=crop" className="rounded-[40px] shadow-2xl h-64 object-cover mt-8" alt="Stay 1" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop" className="rounded-[40px] shadow-2xl h-64 object-cover" alt="Stay 2" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-10 rounded-[40px] shadow-2xl hidden md:block">
               <p className="text-3xl font-black mb-1 italic">Best Value</p>
               <p className="text-xs font-bold uppercase tracking-widest opacity-80">Ideal for Families & Couples</p>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
            <div>
              <span className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Premium Accommodation</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Suites & <span className="text-blue-600">Stay</span>
              </h2>
            </div>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Extend your fun with our comfortable rooms and family suites. Ideal for outstation visitors and weekend getaways where comfort meets adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <button 
                onClick={() => handleOpenBooking("General Suite Enquiry")}
                className="bg-blue-600 text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20"
               >
                 Book a Suite
               </button>
               <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20"
               >
                 <WhatsAppIconLocal /> Check Availability
               </a>
            </div>
          </div>
        </div>

        {/* 4-CARD ICON GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomCards.map((card, i) => (
            <div 
              key={i} 
              onClick={card.isBookable ? () => handleOpenBooking(card.title) : undefined}
              className={`bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all group ${
                card.isBookable ? "hover:shadow-xl cursor-pointer" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 transition-colors ${
                card.isBookable ? "group-hover:bg-blue-600 group-hover:text-white" : ""
              }`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STAY BOOKING ENQUIRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  Stay Reservation Enquiry
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Submit stay requirements</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2.5 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h4 className="text-2xl font-black text-gray-900">Enquiry Received!</h4>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  Your reservation request has been submitted. Our resort desk will check availability and contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {submitError && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl">
                    {submitError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Number of Guests</label>
                    <input 
                      type="number" 
                      value={formData.guestsCount}
                      onChange={(e) => setFormData({...formData, guestsCount: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Check-In Date</label>
                    <input 
                      type="date" 
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900 text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Check-Out Date</label>
                    <input 
                      type="date" 
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900 text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Selected Room Type</label>
                  <select 
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                  >
                    <option value="AC Premium Rooms">AC Premium Rooms</option>
                    <option value="Family Suites">Family Suites</option>
                    <option value="General Suite Enquiry">Other / General</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message / Special Requests</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="3"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-900 resize-none"
                    placeholder="Tell us about extra beds, dinner plans, check-in timings, etc..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    "Submit Stay Request"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
