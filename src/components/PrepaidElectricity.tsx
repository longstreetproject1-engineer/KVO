import { useState, FormEvent } from 'react';
import { Copy, Check, ExternalLink, Zap, Info, Plus, Trash2 } from 'lucide-react';
import { Meter } from '../types.js';

interface PrepaidElectricityProps {
  meters: Meter[];
  isAdmin: boolean;
  onAddMeter: (meter: Omit<Meter, 'id' | 'slNo'>) => Promise<void>;
  onDeleteMeter: (id: string) => Promise<void>;
}

export default function PrepaidElectricity({
  meters,
  isAdmin,
  onAddMeter,
  onDeleteMeter
}: PrepaidElectricityProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // New meter form state
  const [newName, setNewName] = useState('');
  const [newCustomerNo, setNewCustomerNo] = useState('');
  const [newMeterNo, setNewMeterNo] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRowAction = async (meter: Meter) => {
    // Copy customer number
    try {
      await navigator.clipboard.writeText(meter.customerNo);
      setCopiedId(meter.id);
      
      // Setup dynamic toast notifications
      const nMessage = `Customer ID: "${meter.customerNo}" copied to clipboard! Opening NESCO Secure login...`;
      setToastMessage(nMessage);

      setTimeout(() => {
        setCopiedId(null);
      }, 3000);

      setTimeout(() => {
        setToastMessage(null);
        // Redirect to external login box securely
        window.open('https://customer.nesco.gov.bd/pre/panel', '_blank');
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      window.open('https://customer.nesco.gov.bd/pre/panel', '_blank');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newCustomerNo || !newMeterNo) return;
    setIsSubmitting(true);
    try {
      await onAddMeter({
        name: newName,
        customerNo: newCustomerNo,
        meterNo: newMeterNo,
        location: newLocation || 'Assigned Board'
      });
      setNewName('');
      setNewCustomerNo('');
      setNewMeterNo('');
      setNewLocation('');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMeters = meters.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.customerNo.includes(searchTerm) ||
    m.meterNo.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Dynamic Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-55 max-w-sm rounded-lg border border-sky-100 bg-white p-4 shadow-xl animate-fade-in ring-4 ring-sky-50">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-sky-500 animate-pulse mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Action Link Authorized</p>
              <p className="text-xs text-slate-500 mt-0.5">{toastMessage}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-sky-600">
                <span>Redirecting safely</span>
                <span className="flex gap-0.5">
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="rounded-xl bg-white p-6 border border-[#D0E8F4] shadow-sm animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="w-2.5 h-7 bg-[#4AA8D8] mt-1 inline-block rounded-full shrink-0"></span>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1A2A3A]">Prepaid Electricity Meters</h1>
              <p className="text-xs md:text-sm text-[#4A6075] font-semibold mt-2.5 max-w-2xl leading-relaxed">
                🔹 Click on Name or Customer Number → copy number & open NESCO login portal for quick bill payment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 rounded-md bg-[#4AA8D8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2E90C4] transition-all shadow-md shadow-sky-100 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Board Meter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add New Meter Form (Admin Section) */}
      {isAdmin && showAddForm && (
        <div className="rounded-lg border border-red-100 bg-white p-5 shadow-md animate-fade-in max-w-lg">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-red-500" />
            <span>Register New Meter Board (Admin)</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase">User Name / Flat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Halima (2nd floor)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Cabinet Location (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Floor Cabinet"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Customer Number (8 digits)</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{8,15}"
                  title="Please enter valid numerical Customer number"
                  placeholder="e.g. 12046628"
                  value={newCustomerNo}
                  onChange={(e) => setNewCustomerNo(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Meter ID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 31041042 633"
                  value={newMeterNo}
                  onChange={(e) => setNewMeterNo(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table Grid */}
      <div className="rounded-2xl border border-[#D0E8F4] bg-white shadow-sm overflow-hidden animate-fade-in">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D0E8F4] bg-slate-50/70 px-6 py-4.5 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-[#4AA8D8] inline-block rounded-full"></span>
            <span className="text-sm font-bold text-[#1A2A3A] font-serif">Meters Register Index ({filteredMeters.length})</span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="🔍 Search name, phone, customer, or meter ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 rounded-lg border border-[#D0E8F4] bg-white px-3.5 py-2 text-xs text-[#1A2A3A] placeholder-slate-400 focus:border-[#4AA8D8] focus:ring-2 focus:ring-[#4AA8D8]/10 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Database Table (Desktop or Tablet screens) - Upgraded to text-sm & spacious padding */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-widest text-[#4A6075] border-b border-[#D0E8F4] select-none">
                <th className="px-6 py-4">SL No.</th>
                <th className="px-6 py-4">Name (Click to Copy & Open NESCO)</th>
                <th className="px-6 py-4 text-[#4AA8D8]">Customer ID (8 Digits)</th>
                <th className="px-6 py-4">Meter ID Number</th>
                <th className="px-6 py-4">Cabinet Board</th>
                {isAdmin && <th className="px-6 py-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMeters.length > 0 ? (
                filteredMeters.map((meter) => (
                  <tr 
                    key={meter.id}
                    className="group data-table-row border-b border-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4.5 font-mono text-slate-400 font-bold text-xs">
                      {meter.slNo}
                    </td>
                    <td className="px-6 py-4.5 select-all">
                      <button
                        onClick={() => handleRowAction(meter)}
                        className="flex items-center gap-2 font-bold text-[#1A2A3A] hover:text-[#4AA8D8] group-hover:underline text-left cursor-pointer focus:outline-hidden"
                      >
                        <span className="text-sm">{meter.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[#4AA8D8] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="px-6 py-4.5 font-mono font-bold text-slate-700">
                      <button
                        onClick={() => handleRowAction(meter)}
                        className="flex items-center gap-2 font-mono font-black text-slate-700 hover:text-[#4AA8D8] hover:bg-[#E8F5FB] px-2 py-1 rounded-lg transition-colors group-hover:bg-[#E8F5FB] select-all cursor-pointer animate-none"
                      >
                        <span className="text-sm md:text-base tracking-wide text-[#1A2A3A]">{meter.customerNo}</span>
                        {copiedId === meter.id ? (
                          <Check className="h-4 w-4 text-[#D94444] animate-pulse stroke-[3px]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4.5 font-mono text-slate-600 font-bold uppercase tracking-widest text-xs">
                      {meter.meterNo}
                    </td>
                    <td className="px-6 py-4.5 text-slate-400 text-xs">
                      📍 {meter.location}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4.5 text-center">
                        <button
                          onClick={() => onDeleteMeter(meter.id)}
                          className="text-[#D94444] hover:text-red-700 p-1.5 rounded-lg hover:bg-[#FDEAEA] cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                    No meter registers match your search query. Try typing another detail.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards (Visible on mobile screen heights, super large copy button actions) */}
        <div className="block md:hidden p-4 space-y-4 bg-slate-50/[0.45]">
          {filteredMeters.length > 0 ? (
            filteredMeters.map((meter) => (
              <div 
                key={meter.id}
                className="bg-white rounded-2xl border border-[#D0E8F4] p-5 space-y-4 shadow-xs relative overflow-hidden transition-all hover:shadow-md"
              >
                {/* Badge top elements */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-md bg-[#E8F5FB] px-2.5 py-1 text-xs font-mono font-black text-[#4AA8D8] border border-[#B8DFEF]">
                      Index #{meter.slNo}
                    </span>
                    <span className="text-xs font-semibold text-[#4A6075]">
                      📍 {meter.location}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteMeter(meter.id)}
                      className="text-[#D94444] hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                      title="Delete Record"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Meter Board Tenant Name */}
                <div>
                  <h4 className="font-serif font-black text-[#1A2A3A] text-lg select-all">
                    {meter.name}
                  </h4>
                </div>

                {/* Large responsive action-trigger cards for NESCO Prepaid */}
                <div className="grid grid-cols-1 gap-3 pt-1">
                  
                  {/* Tap to Copy Customer ID Card */}
                  <button
                    onClick={() => handleRowAction(meter)}
                    className="w-full text-left bg-[#E8F5FB] hover:bg-[#D0E8F4] active:bg-[#B8DFEF]/40 border-2 border-[#B8DFEF] rounded-xl p-4 flex items-center justify-between transition-all focus:outline-hidden cursor-pointer min-h-[64px]"
                  >
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#4AA8D8]">TAP TO COPY CUSTOMER NO</span>
                      <span className="font-mono font-extrabold text-[#1A2A3A] tracking-wider text-base">{meter.customerNo}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs font-bold shrink-0">
                      {copiedId === meter.id ? (
                        <span className="text-[#D94444] font-black flex items-center gap-1.5 animate-pulse">
                          <Check className="h-5 w-5 stroke-[3px]" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-white text-[#4AA8D8] border border-[#B8DFEF] shadow-xs px-3 py-1.5 rounded-lg font-bold text-xs">
                          <Copy className="h-4 w-4" /> Copy & Pay
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Meter ID detail Line */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Meter Number</span>
                      <span className="font-mono font-bold text-sm text-slate-700 tracking-widest">{meter.meterNo}</span>
                    </div>
                    <span className="text-xl">🎛️</span>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-[#D0E8F4] p-10 text-center text-slate-400 italic text-sm">
              No meter registers match your search query. Try typing another detail.
            </div>
          )}
        </div>
      </div>

      {/* Villa Author & Emergency Contact Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm font-bold text-lg">
          👤
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            Ahsan Kabir <span className="font-semibold text-sky-500 ml-1 bg-sky-50 px-2 py-0.5 rounded text-[10px]">Villa Author</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Contact: 01718832646 • ahsankabircontact@gmail.com</p>
          <p className="text-xs text-slate-400 mt-0.5">Villa Specs: 1069 sq. ft. • Word 4 • Sardar Para, Rangpur</p>
        </div>
        <div className="sm:ml-auto flex items-center w-full sm:w-auto">
          <div className="lite-red-bg px-4 py-2 rounded-lg border border-red-100 text-center sm:text-left w-full sm:w-auto">
            <span className="text-xs block text-slate-500 font-medium">Emergency</span>
            <span className="lite-red-text font-bold text-sm">01713843552</span>
          </div>
        </div>
      </div>
    </div>
  );
}
