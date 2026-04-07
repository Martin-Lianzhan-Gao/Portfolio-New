
interface WorkData {
    title: string;
    date: {
        startDate: number;
        endDate: number;
    },
    position: string;
    type: string;
    techStack: string[];
}

export const worksData: WorkData[] = [
    {
        title: "Mind Mail",
        date: {
            startDate: 2025,
            endDate: 2026
        },
        position: "Full Stack Developer",
        type: "Self Project",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI", "Lucide react", "Axios", 'tRPC', 'PostgreSQL', 'Prisma', 'Vercel', 'Zod', 'Neon Console', 'OAuth', 'Framer Motion', 'Gemini AI API']
    },
    {
        title: "Evergreen",
        date: {
            startDate: 2024,
            endDate: 2024
        },
        position: "Front End Developer",
        type: "Contractor",
        techStack: ["React", "JavaScript", "PHP", "Framer Motion"]
    },
    {
        title: "Easygo",
        date: {
            startDate: 2022,
            endDate: 2024
        },
        position: "Front End Developer",
        type: "Entrepreneurship",
        techStack: ["React", "JavaScript", "Axios", "Fetch API", "SASS", "MongoDB", "Node.js"]
    },
    {
        title: "SAP",
        date: {
            startDate: 2021,
            endDate: 2022
        },
        position: "Software Engineer & Project Management Intern",
        type: "Internship",
        techStack: ["JavaScript", "SAP OData", "CloudFoundry", "SQL"]
    }
]