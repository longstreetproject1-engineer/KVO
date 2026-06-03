import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Notice, Meter, FamilyProfile, UserMessage, EmailLog, AdminStats, Post } from './src/types.js';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json());

// Default database template
const defaultDatabase = {
  meters: [
    { id: "1", slNo: "01", name: "Home (1st floor)", customerNo: "12023995", meterNo: "31041045 415", location: "1st Floor Main board" },
    { id: "2", slNo: "02", name: "Home Motor 2nd Meter", customerNo: "19901255", meterNo: "31041052505", location: "Ground floor Pump" },
    { id: "3", slNo: "03", name: "Halima (2nd floor)", customerNo: "12046628", meterNo: "31041042 633", location: "2nd Floor East Appt" },
    { id: "4", slNo: "04", name: "Sobuj (2nd floor)", customerNo: "12046627", meterNo: "31041042 626", location: "2nd Floor West Appt" },
    { id: "5", slNo: "05", name: "Lucky (3rd floor)", customerNo: "12033369", meterNo: "31041042 536", location: "3rd Floor East Appt" },
    { id: "6", slNo: "06", name: "Sumon (3rd floor)", customerNo: "12050351", meterNo: "31041045 409", location: "3rd Floor West Appt" }
  ],
  notices: [
    { id: "n1", title: "Monthly Water Tank Routine Cleaning", content: "Dear tenants, our overhead main water reservoir tanks will undergo routine pressure washing on Friday, June 5th, from 8:00 AM to 1:00 PM. Water supply will be completely suspended during this timeframe. Kindly store ample water for cooking, cleaning, and sanitizing before Friday morning. We apologize for any convenience caused during this maintenance cycle.", date: "2026-06-03", category: "water", priority: "high" },
    { id: "n2", title: "Gas Pipeline Regulatory Safety Checks", content: "Rangpur gas division service technicians will perform safety inspects of gas line hookups and meters across all floors starting Thursday at 10:00 AM. Please ensure adult residents are present to allow entry. Stoves and connections must be in clean, unobstructed conditions before the technician arrives. Safety is our primary concern.", date: "2026-06-02", category: "gas", priority: "medium" },
    { id: "n3", title: "Welcome & House Maintenance Notice", content: "All tenants are requested to kindly complete their monthly rental and utility maintenance contributions on or before the 7th of June. Your timely contribution supports the lift servicing, perimeter security, and cleaning staff wages. Thank you for your continued cooperation in keeping Kabir Villa organized and green.", date: "2026-06-01", category: "rent", priority: "high" }
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
      status: "approved",
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
      status: "approved",
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
      status: "approved",
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
      status: "pending", // Starter pending profile to showcase real-time notification
      photoSeed: 204,
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

// Ensure database file exists
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDatabase, null, 2), 'utf-8');
      return defaultDatabase;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading database:", error);
    return defaultDatabase;
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// REST endpoints
app.get('/api/meters', (req, res) => {
  const db = readDB();
  res.json(db.meters);
});

app.post('/api/meters', (req, res) => {
  const db = readDB();
  const { name, customerNo, meterNo, location } = req.body;
  if (!name || !customerNo || !meterNo) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const slNo = String(db.meters.length + 1).padStart(2, '0');
  const newMeter = {
    id: String(Date.now()),
    slNo,
    name,
    customerNo,
    meterNo,
    location: location || "Assigned Meter board"
  };
  db.meters.push(newMeter);
  writeDB(db);
  res.json(newMeter);
});

app.delete('/api/meters/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.meters = db.meters.filter((m: any) => m.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Notices
app.get('/api/notices', (req, res) => {
  const db = readDB();
  res.json(db.notices);
});

app.post('/api/notices', (req, res) => {
  const db = readDB();
  const { title, content, category, priority } = req.body;
  if (!title || !content || !category || !priority) {
    return res.status(400).json({ error: "Missing notice fields" });
  }
  const newNotice = {
    id: String(Date.now()),
    title,
    content,
    category,
    priority,
    date: new Date().toISOString().split('T')[0]
  };
  db.notices.unshift(newNotice);
  writeDB(db);
  res.json(newNotice);
});

app.delete('/api/notices/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.notices = db.notices.filter((n: any) => n.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Edit Notice (Admin action)
app.put('/api/notices/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { title, content, category, priority } = req.body;
  const noticeIndex = db.notices.findIndex((n: any) => n.id === id);
  if (noticeIndex !== -1) {
    if (title) db.notices[noticeIndex].title = title;
    if (content) db.notices[noticeIndex].content = content;
    if (category) db.notices[noticeIndex].category = category;
    if (priority) db.notices[noticeIndex].priority = priority;
    writeDB(db);
    res.json(db.notices[noticeIndex]);
  } else {
    res.status(404).json({ error: "Notice not found" });
  }
});

// Profiles (Approved only for main feed)
app.get('/api/profiles', (req, res) => {
  const db = readDB();
  const approved = db.profiles.filter((p: any) => p.status === 'approved');
  res.json(approved);
});

// Admin Profiles list (all statuses)
app.get('/api/admin/profiles', (req, res) => {
  const db = readDB();
  res.json(db.profiles);
});

// Application submission (Simulates the Google Form profile registration process)
app.post('/api/profiles/apply', (req, res) => {
  const db = readDB();
  const { name, email, phone, floor, bio, twitterHandle, fbLink } = req.body;
  
  if (!name || !email || !phone || !floor) {
    return res.status(400).json({ error: "Name, email, phone, and floor plan are required details." });
  }

  const existing = db.profiles.find((p: any) => p.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An application with this email address already exists." });
  }

  const newProfile = {
    id: String(Date.now()),
    name,
    email,
    phone,
    floor,
    bio: bio || "New occupant of Sardar Para Kabir Villa.",
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    twitterHandle: twitterHandle || "",
    fbLink: fbLink || "",
    photoSeed: Math.floor(Math.random() * 500) + 1,
    posts: [] as Post[]
  };

  db.profiles.push(newProfile);
  writeDB(db);
  res.json({ success: true, profile: newProfile });
});

// Approve a Profile (Admin action)
app.post('/api/admin/profiles/:id/approve', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const profileIndex = db.profiles.findIndex((p: any) => p.id === id);

  if (profileIndex === -1) {
    return res.status(404).json({ error: "Profile not found." });
  }

  const profile = db.profiles[profileIndex];
  profile.status = 'approved';
  
  // Trigger modern automated email log
  const emailLog: EmailLog = {
    id: `email_${Date.now()}`,
    toEmail: profile.email,
    subject: "✨ Welcome to Kabir Villa Family Portfolio!",
    body: `Assalamualaikum ${profile.name},\n\nWe are absolutely delighted to inform you that your registration for your profile at Kabir Villa has been approved by the building administrator (Ahsan Kabir).\n\nYour interactive social profile is now officially LIVE in our 'Kabir Villa Family' index! Other residents and guests can now see your community posts, floor affiliation, and professional bio.\n\nYou can log in anytime using your registration credentials to share your updates, notice reactions, or security notes.\n\n📍 Kabir Villa Address: Sardar Para, Word 4, Dhap, Hazipara, Rangpur.\n📞 Admin Ahsan Kabir Contact: 01718832646\n\nKind Regards,\nKabir Villa Management System\nRangpur, Bangladesh`,
    date: new Date().toISOString(),
    status: 'success'
  };

  db.emailLogs.unshift(emailLog);
  writeDB(db);
  res.json({ success: true, profile, emailSent: emailLog });
});

// Reject/Suspend Profile (Admin action)
app.post('/api/admin/profiles/:id/reject', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const profileIndex = db.profiles.findIndex((p: any) => p.id === id);

  if (profileIndex === -1) {
    return res.status(404).json({ error: "Profile not found." });
  }

  db.profiles[profileIndex].status = 'rejected';
  writeDB(db);
  res.json({ success: true, profile: db.profiles[profileIndex] });
});

// Add temporary post/social status under approved profile
app.post('/api/profiles/:id/post', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "Content is required to publish a social update." });
  }

  const profileIndex = db.profiles.findIndex((p: any) => p.id === id && p.status === 'approved');
  if (profileIndex === -1) {
    return res.status(404).json({ error: "Approved profile not found." });
  }

  const newPost: Post = {
    id: `post_${Date.now()}`,
    content,
    date: new Date().toISOString(),
    likes: 0
  };

  db.profiles[profileIndex].posts.unshift(newPost);
  writeDB(db);
  res.json(newPost);
});

// Inquiries / Messages
app.get('/api/messages', (req, res) => {
  const db = readDB();
  res.json(db.messages);
});

app.post('/api/messages', (req, res) => {
  const db = readDB();
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please enter your name, email, and message details." });
  }

  const newMessage: UserMessage = {
    id: String(Date.now()),
    name,
    email,
    phone: phone || "Not Provided",
    message,
    date: new Date().toISOString(),
    read: false
  };

  db.messages.unshift(newMessage);
  writeDB(db);
  res.json(newMessage);
});

app.post('/api/messages/:id/read', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const msgIndex = db.messages.findIndex((m: any) => m.id === id);
  if (msgIndex !== -1) {
    db.messages[msgIndex].read = true;
    writeDB(db);
  }
  res.json({ success: true });
});

// Logs of dispatched emails
app.get('/api/admin/emails', (req, res) => {
  const db = readDB();
  res.json(db.emailLogs || []);
});

// Global stats
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  const pendingApprovals = db.profiles.filter((p: any) => p.status === 'pending').length;
  const totalMembers = db.profiles.filter((p: any) => p.status === 'approved').length;
  const totalNotices = db.notices.length;
  const unreadMessages = db.messages.filter((m: any) => !m.read).length;

  const stats: AdminStats = {
    pendingApprovals,
    totalMembers,
    totalNotices,
    unreadMessages
  };
  res.json(stats);
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kabir Villa Server running on http://localhost:${PORT}`);
  });
}

startServer();
