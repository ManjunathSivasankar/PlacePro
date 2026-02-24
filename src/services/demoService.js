/**
 * Service to fetch demo data from free APIs
 */

// Get a random avatar based on uid or random seed
export const getRandomAvatar = (seed) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || Math.random()}`;
};

// Get a career advice tip
export const getCareerTip = async () => {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
    return data.slip.advice;
  } catch (error) {
    console.error("Error fetching career tip:", error);
    return "Keep learning and stay curious!";
  }
};

// Get demo announcements
export const getAnnouncements = async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=3",
    );
    const data = await response.json();
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      date: "Today",
      body: item.body.substring(0, 100) + "...",
    }));
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [
      {
        id: 1,
        title: "Upcoming Placement Drive: TechCorp",
        date: "Feb 25, 2026",
        body: "TechCorp is visiting for Software Engineer roles...",
      },
    ];
  }
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
