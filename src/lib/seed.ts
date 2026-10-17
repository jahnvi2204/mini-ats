import type { Candidate, DeskState, Job, Note, Source, Stage } from "./types";

function daysAgo(now: Date, days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(9, 20, 0, 0);
  return date.toISOString();
}

function note(id: string, body: string, at: string): Note {
  return { id, body, at };
}

function candidate(input: {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  source: Source;
  location: string;
  experienceYears: number;
  skills: string[];
  rating: number;
  history: [Stage, string][];
  notes?: Note[];
}): Candidate {
  const stageHistory = input.history.map(([stage, at]) => ({ stage, at }));
  const current = stageHistory[stageHistory.length - 1];
  return {
    id: input.id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    jobId: input.jobId,
    source: input.source,
    location: input.location,
    experienceYears: input.experienceYears,
    skills: input.skills,
    rating: input.rating,
    notes: input.notes ?? [],
    stage: current.stage,
    appliedAt: stageHistory[0].at,
    stageHistory,
  };
}

const jobs: Job[] = [
  {
    id: "designer",
    title: "Product Designer",
    department: "Design",
    location: "Bengaluru",
    type: "Full-time",
    openings: 1,
    status: "open",
  },
  {
    id: "backend",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote — India",
    type: "Full-time",
    openings: 2,
    status: "open",
  },
  {
    id: "analyst",
    title: "Data Analyst",
    department: "Analytics",
    location: "Hyderabad",
    type: "Full-time",
    openings: 1,
    status: "open",
  },
  {
    id: "success",
    title: "Customer Success Lead",
    department: "Go-to-market",
    location: "New Delhi",
    type: "Full-time",
    openings: 1,
    status: "open",
  },
  {
    id: "recruiter",
    title: "Technical Recruiter",
    department: "People",
    location: "Mumbai",
    type: "Full-time",
    openings: 1,
    status: "closed",
  },
];

export function buildSeed(now = new Date()): DeskState {
  const on = (days: number) => daysAgo(now, days);

  const candidates: Candidate[] = [
    candidate({
      id: "meera",
      name: "Meera Iyer",
      email: "meera.iyer@example.com",
      phone: "+91 98450 11021",
      jobId: "designer",
      source: "Referral",
      location: "Bengaluru",
      experienceYears: 6,
      skills: ["Figma", "Design systems", "Research"],
      rating: 5,
      history: [
        ["applied", on(45)],
        ["screening", on(43)],
        ["interview", on(29)],
      ],
      notes: [
        note(
          "meera-note",
          "Portfolio review was the strongest this cycle. The panel wants a working session before an offer.",
          on(20),
        ),
      ],
    }),
    candidate({
      id: "arjun",
      name: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      phone: "+91 98220 44118",
      jobId: "backend",
      source: "LinkedIn",
      location: "Pune",
      experienceYears: 5,
      skills: ["Go", "Postgres", "Kafka"],
      rating: 4,
      history: [
        ["applied", on(50)],
        ["screening", on(46)],
        ["interview", on(35)],
        ["offer", on(12)],
      ],
      notes: [
        note(
          "arjun-note",
          "Offer is at the top of band. He is also in a late process with another company.",
          on(12),
        ),
      ],
    }),
    candidate({
      id: "sara",
      name: "Sara Qureshi",
      email: "sara.qureshi@example.com",
      phone: "+91 90080 22145",
      jobId: "analyst",
      source: "Campus",
      location: "Hyderabad",
      experienceYears: 1,
      skills: ["SQL", "Python", "Looker"],
      rating: 4,
      history: [
        ["applied", on(58)],
        ["screening", on(56)],
        ["interview", on(44)],
        ["offer", on(32)],
        ["hired", on(16)],
      ],
      notes: [note("sara-note", "Accepted. Joining in three weeks.", on(16))],
    }),
    candidate({
      id: "rohan",
      name: "Rohan Desai",
      email: "rohan.desai@example.com",
      phone: "+91 98191 33002",
      jobId: "backend",
      source: "Careers page",
      location: "Mumbai",
      experienceYears: 3,
      skills: ["Node", "TypeScript", "AWS"],
      rating: 3,
      history: [
        ["applied", on(8)],
        ["screening", on(4)],
      ],
    }),
    candidate({
      id: "ananya",
      name: "Ananya Krishnan",
      email: "ananya.krishnan@example.com",
      phone: "+91 94440 11880",
      jobId: "designer",
      source: "LinkedIn",
      location: "Chennai",
      experienceYears: 4,
      skills: ["Figma", "Prototyping", "Workshop facilitation"],
      rating: 4,
      history: [["applied", on(2)]],
    }),
    candidate({
      id: "vikram",
      name: "Vikram Shah",
      email: "vikram.shah@example.com",
      phone: "+91 98711 22009",
      jobId: "success",
      source: "Agency",
      location: "New Delhi",
      experienceYears: 7,
      skills: ["Onboarding", "B2B", "Retention"],
      rating: 4,
      history: [
        ["applied", on(39)],
        ["screening", on(37)],
        ["interview", on(19)],
      ],
      notes: [
        note(
          "vikram-note",
          "Agency follow-up is overdue. Need a decision after the customer round.",
          on(11),
        ),
      ],
    }),
    candidate({
      id: "priya",
      name: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91 98200 77411",
      jobId: "recruiter",
      source: "Referral",
      location: "Mumbai",
      experienceYears: 4,
      skills: ["Technical hiring", "Stakeholder management"],
      rating: 5,
      history: [
        ["applied", on(66)],
        ["screening", on(64)],
        ["interview", on(53)],
        ["offer", on(43)],
        ["hired", on(29)],
      ],
      notes: [note("priya-note", "Joined and closed the recruiter requisition.", on(29))],
    }),
    candidate({
      id: "kabir",
      name: "Kabir Malhotra",
      email: "kabir.malhotra@example.com",
      phone: "+91 98860 14520",
      jobId: "backend",
      source: "LinkedIn",
      location: "Bengaluru",
      experienceYears: 2,
      skills: ["Java", "Spring"],
      rating: 2,
      history: [
        ["applied", on(42)],
        ["screening", on(39)],
        ["rejected", on(36)],
      ],
      notes: [
        note("kabir-note", "Scope was a stretch for the seniority this role needs.", on(36)),
      ],
    }),
    candidate({
      id: "leela",
      name: "Leela Thomas",
      email: "leela.thomas@example.com",
      phone: "+91 97440 22881",
      jobId: "analyst",
      source: "Careers page",
      location: "Kochi",
      experienceYears: 3,
      skills: ["SQL", "dbt", "Tableau"],
      rating: 4,
      history: [
        ["applied", on(13)],
        ["screening", on(10)],
      ],
    }),
    candidate({
      id: "dev",
      name: "Dev Patel",
      email: "dev.patel@example.com",
      phone: "+91 99090 44127",
      jobId: "success",
      source: "LinkedIn",
      location: "Ahmedabad",
      experienceYears: 2,
      skills: ["Support", "CRM"],
      rating: 3,
      history: [["applied", on(3)]],
    }),
    candidate({
      id: "ishaan",
      name: "Ishaan Gupta",
      email: "ishaan.gupta@example.com",
      phone: "+91 98100 55221",
      jobId: "backend",
      source: "Referral",
      location: "Jaipur",
      experienceYears: 6,
      skills: ["Go", "Distributed systems"],
      rating: 5,
      history: [
        ["applied", on(31)],
        ["screening", on(29)],
        ["interview", on(11)],
      ],
    }),
    candidate({
      id: "nisha",
      name: "Nisha Banerjee",
      email: "nisha.banerjee@example.com",
      phone: "+91 98300 11842",
      jobId: "designer",
      source: "Agency",
      location: "Kolkata",
      experienceYears: 8,
      skills: ["Product design", "Brand", "Leadership"],
      rating: 4,
      history: [
        ["applied", on(48)],
        ["screening", on(45)],
        ["interview", on(27)],
        ["offer", on(7)],
      ],
      notes: [note("nisha-note", "Asked for a week to review the written offer.", on(7))],
    }),
    candidate({
      id: "farhan",
      name: "Farhan Ali",
      email: "farhan.ali@example.com",
      phone: "+91 93350 22910",
      jobId: "analyst",
      source: "Campus",
      location: "Lucknow",
      experienceYears: 0,
      skills: ["Excel", "SQL"],
      rating: 2,
      history: [
        ["applied", on(25)],
        ["screening", on(23)],
        ["rejected", on(18)],
      ],
    }),
    candidate({
      id: "tara",
      name: "Tara Menon",
      email: "tara.menon@example.com",
      phone: "+91 98450 66720",
      jobId: "success",
      source: "Careers page",
      location: "Bengaluru",
      experienceYears: 5,
      skills: ["Enterprise CS", "QBRs"],
      rating: 5,
      history: [
        ["applied", on(60)],
        ["screening", on(57)],
        ["interview", on(45)],
        ["offer", on(31)],
        ["hired", on(11)],
      ],
      notes: [note("tara-note", "Accepted the Delhi lead seat.", on(11))],
    }),
    candidate({
      id: "aditya",
      name: "Aditya Rao",
      email: "aditya.rao@example.com",
      phone: "+91 97000 31884",
      jobId: "backend",
      source: "LinkedIn",
      location: "Hyderabad",
      experienceYears: 4,
      skills: ["Python", "Django", "Redis"],
      rating: 3,
      history: [["applied", on(1)]],
    }),
    candidate({
      id: "sana",
      name: "Sana Kapoor",
      email: "sana.kapoor@example.com",
      phone: "+91 98810 77330",
      jobId: "designer",
      source: "Campus",
      location: "Pune",
      experienceYears: 1,
      skills: ["UI", "Illustration", "Figma"],
      rating: 3,
      history: [
        ["applied", on(11)],
        ["screening", on(6)],
      ],
    }),
    candidate({
      id: "harsh",
      name: "Harsh Vardhan",
      email: "harsh.vardhan@example.com",
      phone: "+91 98111 90442",
      jobId: "backend",
      source: "Agency",
      location: "Noida",
      experienceYears: 9,
      skills: ["Platform", "Mentorship", "Go"],
      rating: 4,
      history: [
        ["applied", on(46)],
        ["screening", on(44)],
        ["interview", on(25)],
      ],
      notes: [
        note(
          "harsh-note",
          "Systems round was strong. Still waiting on a hiring-manager slot.",
          on(14),
        ),
      ],
    }),
    candidate({
      id: "diya",
      name: "Diya Sharma",
      email: "diya.sharma@example.com",
      phone: "+91 99580 22176",
      jobId: "analyst",
      source: "Referral",
      location: "New Delhi",
      experienceYears: 2,
      skills: ["SQL", "Excel", "Statistics"],
      rating: 4,
      history: [["applied", on(5)]],
    }),
    candidate({
      id: "omar",
      name: "Omar Siddiqui",
      email: "omar.siddiqui@example.com",
      phone: "+91 98201 66380",
      jobId: "success",
      source: "LinkedIn",
      location: "Mumbai",
      experienceYears: 3,
      skills: ["Support", "Renewals"],
      rating: 2,
      history: [
        ["applied", on(35)],
        ["screening", on(32)],
        ["interview", on(21)],
        ["rejected", on(15)],
      ],
    }),
    candidate({
      id: "rhea",
      name: "Rhea D'Souza",
      email: "rhea.dsouza@example.com",
      phone: "+91 97640 11823",
      jobId: "recruiter",
      source: "LinkedIn",
      location: "Goa",
      experienceYears: 3,
      skills: ["Sourcing", "Outreach"],
      rating: 3,
      history: [
        ["applied", on(27)],
        ["screening", on(24)],
        ["rejected", on(14)],
      ],
      notes: [
        note("rhea-note", "Role was filled before the final conversation.", on(14)),
      ],
    }),
  ];

  return { jobs, candidates };
}
