import { Phone, Mail, HelpCircle, Smartphone, ExternalLink, ShieldCheck } from 'lucide-react';

interface ContactSectionProps {
  onSendMessage?: (msg: { name: string; email: string; phone: string; message: string }) => Promise<void>;
}

export default function ContactSection({ onSendMessage }: ContactSectionProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header banner */}
      <div className="rounded-xl bg-white p-6 border border-[#D0E8F4] shadow-sm animate-fade-in flex items-start gap-4">
        <span className="w-3 h-8 bg-[#4AA8D8] mt-1 inline-block rounded-full shrink-0" />
        <div>
          <span className="text-xs font-bold tracking-wider text-[#4AA8D8] uppercase font-mono">Communication Desk</span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1A2A3A] mt-0.5">Contact Kabir Villa</h1>
          <p className="text-xs md:text-sm text-[#4A6075] mt-1 max-w-xl">
            Reach out directly to the building owner, Ahsan Kabir, or access our official channels for any assistance.
          </p>
        </div>
      </div>

      {/* Main Direct Contact Cards - Ultra-friendly for mobile/Android viewports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Primary Telephone */}
        <div className="rounded-2xl border border-[#D0E8F4] bg-white p-6 md:p-8 shadow-sm space-y-4 flex flex-col justify-between animate-fade-in">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F5FB] border border-[#B8DFEF] text-[#4AA8D8]">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#7A9AB0] uppercase tracking-wider font-mono font-bold">Primary Hotlines</h3>
              <h4 className="font-serif text-lg md:text-xl font-extrabold text-[#1A2A3A] tracking-tight mt-1">Ahsan Kabir</h4>
              <p className="text-xl md:text-2xl font-mono font-black text-[#4AA8D8] mt-1 tracking-wide select-all">
                01718832646
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-505 mt-2">
                <Smartphone className="h-4 w-4 text-slate-405" />
                <span>Alternative Support: <strong className="font-mono text-slate-750">01713843552</strong></span>
              </div>
            </div>
          </div>
          
          <div className="pt-3">
            <a
              href="tel:01718832646"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#4AA8D8] hover:bg-[#2E90C4] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-sky-100 transition-all active:scale-95 cursor-pointer min-h-[48px]"
            >
              <span>📞 Click to Voice Call</span>
            </a>
          </div>
        </div>

        {/* Card 2: Email Support */}
        <div className="rounded-2xl border border-[#D0E8F4] bg-white p-6 md:p-8 shadow-sm space-y-4 flex flex-col justify-between animate-fade-in">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDEAEA] border border-[#F4BEBE] text-[#D94444]">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#7A9AB0] uppercase tracking-wider font-mono font-bold">Electronic Mail</h3>
              <h4 className="font-serif text-lg md:text-xl font-extrabold text-[#1A2A3A] tracking-tight mt-1">Admin Inquiry Inbox</h4>
              <p className="text-base md:text-lg font-mono font-bold text-[#D94444] mt-2 break-all select-all">
                ahsankabircontact@gmail.com
              </p>
            </div>
          </div>

          <div className="pt-3">
            <a
              href="mailto:ahsankabircontact@gmail.com"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#D94444] hover:bg-[#BE2B2B] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-[#D94444]/25 transition-all active:scale-95 cursor-pointer min-h-[48px]"
            >
              <span>✉️ Send Direct Email</span>
            </a>
          </div>
        </div>

      </div>

      {/* Response and security stats banner */}
      <div className="rounded-2xl border border-[#B8DFEF] bg-[#E8F5FB]/60 p-6 md:p-8 space-y-4 animate-fade-in">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-white flex items-center justify-center shadow-xs border border-[#B8DFEF]">
            <HelpCircle className="h-5 w-5 text-[#4AA8D8]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-[#1A2A3A] font-bold text-base flex items-center gap-2">
              <span>Tenant Security & Guarantee Policy</span>
            </h4>
            <p className="text-xs md:text-sm text-[#4A6075] leading-relaxed">
              Admin Ahsan Kabir responds to urgent utility queries, pipeline faults, and electric/NESCO-associated complications within <strong>2 hours</strong>. General document updates, flat allocations, and directory permissions are revised during standard workdays.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
