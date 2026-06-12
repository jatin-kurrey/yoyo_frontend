import { useState, useEffect } from "react";
import { Calendar, Users, Briefcase, GraduationCap, ChevronRight, X, Check, Loader2 } from "lucide-react";
import { hallService } from "../services/hallService";
import { settingsService } from "../services/settingsService";
import { apiRequest } from "../services/api";
import WhatsAppIcon from "./common/WhatsAppIcon";

const eventTypes = [
  { title: "Birthday Parties", icon: <Users size={24} />, desc: "Celebrate your special day with custom packages, music, and great food." },
  { title: "School Trips", icon: <GraduationCap size={24} />, desc: "Safe and educational outings with full supervision and group catering." },
  { title: "Corporate Events", icon: <Briefcase size={24} />, desc: "Professional halls for meetings, team building, and company outings." },
  { title: "Family Functions", icon: <Calendar size={24} />, desc: "Large banquet halls for weddings, anniversaries, and reunions." },
];

const WhatsAppIconLocal = () => <WhatsAppIcon />;

export default function HallBookingSection() {
  const [whatsappNum, setWhatsappNum] = useState("919752586956");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("Birthday Parties");
  
  // Enquiry form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    event_type: "Birthday Parties",
    expected_guests: 100,
    preferred_date: "",
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

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=Hi%20YOYO%2C%20I%20want%20to%20enquire%20about%20Banquet%20and%20Hall%20booking%20for%20an%20event.`;

  const handleOpenEnquiry = (eventType = "Birthday Parties") => {
    setSelectedEventType(eventType);
    setFormData({
      name: "",
      phone: "",
      email: "",
      event_type: eventType,
      expected_guests: 100,
      preferred_date: "",
      message: `Enquiring for ${eventType}`
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
      const payload = {
        ...formData,
        expected_guests: Number(formData.expected_guests),
        preferred_date: formData.preferred_date ? new Date(formData.preferred_date).toISOString() : new Date().toISOString(),
        source: `Web Card: ${formData.event_type}`
      };
      await hallService.submitEnquiry(payload);
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
      }, 2500);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hall-booking" className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Event Management</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Banquet & <span className="text-indigo-600 italic">Hall Booking</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-3xl mx-auto">
            Host birthdays, family functions, school trips, and corporate events with ease. Our versatile spaces and dedicated team ensure your event is a grand success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* LEFT: ORIGINAL EVENT CARDS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventTypes.map((event, i) => (
              <div 
                key={i} 
                onClick={() => handleOpenEnquiry(event.title)}
                className="p-8 rounded-[40px] bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-600/5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {event.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{event.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{event.desc}</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
                  Book Event <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: LEAD CTA CARD */}
          <div className="bg-indigo-600 p-10 rounded-[48px] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative z-10 space-y-8">
              <h4 className="text-3xl font-black leading-tight">Get a Custom Package</h4>
              <p className="text-indigo-100 font-medium opacity-80 leading-relaxed">
                Planning a large event? Contact our event specialists for a personalized quote and custom arrangements.
              </p>
              
              <div className="space-y-4 pt-4">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" 
                   className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#128C7E] hover:scale-105 transition-all shadow-xl shadow-[#25D366]/20">
                  <WhatsAppIconLocal /> Message on WhatsApp
                </a>
                <button onClick={() => handleOpenEnquiry("General")} 
                   className="w-full bg-indigo-700 text-white border border-indigo-400 px-8 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-800 transition-all">
                  Enquire for Booking
                </button>
              </div>

              <div className="pt-6 border-t border-indigo-500/30">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Ideal for 50 - 500 Guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  Book Event / Banquet
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Submit event requirements</p>
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
                <h4 className="text-2xl font-black text-gray-900">Enquiry Submitted!</h4>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  Our event specialists will review your requirements and call you back shortly.
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
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Your Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
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
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
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
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Preferred Date</label>
                    <input 
                      type="date" 
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900 text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Event Type</label>
                    <select 
                      value={formData.event_type}
                      onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                    >
                      <option value="Birthday Parties">Birthday Parties</option>
                      <option value="School Trips">School Trips</option>
                      <option value="Corporate Events">Corporate Events</option>
                      <option value="Family Functions">Family Functions</option>
                      <option value="General">Other / General</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Expected Guests</label>
                    <input 
                      type="number" 
                      value={formData.expected_guests}
                      onChange={(e) => setFormData({...formData, expected_guests: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                      min="10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message / Special Requests</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="3"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900 resize-none"
                    placeholder="Tell us details like catering requirements, stage decoration, etc..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    "Submit Enquiry"
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
