'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingBag, Cpu, MessageSquare, BarChart3, Database,
  Brain, Layout, Radio, Workflow, Sparkles, PieChart,
  Server, Code, Table, TrendingUp, Search, Eye, Activity,
  GitBranch, ExternalLink, Play
} from 'lucide-react';
import { ProjectDemoDialog } from './ProjectDemoDialog';

const emptySubscribe = () => () => {};

type Category = 'Full-Stack' | 'Data' | 'IA' | 'BI' | 'All';

export interface Project {
  id: number;
  title: string;
  category: Category;
  description: string;
  tech: string[];
  gradient: string;
  icon: React.ReactNode;
  github: string;
}

export const PROJECTS: Project[] = [
  { id: 1, title: 'E-Commerce Platform', category: 'Full-Stack', description: 'Full-featured online marketplace with payment processing, inventory management, and real-time order tracking.', tech: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Stripe'], gradient: 'from-emerald-600 to-teal-600', icon: <ShoppingBag className="w-6 h-6" />, github: 'https://github.com/sekounakaba/ecommerce-platform' },
  { id: 2, title: 'Pipeline ETL Distribué', category: 'Data', description: 'Distributed ETL pipeline processing 10M+ records daily with fault tolerance and auto-scaling.', tech: ['Spark', 'Airflow', 'Kafka', 'Delta Lake', 'AWS'], gradient: 'from-teal-600 to-cyan-600', icon: <Cpu className="w-6 h-6" />, github: 'https://github.com/sekounakaba/etl-pipeline' },
  { id: 3, title: 'Chatbot IA Conversationnel', category: 'IA', description: 'Multi-modal conversational AI chatbot with RAG architecture and context memory.', tech: ['Python', 'LangChain', 'GPT-4', 'FastAPI', 'ChromaDB'], gradient: 'from-cyan-600 to-emerald-600', icon: <MessageSquare className="w-6 h-6" />, github: 'https://github.com/sekounakaba/ai-chatbot' },
  { id: 4, title: 'Dashboard Analytics', category: 'Full-Stack', description: 'Real-time analytics dashboard with interactive visualizations and GraphQL data layer.', tech: ['Next.js', 'D3.js', 'GraphQL', 'PostgreSQL'], gradient: 'from-emerald-600 to-green-600', icon: <BarChart3 className="w-6 h-6" />, github: 'https://github.com/sekounakaba/analytics-dashboard' },
  { id: 5, title: 'Data Lake Architecture', category: 'Data', description: 'Enterprise-grade data lake with automated ingestion, transformation, and governance.', tech: ['AWS S3', 'Glue', 'Athena', 'dbt', 'Terraform'], gradient: 'from-teal-600 to-emerald-600', icon: <Database className="w-6 h-6" />, github: 'https://github.com/sekounakaba/data-lake' },
  { id: 6, title: 'Système de Recommandation', category: 'IA', description: 'ML-powered recommendation engine with real-time personalization and A/B testing.', tech: ['Python', 'TensorFlow', 'Kubernetes', 'MLflow'], gradient: 'from-cyan-600 to-teal-600', icon: <Brain className="w-6 h-6" />, github: 'https://github.com/sekounakaba/recommendation-system' },
  { id: 7, title: 'NeoBoard', category: 'Full-Stack', description: 'Real-time collaborative whiteboard with CRDT-based conflict-free editing.', tech: ['React', 'Go', 'WebSocket', 'CRDT', 'Redis'], gradient: 'from-green-600 to-emerald-600', icon: <Layout className="w-6 h-6" />, github: 'https://github.com/sekounakaba/neoboard' },
  { id: 8, title: 'StreamPulse', category: 'Data', description: 'IoT stream processing platform with MQTT ingestion and real-time alerting.', tech: ['Python', 'MQTT', 'Kafka', 'ClickHouse', 'Grafana'], gradient: 'from-teal-600 to-cyan-600', icon: <Radio className="w-6 h-6" />, github: 'https://github.com/sekounakaba/streampulse' },
  { id: 9, title: 'ChainForge', category: 'IA', description: 'Multi-agent orchestration framework with graph-based workflows and vector search.', tech: ['Python', 'LangGraph', 'OpenAI', 'Anthropic', 'Qdrant'], gradient: 'from-emerald-600 to-cyan-600', icon: <Workflow className="w-6 h-6" />, github: 'https://github.com/sekounakaba/chainforge' },
  { id: 10, title: 'GenAI Studio', category: 'Full-Stack', description: 'SaaS platform for building and deploying AI-powered content generation workflows.', tech: ['Next.js', 'TypeScript', 'Stripe', 'OpenAI', 'Anthropic'], gradient: 'from-cyan-600 to-green-600', icon: <Sparkles className="w-6 h-6" />, github: 'https://github.com/sekounakaba/genai-studio' },
  { id: 11, title: 'DataViz Command Center', category: 'BI', description: 'Unified BI platform consolidating Tableau, Power BI, Metabase, and Superset dashboards.', tech: ['Tableau', 'Power BI', 'Metabase', 'Superset'], gradient: 'from-emerald-500 to-teal-500', icon: <PieChart className="w-6 h-6" />, github: 'https://github.com/sekounakaba/dataviz-command' },
  { id: 12, title: 'MLOps Hub', category: 'IA', description: 'End-to-end ML lifecycle platform with model registry, feature store, and monitoring.', tech: ['Python', 'MLflow', 'Kubeflow', 'Feast', 'Prometheus'], gradient: 'from-teal-500 to-cyan-500', icon: <Server className="w-6 h-6" />, github: 'https://github.com/sekounakaba/mlops-hub' },
  { id: 13, title: 'SmartCode AI', category: 'IA', description: 'AI-powered code analysis tool that detects bugs, suggests optimizations, and auto-documents.', tech: ['Python', 'AST', 'TensorFlow', 'FastAPI', 'GitHub API'], gradient: 'from-cyan-500 to-emerald-500', icon: <Code className="w-6 h-6" />, github: 'https://github.com/sekounakaba/smartcode-ai' },
  { id: 14, title: 'Tableau Sales Analytics', category: 'BI', description: 'Enterprise sales analytics dashboard with drill-down capabilities and automated reports.', tech: ['Tableau Server', 'Snowflake', 'SQL'], gradient: 'from-green-500 to-emerald-500', icon: <Table className="w-6 h-6" />, github: 'https://github.com/sekounakaba/tableau-sales' },
  { id: 15, title: 'Power BI Finance Suite', category: 'BI', description: 'Comprehensive financial reporting suite with forecasting models and regulatory compliance.', tech: ['Power BI', 'DAX', 'Azure Synapse'], gradient: 'from-emerald-500 to-green-500', icon: <TrendingUp className="w-6 h-6" />, github: 'https://github.com/sekounakaba/powerbi-finance' },
  { id: 16, title: 'Metabase Self-Service', category: 'BI', description: 'Self-service analytics platform with natural language query processing.', tech: ['Metabase', 'PostgreSQL', 'NLP Queries'], gradient: 'from-teal-500 to-green-500', icon: <Search className="w-6 h-6" />, github: 'https://github.com/sekounakaba/metabase-selfservice' },
  { id: 17, title: 'Apache Superset Explorer', category: 'BI', description: 'Real-time data exploration platform with Kafka streaming and multi-datasource support.', tech: ['Superset', 'Kafka', 'BigQuery', 'Elasticsearch'], gradient: 'from-cyan-500 to-teal-500', icon: <Eye className="w-6 h-6" />, github: 'https://github.com/sekounakaba/superset-explorer' },
  { id: 18, title: 'Grafana Infra Monitor', category: 'BI', description: 'Full-stack infrastructure monitoring with log aggregation and distributed tracing.', tech: ['Grafana', 'Prometheus', 'Loki', 'Tempo'], gradient: 'from-emerald-600 to-teal-600', icon: <Activity className="w-6 h-6" />, github: 'https://github.com/sekounakaba/grafana-monitor' },
  { id: 19, title: 'dbt Analytics Engineering', category: 'BI', description: 'Analytics engineering platform with data lineage tracking and automated testing.', tech: ['dbt Core', 'Snowflake', 'Data Lineage'], gradient: 'from-teal-600 to-green-600', icon: <GitBranch className="w-6 h-6" />, github: 'https://github.com/sekounakaba/dbt-analytics' },
];

const FILTERS: { label: string; value: Category }[] = [
  { label: 'All', value: 'All' },
  { label: 'Full-Stack', value: 'Full-Stack' },
  { label: 'Data', value: 'Data' },
  { label: 'IA', value: 'IA' },
  { label: 'BI', value: 'BI' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function Projects() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [filter, setFilter] = useState<Category>('All');
  const [demoProject, setDemoProject] = useState<Project | null>(null);

  if (!isClient) return null;

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of 19 projects spanning full-stack development, data engineering, AI, and business intelligence.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className={filter === f.value ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/10'}
            >
              {f.label}
              <span className="ml-2 text-xs opacity-70">
                ({f.value === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f.value).length})
              </span>
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div key={project.id} variants={itemVariants} layout>
                <Card className="glass group hover:glow-border transition-all duration-300 h-full flex flex-col overflow-hidden">
                  {/* Gradient banner */}
                  <div className={`h-24 bg-gradient-to-r ${project.gradient} flex items-center justify-center relative`}>
                    <div className="text-white/20 text-7xl absolute right-4 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500">
                      {project.icon}
                    </div>
                    <div className="relative z-10 text-white flex items-center gap-2">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        {project.icon}
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">{project.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.slice(0, 4).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                      {project.tech.length > 4 && (
                        <Badge variant="secondary" className="text-xs">+{project.tech.length - 4}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/10" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> GitHub
                        </a>
                      </Button>
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setDemoProject(project)}>
                        <Play className="w-3.5 h-3.5 mr-1" /> Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {demoProject && (
        <ProjectDemoDialog project={demoProject} open={!!demoProject} onClose={() => setDemoProject(null)} />
      )}
    </section>
  );
}
