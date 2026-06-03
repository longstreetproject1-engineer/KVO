import { Phone, Mail, Award, Landmark, Ruler, Heart, ShieldCheck } from 'lucide-react';

export default function AboutSection() {
  const profileImg = "/src/assets/images/ahsan_kabir_1780497238489.png";

  return (
    <div className="space-y-6">
      
      {/* Header banner */}
      <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm animate-fade-in flex items-start gap-3">
        <span className="w-2 h-6 sky-blue-accent mt-1 inline-block rounded-full shrink-0"></span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800 mt-0.5">About Kabir Villa</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Meet the driving vision behind Sardar Para's premier smart residence, designed by founder Ahsan Kabir. Learn more about the structural specs and principles of Kabir Villa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Ahsan Kabir Profile Card */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-full flex flex-col justify-between animate-fade-in">
            <div className="space-y-4">

              {/* Bio Details */}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-slate-800">Ahsan Kabir</h2>
                <p className="text-xs text-sky-600 font-bold tracking-tight">House Proprietor</p>
                <p className="text-[10px] font-mono font-medium text-slate-400">Head of AiroX Sky Inc.</p>
              </div>

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 text-center leading-relaxed">
                As a software engineer, Ahsan Kabir conceived Kabir Villa as a tranquil, digitally enabled, community-centric home in Rangpur. Here, family comfort pairs with modern utility meters and robust guidelines.
              </div>
            </div>

            {/* Quick Contact Vectors */}
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
              <a 
                href="tel:01718832646"
                className="flex items-center gap-3 rounded-md bg-slate-50 p-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                <Phone className="h-4 w-4 text-sky-500 shrink-0" />
                <span className="font-semibold text-slate-600">01718832646</span>
              </a>
              <a 
                href="mailto:ahsankabircontact@gmail.com"
                className="flex items-center gap-3 rounded-md bg-slate-50 p-2 text-xs text-slate-700 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Mail className="h-4 w-4 text-red-500 shrink-0" />
                <span className="font-semibold text-slate-600 break-all">ahsankabircontact@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right column: Building Specifications & Culture */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Building Specifications Cards */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Spec 1: Size */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 animate-fade-in">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm sky-blue-accent text-sky-500">
                <Ruler className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-405 uppercase tracking-wider">Spatial Footprint</h3>
                <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">1,069 Sq. Ft.</p>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Optimized carpet area built to support high-efficiency ventilation, spacious balconies, and cozy apartments.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
