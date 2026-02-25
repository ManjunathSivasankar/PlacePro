/**
 * Service to fetch demo data from free APIs
 */

// Get a random avatar based on uid or random seed
export const getRandomAvatar = (seed) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || Math.random()}`;
};

// Get a career advice tip
export const getCareerTip = async () => {
  const tips = [
    "Highlight your projects' impact with quantifiable metrics on your resume.",
    "Practice mock interviews focusing on both technical and behavioral aspects.",
    "Maintain a clean and professional LinkedIn profile to attract recruiters.",
    "Consistent coding practice on platforms like LeetCode and CodeChef is key.",
    "Always research the company's culture and products before your interview.",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

// Get demo announcements
export const getAnnouncements = async () => {
  // Instead of fetching random lorem ipsum from jsonplaceholder,
  // we provide meaningful placement-related announcements.
  return [
    {
      id: 1,
      title: "Google APAC 2026 Registration Open",
      date: "Today",
      body: "Registration for the annual APAC recruitment drive is now open. Eligible students from CS/IT branches can apply via the portal before March 10th.",
    },
    {
      id: 2,
      title: "Interview Workshop: Mastering System Design",
      date: "Tomorrow",
      body: "Join our expert-led session on System Design interview patterns. Essential for students targeting Tier-1 product companies.",
    },
    {
      id: 3,
      title: "Resume Review Deadline Extension",
      date: "Today",
      body: "The deadline for the initial resume verification has been extended to Friday. Please ensure your latest Base64 PDF is uploaded.",
    },
  ];
};

// Get featured jobs for demo
export const getFeaturedJobs = () => {
  return [
    {
      id: "demo-1",
      title: "Software Engineer - AI/ML",
      location: "Bangalore, India",
      eligibility: "B.Tech CS/IT (7.5+ CGPA)",
      description:
        "Join our cutting-edge AI team to build the future of agentic AI. Expertise in Python and PyTorch preferred.",
      lastDate: { seconds: Math.floor(Date.now() / 1000) + 86400 * 5 },
    },
    {
      id: "demo-2",
      title: "Full Stack Developer",
      location: "Remote",
      eligibility: "Open to All Degrees",
      description:
        "Build scalable web applications using React, Node.js, and Firestore. Must have a strong portfolio.",
      lastDate: { seconds: Math.floor(Date.now() / 1000) + 86400 * 10 },
    },
    {
      id: "demo-3",
      title: "Data Analyst",
      location: "Hyderabad, India",
      eligibility: "B.Sc/B.Tech (Good Analytical Skills)",
      description:
        "Turn data into actionable insights for our Fortune 500 clients. Proficiency in SQL and Tableau is a plus.",
      lastDate: { seconds: Math.floor(Date.now() / 1000) + 86400 * 3 },
    },
  ];
};
