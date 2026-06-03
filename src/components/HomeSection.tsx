import { Play, MapPin, Zap, Megaphone, Info, Phone, ArrowRight, Home, Users } from 'lucide-react';
import { Notice } from '../types.js';
import AboutSection from './AboutSection.jsx';

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  recentNotice: Notice | null;
}

export default function HomeSection({ onNavigate, recentNotice }: HomeSectionProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8F5FB] via-white to-[#FDEAEA] p-8 md:p-12 border border-[#D0E8F4] shadow-sm text-center">
        {/* Subtle Decorative Ambient Circles resembling the Design Reference */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-radial from-[#4AA8D8]/10 to-transparent rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-radial from-[#D94444]/5 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#1A2A3A] leading-tight">
            Welcome to <span className="text-[#4AA8D8]">Kabir</span> <span className="text-[#D94444]">Villa</span>
          </h1>
          <p className="text-[#4A6075] text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Ahsan Kabir , mobile number : <span className="font-bold text-[#1A2A3A]">01718832646</span>
            <br />
            Alternative Support: <span className="font-bold text-[#1A2A3A]">01713843552</span> , email : <span className="font-bold text-[#4AA8D8]">ahsankabircontact@gmail.com</span>
          </p>

          {/* Feature Chips */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#4A6075] border border-[#D0E8F4] shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#4AA8D8]" />
              Sardar Para, Rangpur
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8F5FB] text-[#4AA8D8] border border-[#B8DFEF]">
              🏢 3 Floors
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#4A6075] border border-[#D0E8F4]">
              🏗️ 1,069 Sq. Ft.
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FDEAEA] text-[#D94444] border border-[#F4BEBE]">
              Ward No. 4
            </span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('prepaid')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4AA8D8] hover:bg-[#2E90C4] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md shadow-[#4AA8D8]/25 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ Check Electricity Meter</span>
            </button>
            <a
              href="https://forms.gle/WpHPwZvW2TaE8HjRA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D94444] hover:bg-[#BE2B2B] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md shadow-[#D94444]/25 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>📋 Google Form</span>
            </a>
          </div>
        </div>
      </div>

      {/* Integrated About Panel Content (Replacing Prepaid & Resident Portal cards as instructed) */}
      <div className="pt-2">
        <AboutSection />
      </div>

      {/* Quick Office Info banner */}
      <div className="rounded-xl bg-[#E8F5FB] p-5 border border-[#B8DFEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">ℹ️</span>
          <div>
            <h4 className="font-serif text-[#1A2A3A] font-bold text-sm">Official Helpline Desk</h4>
            <p className="text-xs text-[#4A6075] mt-0.5">Ahsan Kabir is available for any resident query daily from 9:00 AM to 9:00 PM.</p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <a href="tel:01718832646" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4AA8D8] bg-white border border-[#B8DFEF] px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-3xs">
            <Phone className="w-3.5 h-3.5" />
            01718832646
          </a>
        </div>
      </div>
    </div>
  );
}
