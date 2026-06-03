import { useState, FormEvent } from 'react';
import { 
  Lock, Key, Shield, Check, MessageSquare, Info, LogOut, Mail, Send
} from 'lucide-react';
import { UserMessage, AdminStats } from '../types.js';

interface LoginAdminPanelProps {
  messages: UserMessage[];
  stats: AdminStats;
  isAdmin: boolean;
  onLogin: (username: string, pass: string) => Promise<boolean>;
  onLogout: () => void;
  onMarkMessageRead: (id: string) => Promise<void>;
}

export default function LoginAdminPanel({
  messages,
  stats,
  isAdmin,
  onLogin,
  onLogout,
  onMarkMessageRead
}: LoginAdminPanelProps) {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setLoginError('Both username and password are required.');
      return;
    }

    setIsAuthenticating(true);
    const success = await onLogin(adminUsername, adminPassword);
    setIsAuthenticating(false);

    if (success) {
      setAdminPassword('');
      setAdminUsername('');
    } else {
      setLoginError('Invalid Administrator Credentials. Correct username and password required.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Login Screen if not authenticated */}
      {!isAdmin ? (
        <div className="mx-auto max-w-md rounded-2xl border border-[#D0E8F4] bg-white p-8 shadow-md space-y-6 animate-fade-in my-8">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#D94444] border border-red-100">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-bold text-[#1A2A3A] font-serif">Administrator Authentication</h1>
            <p className="text-xs text-[#4A6075] px-2">
              Unlock official building notice publish panels, electric meter boards, and visitor contact logs.
            </p>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {loginError && (
              <p className="text-xs font-bold text-[#D94444] border border-red-100 bg-red-50 p-3 rounded-lg text-center animate-fade-in">
                {loginError}
              </p>
            )}
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Username ID</label>
              <input
                type="text"
                required
                placeholder="Enter admin username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-[#4AA8D8] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono font-semibold">Security Password</label>
              <input
                type="password"
                required
                placeholder="Enter security password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 focus:border-[#4AA8D8] focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4AA8D8] hover:bg-[#2E90C4] py-3 text-xs font-bold text-white shadow-md shadow-sky-100 transition-colors disabled:opacity-50 cursor-pointer min-h-[44px]"
            >
              <Key className="h-4 w-4" />
              <span>{isAuthenticating ? 'Authenticating...' : 'Authenticate Securely'}</span>
            </button>
          </form>


        </div>
      ) : (
        
        // Logged-in Admin Terminal Control Room
        <div className="space-y-6 animate-fade-in">
          
          {/* Dashboard Welcome Header */}
          <div className="rounded-xl bg-white p-6 border border-[#D0E8F4] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#4AA8D8] border border-sky-100 shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-[#1A2A3A] font-serif">Admin Console Terminal</h1>
                <p className="text-xs text-[#4A6075] mt-1">
                  Signed in as proprietor <span className="font-bold text-[#1A2A3A]">Ahsan Kabir</span>. Manage official bulletins, utility ledgers, and view visitor messages.
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#D94444] text-xs font-bold px-4 py-2 rounded-xl shadow-3xs cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Active Bulletins</p>
              <p className="text-3xl font-black text-[#D94444] mt-1.5">{stats.totalNotices}</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Controlled under "House Notices" tab</p>
            </div>
            <div className="rounded-xl border border-[#D0E8F4] bg-white p-5 text-center shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Electricity Meters</p>
              <p className="text-3xl font-black text-[#4AA8D8] mt-1.5">06 Cards</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Controlled under "Prepaid Electricity" tab</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Inquiry Mailbox</p>
              <p className="text-3xl font-black text-amber-500 mt-1.5">{stats.unreadMessages} unread</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Visitor letters parsed instantly</p>
            </div>
          </div>

          {/* Inbound Visitor Messages / Inquiry Logs */}
          <div className="rounded-xl border border-[#D0E8F4] bg-white p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-[#1A2A3A] flex items-center gap-2 font-serif">
                <MessageSquare className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Inbound Message Inquiries Mailbox ({messages.length})</span>
              </h2>
              <p className="text-xs text-[#4A6075] mt-1">
                Receive and acknowledge public inquiries, flat application questions, or general maintenance reports.
              </p>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {messages.length > 0 ? (
                messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`rounded-xl border p-4 space-y-3 transition-all ${
                      m.read 
                        ? 'bg-slate-5 bg-opacity-40 border-slate-200' 
                        : 'bg-amber-50/10 border-amber-200 ring-4 ring-amber-50/5'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-[#1A2A3A]">{m.name}</h4>
                        <p className="text-[10px] font-medium text-slate-400">📅 {new Date(m.date).toLocaleString()}</p>
                      </div>
                      {!m.read && (
                        <button
                          onClick={() => onMarkMessageRead(m.id)}
                          className="bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-600 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
                        >
                          Mark as Resolved / Read
                        </button>
                      )}
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                      {m.message}
                    </p>

                    <div className="text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <span>📞 Phone: <strong className="text-slate-600 font-semibold">{m.phone}</strong></span>
                      <span>✉️ Email: <strong className="text-slate-600 font-semibold">{m.email}</strong></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Inbox empty. No visitor letters received.
                </div>
              )}
            </div>
          </div>

          {/* quick tutorial helper on notice and meter actions */}
          <div className="rounded-xl bg-sky-50/40 border border-sky-105 p-5 text-xs text-[#4A6075] space-y-2">
            <h3 className="font-bold text-[#1A2A3A] flex items-center gap-1.5">
              <Info className="h-4 w-4 text-[#4AA8D8] shrink-0" />
              <span>Administration Tips & Quick Access:</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-semibold leading-relaxed">
              <li>To **add, delete, or edit bulletin notices**, navigate to the <span className="text-[#4AA8D8] font-bold">📢 House Notices</span> tab in the navigation above. Create panel will automatically unlock for your profile session!</li>
              <li>To **append or discard electricity meters**, navigate to the <span className="text-[#4AA8D8] font-bold">⚡ Prepaid Electricity</span> tab above to use instant board ledger controls.</li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
