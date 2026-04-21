'use client';

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Code, Database, Brain, BarChart3, Cloud, GraduationCap } from 'lucide-react';

const emptySubscribe = () => () => {};

interface TimelineItem {
  period: string;
  title: string;
  company: string;
  description: string;
  tech?: string[];
}

const TIMELINE: TimelineItem[] = [
  {
    period: '2023 - Present',
    title: 'Data Architect & AI Engineer',
    company: 'DataSphere Innovation',
    description: 'Designing data architectures, building AI solutions, and leading data transformation projects for enterprise clients.',
    tech: ['Snowflake', 'Spark', 'LangChain', 'GPT-4', 'Airflow', 'dbt'],
  },
  {
    period: '2020 - 2023',
    title: 'Data Engineer & Full-Stack Developer',
    company: 'Freelance',
    description: 'Built end-to-end data pipelines, real-time analytics platforms, and web applications for multiple clients across Europe.',
    tech: ['Kafka', 'Go', 'React', 'AWS', 'PostgreSQL', 'Docker'],
  },
  {
    period: '2017 - 2020',
    title: 'Full-Stack Developer',
    company: 'Tech Consulting',
    description: 'Developed scalable web applications, REST APIs, and microservices architecture for various business domains.',
    tech: ['Node.js', 'Python', 'React', 'MongoDB', 'Kubernetes', 'GraphQL'],
  },
  {
    period: '2014 - 2017',
    title: 'Software Developer',
    company: 'IT Services',
    description: 'Started career in software development, building business applications and learning data engineering fundamentals.',
    tech: ['Java', 'SQL', 'JavaScript', 'Oracle', 'Spring Boot'],
  },
];

interface SkillCategory {
  icon: React.ReactNode;
  title: string;
  skills: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    icon: <Code className="w-5 h-5 text-emerald-400" />,
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    icon: <Briefcase className="w-5 h-5 text-teal-400" />,
    title: 'Backend',
    skills: ['Node.js', 'Python', 'Go', 'Java', 'FastAPI', 'GraphQL'],
  },
  {
    icon: <Database className="w-5 h-5 text-cyan-400" />,
    title: 'Data',
    skills: ['Spark', 'Kafka', 'Airflow', 'dbt', 'Snowflake', 'BigQuery'],
  },
  {
    icon: <Brain className="w-5 h-5 text-emerald-400" />,
    title: 'IA/ML',
    skills: ['TensorFlow', 'PyTorch', 'LangChain', 'OpenAI', 'Anthropic', 'MLflow'],
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-teal-400" />,
    title: 'BI',
    skills: ['Tableau', 'Power BI', 'Metabase', 'Apache Superset', 'Grafana', 'DAX'],
  },
  {
    icon: <Cloud className="w-5 h-5 text-cyan-400" />,
    title: 'Cloud/DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!isClient) return null;

  return (
    <section id="about" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About & Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With over 11 years in IT, I bring deep expertise in full-stack development, data engineering,
            and AI. Currently leading innovation at DataSphere Innovation.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-8 mb-20"
        >
          {TIMELINE.map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="relative pl-8 border-l-2 border-emerald-500/30">
              <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">{item.period}</Badge>
                    <span className="text-sm text-muted-foreground">{item.company}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  {item.tech && (
                    <div className="flex flex-wrap gap-2">
                      {item.tech.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="gradient-text">Technical Skills</span>
          </h3>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <GraduationCap className="w-5 h-5" />
            <span>Expertise across the full data and development stack</span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SKILL_CATEGORIES.map((cat) => (
            <motion.div key={cat.title} variants={itemVariants}>
              <Card className="glass hover:glow-border transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {cat.icon}
                    <h4 className="text-lg font-semibold">{cat.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs bg-emerald-600/10 text-emerald-300 border-emerald-600/20 hover:bg-emerald-600/20 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
