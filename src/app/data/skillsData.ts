interface SkillCategory {
    title: string;
    introduction: {
        cn: string;
        en: string;
    };
    skills: string[];
}

export const skillsData: SkillCategory[] = [
    {
        title: "Core Frontend",
        introduction: {
            cn: "深耕 React 生态系统，专注于构建响应式、高性能且类型安全的 Web 应用。具备处理工业级 SaaS 复杂业务逻辑与现代高交互需求的核心能力。",
            en: "Architecting responsive, high-performance, and type-safe web applications within the React ecosystem. Expertly equipped to handle both industrial-grade SaaS development and sophisticated modern interaction requirements."
        },
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI", "Radix UI", "Axios"]
    },
    {
        title: "Creative & Interactive",
        introduction: {
            cn: "提升 Web 视觉维度的核心技能。通过 3D 渲染和细腻的动画效果，将静态页面转化为沉浸式的数字体验，在极致性能与视觉冲击力之间取得精确平衡。",
            en: "Elevating the visual dimension of the web through 3D rendering and nuanced animations. Transforming static pages into immersive digital experiences while maintaining a precise balance between performance and visual impact."
        },
        skills: ["Three.js", "WebGL", "GSAP", "Framer Motion", "Blender"]
    },
    {
        title: "Backend & Infrastructure",
        introduction: {
            cn: "稳健且可扩展的服务端工具箱。利用类型驱动的开发模式确保数据流的严谨性，并结合现代云基础设施保障服务的稳定部署。灵活适配多种后端架构模式。",
            en: "A robust and scalable server-side toolkit. Leveraging type-driven development to ensure data integrity, coupled with modern cloud infrastructure for stable deployment—highly adaptable across various backend architectures."
        },
        skills: ["Node.js", "Python", "PostgreSQL", "Prisma", "tRPC", "Zod", "REST APIs", "AWS", "GCP", "Vercel"]
    },
    {
        title: "Workflow & Engineering",
        introduction: {
            cn: "整合多种工程化技能，构建一套完备、高效且即插即用的开发与自动化引擎。",
            en: "A comprehensive, plug-and-play engineering engine designed to streamline development and automation through a diverse and integrated toolset."
        },
        skills: ["Git", "GitHub Actions", "Docker", "CI/CD", "Linux", "Figma", "Claude Code / Codex", "Agile"]
    }
];