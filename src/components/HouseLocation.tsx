import { MapPin, Navigation, Eye, Compass, ExternalLink } from 'lucide-react';

export default function HouseLocation() {
  const mapUrl = "https://www.google.com/maps/place/Ahsan+Kabir+(AiroX+Sky+Inc.)/@25.7759111,89.2288621,135a,35y,5.12t/data=!3m1!1e3!4m6!3m5!1s0x39e331004390a989:0x66a2f1fa076506f1!8m2!3d25.775956!4d89.2290009!16s%2Fg%2F11w9k36qdv!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm animate-fade-in flex items-start gap-3">
        <span className="w-2 h-6 sky-blue-accent mt-1 inline-block rounded-full shrink-0"></span>
        <div>
          <span className="text-xs font-bold tracking-wider text-sky-500 uppercase">Geographic Index</span>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 mt-0.5">House Location</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Detailed physical address parameters, local wards, and coordinate links for Kabir Villa, located in the historic city of Rangpur.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Address particulars */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#D0E8F4] bg-white p-6 shadow-sm space-y-4 animate-fade-in animate-duration-300">
            <h2 className="text-base font-bold text-[#1A2A3A] flex items-center gap-2 font-serif">
              <MapPin className="h-5 w-5 text-red-500" />
              <span>Location Particulars</span>
            </h2>

            <div className="space-y-4 pt-1">
              {/* Locality */}
              <div className="flex gap-3 border-b border-slate-50 pb-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#4AA8D8] border border-sky-100 shrink-0">
                  <Navigation className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Area Name</p>
                  <p className="text-sm font-bold text-[#1A2A3A]">Sardar Para, Rangpur</p>
                </div>
              </div>

              {/* Word */}
              <div className="flex gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D94444] border border-red-100 shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Word Number</p>
                  <p className="text-sm font-bold text-[#1A2A3A]">Ward Number: 04</p>
                </div>
              </div>

              {/* Thana */}
              <div className="flex gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#4AA8D8] border border-sky-100 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Thana / Sub-District</p>
                  <p className="text-sm font-bold text-[#1A2A3A]">Porshura Thana</p>
                </div>
              </div>

              {/* Neighborhood Info */}
              <div className="flex gap-3 pb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D94444] border border-red-100 shrink-0">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">More Information / Landmarks</p>
                  <p className="text-sm font-bold text-[#1A2A3A]">Dhap, Hazipara, Rangpur</p>
                  <p className="text-xs text-[#4A6075] mt-1.5 leading-relaxed">
                    Kabir Villa stands as a prominent residential building close to central institutions with excellent road access.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href={mapUrl}
                target="_blank"
                rel="no-referrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4AA8D8] hover:bg-[#2E90C4] active:bg-[#1C73A1] py-3 text-xs font-bold text-white shadow-md shadow-sky-100 transition-all cursor-pointer min-h-[48px]"
              >
                <Compass className="h-4 w-4" />
                <span>Open in Google Maps App</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Beautiful interactive live embedded Google Maps map */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="rounded-2xl border border-[#D0E8F4] bg-white p-1 shadow-sm h-full flex flex-col justify-between overflow-hidden animate-fade-in">
            <div className="relative flex-grow min-h-[350px] rounded-xl overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1440.4588901124564!2d89.2288621!3d25.7759111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e331004390a989%3A0x66a2f1fa076506f1!2sAhsan%20Kabir%20(AiroX%20Sky%20Inc.)!5e1!3m2!1sen!2sbd!4v1680000000000!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '350px' }} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
