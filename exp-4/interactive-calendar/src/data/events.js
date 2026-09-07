const platforms = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "Twitter",
];

const statuses = [
  "Scheduled",
  "Draft",
  "Published",
];

const eventTitles = [
  "Product Launch",
  "Weekly Update",
  "New Feature Announcement",
  "Marketing Campaign",
  "Customer Story",
  "Technology Update",
  "Company Announcement",
  "Industry News",
  "Product Promotion",
  "AI Insights",
];

const descriptions = [
  "Social media promotional content",
  "Weekly company communication",
  "Latest product and technology update",
  "Marketing campaign content",
  "Important announcement for followers",
];

const events = [];

for (let i = 1; i <= 80; i++) {
  const day = ((i - 1) % 28) + 1;

  const date = `2026-09-${String(day).padStart(2, "0")}`;

  const hour = 9 + (i % 10);

  const minute = i % 2 === 0 ? "00" : "30";

  events.push({
    id: i,
    title: `${eventTitles[i % eventTitles.length]} ${i}`,
    date: date,
    time: `${hour}:${minute} ${hour >= 12 ? "PM" : "AM"}`,
    platform: platforms[i % platforms.length],
    status: statuses[i % statuses.length],
    description:
      descriptions[(i - 1) % descriptions.length],
  });
}

export default events;