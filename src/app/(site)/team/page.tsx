import type { Metadata } from "next";
import { CtaCard } from '@/components/ui/cta-card';

export const metadata: Metadata = {
  title: "Team | LAWgic",
  description: "Meet the team behind LAWgic.",
};

const teamMembers = [
  {
    name: "Aniket Raj",
    role: "Creative Lead",
    github: "https://github.com/theaniketraj/",
    linkedin: "https://www.linkedin.com/in/theaniketraj/",
    contributions: [
      "Built the React components",
      "Implemented responsive CSS layouts",
      "Ensured accessibility compliance",
    ],
  },
  {
    name: "Falguni Mathur",
    role: "Head of Development",
    github: "https://github.com/Falguni35/",
    linkedin: "https://www.linkedin.com/in/falguni-mathur/",
    contributions: [
      "Set up the Node.js server",
      "Created RESTful APIs",
      "Managed database schemas",
    ],
  },
  {
    name: "Piyush Pratap Singh",
    role: "Project Lead",
    github: "https://github.com/piyushsingh67/",
    linkedin: "https://www.linkedin.com/in/piyushpratapsingh9124/",
    contributions: [
      "Worked on core architecture",
      "Designed the AI integration pipeline",
      "Managed the project schedule",
    ],
  },
  {
    name: "Shahbaz Ansari",
    role: "Data Trainer",
    github: "https://github.com/Shahbaz9832/",
    linkedin: "https://www.linkedin.com/in/shahbaz-ansari-dev/",
    contributions: [
      "Trained the initial models",
      "Fine-tuned NLP responses",
      "Evaluated model accuracy",
    ],
  },
  {
    name: "Souptik Roy",
    role: "UI/UX Designer",
    github: "https://github.com/Souptik-Roy/",
    linkedin: "https://www.linkedin.com/in/souptik-roy-95601926b/",
    contributions: [
      "Created wireframes in Figma",
      "Defined the color palette and typography",
      "Conducted user testing",
    ],
  },
];

export default function TeamPage() {
  return (
    <div className="pt-24 pb-20 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-purple-500/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-500/10 text-primary-500 text-sm font-semibold mb-4 border border-primary-500/20">
            The Minds Behind LAWgic
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Meet Our <span className="text-primary-500">Team</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We are a group of 5 passionate students dedicated to bridging the
            gap between cutting-edge AI and the Indian Judiciary system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {teamMembers.map((member, index) => {
            const cardBackgrounds = [
              "bg-[#2D0B70]",
              "bg-primary-500",
              "benefits-bg",
            ];
            const bgClass = cardBackgrounds[index % 3];

            return (
              <div
                key={index}
                className={`group relative flex flex-col h-full ${bgClass} rounded-[20px] p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              >
                {/* Card Background Effects */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {member.name}
                      </h3>
                      <div className="inline-block py-1 px-3 bg-white/20 rounded-full text-white text-xs font-semibold backdrop-blur-md border border-white/30">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 grow">
                    {member.contributions.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-white/90 text-sm"
                      >
                        <span className="mt-1 shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                          <i className="fas fa-check text-[8px] text-white"></i>
                        </span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-3 pt-6 border-t border-white/20">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white hover:text-gray-900 transition-colors border border-white/20"
                    >
                      <i className="fab fa-github text-lg"></i>
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-[#0A66C2] hover:text-white transition-colors border border-white/20 hover:border-[#0A66C2]"
                    >
                      <i className="fab fa-linkedin-in text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 relative z-10">
          <CtaCard 
            title="Work with the Best Tools"
            description="Our team built LAWgic so you can build stronger cases. Start using our AI assistant today."
            backgroundClass="bg-linear-to-br from-slate-800 to-blue-900 shadow-slate-500/20"
          />
        </div>
      </div>
    </div>
  );
}
