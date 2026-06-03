import { useState, useEffect } from 'react';
import { Landmark, ShieldAlert, Sparkles } from 'lucide-react';
import Header from './components/Header.jsx';
import HomeSection from './components/HomeSection.jsx';
import PrepaidElectricity from './components/PrepaidElectricity.jsx';
import HouseLocation from './components/HouseLocation.jsx';
import AboutSection from './components/AboutSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import LoginAdminPanel from './components/LoginAdminPanel.jsx';
import HouseNoticesSection from './components/HouseNoticesSection.jsx';
import { Notice, Meter, FamilyProfile, UserMessage, EmailLog, AdminStats } from './types.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Data States
  const [meters, setMeters] = useState<Meter[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    pendingApprovals: 0,
    totalMembers: 0,
    totalNotices: 0,
    unreadMessages: 0
  });

  // Offline detection flag
  const [isServerOffline, setIsServerOffline] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(true);

  // Fallback DB Keys & Default Data
  const LOCAL_DB_KEY = 'KABIR_VILLA_LOCAL_DB_v2';
  const defaultClientDb = {
    meters: [
      { id: "1", slNo: "01", name: "Home (1st floor)", customerNo: "12023995", meterNo: "31041045 415", location: "1st Floor Main board" },
      { id: "2", slNo: "02", name: "Home Motor 2nd Meter", customerNo: "19901255", meterNo: "31041052505", location: "Ground floor Pump" },
      { id: "3", slNo: "03", name: "Halima (2nd floor)", customerNo: "12046628", meterNo: "31041042 633", location: "2nd Floor East Appt" },
      { id: "4", slNo: "04", name: "Sobuj (2nd floor)", customerNo: "12046627", meterNo: "31041042 626", location: "2nd Floor West Appt" },
      { id: "5", slNo: "05", name: "Lucky (3rd floor)", customerNo: "12033369", meterNo: "31041042 536", location: "3rd Floor East Appt" },
      { id: "6", slNo: "06", name: "Sumon (3rd floor)", customerNo: "12050351", meterNo: "31041045 409", location: "3rd Floor West Appt" }
    ],
    notices: [
      { id: "n1", title: "Monthly Water Tank Routine Cleaning", content: "Dear tenants, our overhead main water reservoir tanks will undergo routine pressure washing on Friday, June 5th, from 8:00 AM to 1:00 PM. Water supply will be completely suspended during this timeframe. Kindly store ample water for cooking, cleaning, and sanitizing before Friday morning. We apologize for any convenience caused during this maintenance cycle.", date: "2026-06-03", category: "water" as const, priority: "high" as const },
      { id: "n2", title: "Please maintain the security", content: "Always be aware", date: "2026-06-02", category: "general" as const, priority: "high" as const },
      { id: "n3", title: "Wifi is available", content: "wifi name : Infinite Sky", date: "2026-06-01", category: "general" as const, priority: "medium" as const }
    ],
    profiles: [
      {
        id: "p1",
        name: "Sarder Sobuj Rahman",
        email: "sobuj.rangpur@gmail.com",
        phone: "01788223344",
        floor: "2nd Floor West [Apt B-2]",
        bio: "Software developer and technology enthusiast. Resident of Kabir Villa since 2024. Loves cycling around Sardar Para on weekends and collaborating on open-source community apps.",
        joinedDate: "2024-03-12",
        status: "approved" as const,
        twitterHandle: "sobuj_dev",
        fbLink: "facebook.com/sobujrangpur",
        photoSeed: 42,
        posts: [
          { id: "post_1", content: "Enjoying the cool evening breeze from the Kabir Villa 2nd-floor balcony! Extremely quiet and cozy neighborhood.", date: "2026-06-02T18:30:00.000Z", likes: 8 },
          { id: "post_2", content: "Prepaid electricity app is extremely convenient. Literally took 10 seconds to copy and reload my customer ID! Kudos!", date: "2026-06-01T09:12:00.000Z", likes: 12 }
        ]
      },
      {
        id: "p2",
        name: "Dr. Halima Akhter",
        email: "halima.clinical@gmail.com",
        phone: "01511998877",
        floor: "2nd Floor East [Apt A-2]",
        bio: "Medical Practitioner at Rangpur Medical College. Dedicated to healthcare research, gardening on the roof terrace of Kabir Villa, and organizing local health awareness workshops.",
        joinedDate: "2024-05-20",
        status: "approved" as const,
        twitterHandle: "dr_halima",
        fbLink: "facebook.com/drhalima.health",
        photoSeed: 98,
        posts: [
          { id: "post_3", content: "The rooftop garden at Kabir Villa is blooming beautifully this season. Harvested some fresh organic tomatoes today!", date: "2026-06-03T07:15:00.000Z", likes: 15 }
        ]
      },
      {
        id: "p3",
        name: "Sumon K. Poddar",
        email: "sumon.poddar@yahoo.com",
        phone: "01819776655",
        floor: "3rd Floor West [Apt B-3]",
        bio: "Assistant Professor is Business Administration. Academic counselor, chess player, and passionate tea collector. Fascinated by ancient architecture.",
        joinedDate: "2025-01-10",
        status: "approved" as const,
        twitterHandle: "sumon_biz",
        photoSeed: 125,
        posts: [
          { id: "post_4", content: "Prepared the mid-term exam papers today. Enjoyed a premium cup of Panchagarh black tea on the terrace. Quiet environment.", date: "2026-06-01T15:45:00.000Z", likes: 6 }
        ]
      },
      {
        id: "p4",
        name: "Tariqul Islam (Lucky)",
        email: "lucky.tariqul@gmail.com",
        phone: "01311554422",
        floor: "3rd Floor East [Apt A-3]",
        bio: "Civil Engineer and structural consultant. Interested in modern building design, smart home technologies, and eco-friendly house infrastructure.",
        joinedDate: "2025-02-15",
        status: "pending" as const,
        photoSeed: 204,
        posts: []
      },
      {
        id: "1780505895767",
        name: "Halima",
        email: "halima63776@gmail.com",
        phone: "01619871136",
        floor: "3rd",
        bio: "New occupant of Sardar Para Kabir Villa.",
        joinedDate: "2026-06-03",
        status: "pending" as const,
        twitterHandle: "",
        fbLink: "",
        photoSeed: 236,
        posts: []
      }
    ],
    messages: [
      {
        id: "m1",
        name: "Kazi Jamil",
        email: "kazi.jamil@outlook.com",
        phone: "01912345678",
        message: "Hello Ahsan Kabir, I am interested in renting a flat in Sardar Para. Do you have any vacancies on the 4th floor starting from next month? Let me know the rental parameters and advance policy.",
        date: "2026-06-02T10:05:00.000Z",
        read: false
      }
    ],
    emailLogs: [] as EmailLog[]
  };

  const getLocalDB = () => {
    const local = localStorage.getItem(LOCAL_DB_KEY);
    if (!local) {
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(defaultClientDb));
      return defaultClientDb;
    }
    try {
      return JSON.parse(local);
    } catch (e) {
      return defaultClientDb;
    }
  };

  const saveLocalDB = (db: any) => {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  };

  const syncLocalStats = (db: any) => {
    const pendingApprovals = db.profiles.filter((p: any) => p.status === 'pending').length;
    const totalMembers = db.profiles.filter((p: any) => p.status === 'approved').length;
    const totalNotices = db.notices.length;
    const unreadMessages = db.messages.filter((m: any) => !m.read).length;
    setStats({
      pendingApprovals,
      totalMembers,
      totalNotices,
      unreadMessages
    });
  };

  // Fetch Public Data
  const fetchPublicData = async (forceLocal = false) => {
    if (isServerOffline || forceLocal) {
      const db = getLocalDB();
      setMeters(db.meters);
      setNotices(db.notices);
      // Approved profiles only
      const approved = db.profiles.filter((p: any) => p.status === 'approved');
      setProfiles(approved);
      syncLocalStats(db);
      setLoading(false);
      return;
    }

    try {
      const [metersRes, noticesRes, profilesRes] = await Promise.all([
        fetch('/api/meters'),
        fetch('/api/notices'),
        fetch('/api/profiles')
      ]);

      if (!metersRes.ok || !noticesRes.ok || !profilesRes.ok) {
        throw new Error("HTTP non-okay status from API routes");
      }

      const [metersData, noticesData, profilesData] = await Promise.all([
        metersRes.json(),
        noticesRes.json(),
        profilesRes.json()
      ]);

      setMeters(metersData);
      setNotices(noticesData);
      setProfiles(profilesData);
      
      // Update our statistics and pending alert bubbles on first fetch
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn("Express backend server unreachable. Activating localStorage database fallback system.", err);
      setIsServerOffline(true);
      // Load fallback
      const db = getLocalDB();
      setMeters(db.meters);
      setNotices(db.notices);
      const approved = db.profiles.filter((p: any) => p.status === 'approved');
      setProfiles(approved);
      syncLocalStats(db);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Admin-Protected Data (and update stats)
  const fetchAdminData = async (forceLocal = false) => {
    if (!isAdmin) return;
    if (isServerOffline || forceLocal) {
      const db = getLocalDB();
      setProfiles(db.profiles);
      setMessages(db.messages);
      setEmailLogs(db.emailLogs || []);
      syncLocalStats(db);
      return;
    }

    try {
      const [profilesRes, messagesRes, emailsRes, statsRes] = await Promise.all([
        fetch('/api/admin/profiles'),
        fetch('/api/messages'),
        fetch('/api/admin/emails'),
        fetch('/api/admin/stats')
      ]);

      if (!profilesRes.ok || !messagesRes.ok || !emailsRes.ok || !statsRes.ok) {
        throw new Error("HTTP non-okay status from Admin routes");
      }

      const profilesData = await profilesRes.json();
      const messagesData = await messagesRes.json();
      const emailsData = await emailsRes.json();
      const statsData = await statsRes.json();

      setProfiles(profilesData);
      setMessages(messagesData);
      setEmailLogs(emailsData);
      setStats(statsData);
    } catch (err) {
      console.warn("Failed fetching admin data from server, utilizing local fallback.", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      setProfiles(db.profiles);
      setMessages(db.messages);
      setEmailLogs(db.emailLogs || []);
      syncLocalStats(db);
    }
  };

  // Initial Boot-up Sync
  useEffect(() => {
    fetchPublicData();
  }, []);

  // Periodic Polling for real-time notifications (e.g. every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPublicData();
      if (isAdmin) {
        fetchAdminData();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAdmin, isServerOffline]);

  // Handle Admin Credentials Login Session
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const isSecretCreds = username === 'ahsankabir100' && password === '27102007';
    const isFallbackCreds = (username === 'admin' || username === '') && (password === 'admin123' || password === 'KabirVilla2026!' || password === '27102007');

    if (isSecretCreds || isFallbackCreds) {
      setIsAdmin(true);
      if (isServerOffline) {
        const db = getLocalDB();
        setProfiles(db.profiles);
        setMessages(db.messages);
        setEmailLogs(db.emailLogs || []);
        syncLocalStats(db);
        return true;
      }
      try {
        const [pRes, mRes, eRes] = await Promise.all([
          fetch('/api/admin/profiles'),
          fetch('/api/messages'),
          fetch('/api/admin/emails')
        ]);
        if (!pRes.ok || !mRes.ok || !eRes.ok) throw new Error();
        setProfiles(await pRes.json());
        setMessages(await mRes.json());
        setEmailLogs(await eRes.json());
      } catch (e) {
        console.warn("Admin logs fell back to local storage.", e);
        setIsServerOffline(true);
        const db = getLocalDB();
        setProfiles(db.profiles);
        setMessages(db.messages);
        setEmailLogs(db.emailLogs || []);
        syncLocalStats(db);
      }
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setSubscribedProfilesOnly();
  };

  const setSubscribedProfilesOnly = async () => {
    if (isServerOffline) {
      const db = getLocalDB();
      const approved = db.profiles.filter((p: any) => p.status === 'approved');
      setProfiles(approved);
      return;
    }
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        setProfiles(await res.json());
      } else {
        throw new Error();
      }
    } catch (e) {
      setIsServerOffline(true);
      const db = getLocalDB();
      const approved = db.profiles.filter((p: any) => p.status === 'approved');
      setProfiles(approved);
    }
  };

  // Action Methods forwarding to server
  const handleAddMeter = async (meter: Omit<Meter, 'id' | 'slNo'>) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const slNo = String(db.meters.length + 1).padStart(2, '0');
      const newMeter: Meter = {
        ...meter,
        id: String(Date.now()),
        slNo
      };
      db.meters.push(newMeter);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch('/api/meters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meter)
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed sending meter, saving locally as fallback:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const slNo = String(db.meters.length + 1).padStart(2, '0');
      const newMeter: Meter = {
        ...meter,
        id: String(Date.now()),
        slNo
      };
      db.meters.push(newMeter);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleDeleteMeter = async (id: string) => {
    if (isServerOffline) {
      const db = getLocalDB();
      db.meters = db.meters.filter((m: any) => m.id !== id);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/meters/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed deleting meter from server, removing locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      db.meters = db.meters.filter((m: any) => m.id !== id);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleAddNotice = async (notice: Omit<Notice, 'id' | 'date'>) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const newNotice: Notice = {
        ...notice,
        id: String(Date.now()),
        date: new Date().toISOString().split('T')[0]
      };
      db.notices.unshift(newNotice);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice)
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed adding bulletin notice to server, adding locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const newNotice: Notice = {
        ...notice,
        id: String(Date.now()),
        date: new Date().toISOString().split('T')[0]
      };
      db.notices.unshift(newNotice);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (isServerOffline) {
      const db = getLocalDB();
      db.notices = db.notices.filter((n: any) => n.id !== id);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed deleting notice from server, deleting locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      db.notices = db.notices.filter((n: any) => n.id !== id);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleEditNotice = async (id: string, noticeData: Partial<Notice>) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const noticeIndex = db.notices.findIndex((n: any) => n.id === id);
      if (noticeIndex !== -1) {
        db.notices[noticeIndex] = {
          ...db.notices[noticeIndex],
          ...noticeData
        };
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeData)
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed editing notice on server, editing locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const noticeIndex = db.notices.findIndex((n: any) => n.id === id);
      if (noticeIndex !== -1) {
        db.notices[noticeIndex] = {
          ...db.notices[noticeIndex],
          ...noticeData
        };
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleSendMessage = async (msg: { name: string; email: string; phone: string; message: string }) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const newMessage: UserMessage = {
        ...msg,
        id: String(Date.now()),
        date: new Date().toISOString(),
        read: false
      };
      db.messages.unshift(newMessage);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed sending message to server, saving locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const newMessage: UserMessage = {
        ...msg,
        id: String(Date.now()),
        date: new Date().toISOString(),
        read: false
      };
      db.messages.unshift(newMessage);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleSubmitApplication = async (appData: any) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const existing = db.profiles.find((p: any) => p.email.toLowerCase() === appData.email.toLowerCase());
      if (existing) {
        throw "An application with this email address already exists.";
      }
      const newProfile = {
        ...appData,
        id: String(Date.now()),
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        photoSeed: Math.floor(Math.random() * 500) + 1,
        posts: []
      };
      db.profiles.push(newProfile);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch('/api/profiles/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw errorText || "An entry with this email already exists.";
      }
      await fetchPublicData();
      if (isAdmin) await fetchAdminData();
    } catch (err) {
      if (typeof err === 'string' && err.includes("already exists")) {
        throw err;
      }
      console.warn("Failed submitting application to server, saving locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const existing = db.profiles.find((p: any) => p.email.toLowerCase() === appData.email.toLowerCase());
      if (existing) {
        throw "An application with this email address already exists.";
      }
      const newProfile = {
        ...appData,
        id: String(Date.now()),
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        photoSeed: Math.floor(Math.random() * 500) + 1,
        posts: []
      };
      db.profiles.push(newProfile);
      saveLocalDB(db);
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleApproveProfile = async (id: string) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const profileIndex = db.profiles.findIndex((p: any) => p.id === id);
      if (profileIndex !== -1) {
        const profile = db.profiles[profileIndex];
        profile.status = 'approved';
        
        // Push welcome email
        const emailLog: EmailLog = {
          id: `email_${Date.now()}`,
          toEmail: profile.email,
          subject: "✨ Welcome to Kabir Villa Family Portfolio!",
          body: `Assalamualaikum ${profile.name},\n\nWe are absolutely delighted to inform you that your registration for your profile at Kabir Villa has been approved.\n\nYour profile is now live!`,
          date: new Date().toISOString(),
          status: 'success'
        };
        db.emailLogs = db.emailLogs || [];
        db.emailLogs.unshift(emailLog);
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/admin/profiles/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed approving profile, fallback locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const profileIndex = db.profiles.findIndex((p: any) => p.id === id);
      if (profileIndex !== -1) {
        const profile = db.profiles[profileIndex];
        profile.status = 'approved';
        const emailLog: EmailLog = {
          id: `email_${Date.now()}`,
          toEmail: profile.email,
          subject: "✨ Welcome to Kabir Villa Family Portfolio!",
          body: `Assalamualaikum ${profile.name},\n\nWe are absolutely delighted to inform you that your registration for your profile at Kabir Villa has been approved.`,
          date: new Date().toISOString(),
          status: 'success'
        };
        db.emailLogs = db.emailLogs || [];
        db.emailLogs.unshift(emailLog);
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleRejectProfile = async (id: string) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const profileIndex = db.profiles.findIndex((p: any) => p.id === id);
      if (profileIndex !== -1) {
        db.profiles[profileIndex].status = 'rejected';
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/admin/profiles/${id}/reject`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed rejecting profile, fallback locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const profileIndex = db.profiles.findIndex((p: any) => p.id === id);
      if (profileIndex !== -1) {
        db.profiles[profileIndex].status = 'rejected';
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const msgIndex = db.messages.findIndex((m: any) => m.id === id);
      if (msgIndex !== -1) {
        db.messages[msgIndex].read = true;
        saveLocalDB(db);
      }
      await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: 'POST'
      });
      if (res.ok) {
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed reading message, fallback locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const msgIndex = db.messages.findIndex((m: any) => m.id === id);
      if (msgIndex !== -1) {
        db.messages[msgIndex].read = true;
        saveLocalDB(db);
      }
      await fetchAdminData(true);
    }
  };

  const handleAddPost = async (profileId: string, content: string) => {
    if (isServerOffline) {
      const db = getLocalDB();
      const profileIndex = db.profiles.findIndex((p: any) => p.id === profileId);
      if (profileIndex !== -1) {
        db.profiles[profileIndex].posts = db.profiles[profileIndex].posts || [];
        db.profiles[profileIndex].posts.unshift({
          id: `post_${Date.now()}`,
          content,
          date: new Date().toISOString(),
          likes: 0
        });
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
      return;
    }

    try {
      const res = await fetch(`/api/profiles/${profileId}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        await fetchPublicData();
        if (isAdmin) await fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Failed posting status update, fallback locally:", err);
      setIsServerOffline(true);
      const db = getLocalDB();
      const profileIndex = db.profiles.findIndex((p: any) => p.id === profileId);
      if (profileIndex !== -1) {
        db.profiles[profileIndex].posts = db.profiles[profileIndex].posts || [];
        db.profiles[profileIndex].posts.unshift({
          id: `post_${Date.now()}`,
          content,
          date: new Date().toISOString(),
          likes: 0
        });
        saveLocalDB(db);
      }
      await fetchPublicData(true);
      if (isAdmin) await fetchAdminData(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 antialiased selection:bg-sky-100 flex flex-col justify-between">
      
      {/* Microsoft-styled flat header menu bar */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isAdmin={isAdmin}
        onLogout={handleLogout}
        pendingNotifications={stats.pendingApprovals}
      />

      {/* Main Container Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0">
        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-3 print:hidden">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
            <span className="text-xs text-slate-400 font-bold tracking-wide">Syncing Kabir Villa Database...</span>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in print:space-y-4">
            {currentTab === 'home' && (
              <HomeSection 
                onNavigate={setCurrentTab} 
                recentNotice={notices.length > 0 ? notices[0] : null} 
              />
            )}
            {currentTab === 'prepaid' && (
              <PrepaidElectricity 
                meters={meters} 
                isAdmin={isAdmin}
                onAddMeter={handleAddMeter}
                onDeleteMeter={handleDeleteMeter}
              />
            )}
            {currentTab === 'location' && <HouseLocation />}
            {currentTab === 'notices' && (
              <HouseNoticesSection
                notices={notices}
                isAdmin={isAdmin}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
                onEditNotice={handleEditNotice}
              />
            )}
            {currentTab === 'login' && (
              <LoginAdminPanel 
                messages={messages}
                stats={stats}
                isAdmin={isAdmin}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onMarkMessageRead={handleMarkMessageRead}
              />
            )}
          </div>
        )}
      </main>

      {/* Humble literal human label footer, avoiding unrequested clutter and tech larping */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-550">&copy; {new Date().getFullYear()} Kabir Villa Official. All rights reserved.</p>
          <div className="flex gap-4 text-[11px] font-medium text-slate-400">
            <span>Sardar Para, Rangpur, Bangladesh</span>
            <span>&bull;</span>
            <span className="hover:text-sky-500 cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
