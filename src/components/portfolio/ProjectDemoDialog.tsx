'use client';

import { useEffect, useRef, useState, useSyncExternalStore, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Play, Pause, RotateCcw, Activity, Zap, TrendingUp } from 'lucide-react';
import type { Project } from './Projects';

const emptySubscribe = () => () => {};

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#22d3ee', '#34d399', '#6ee7b7'];

function generateTimeSeriesData(points: number) {
  const data = [];
  let value = 50;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * 10;
    value = Math.max(10, Math.min(100, value));
    data.push({ time: `T${i}`, value: Math.round(value * 10) / 10 });
  }
  return data;
}

function generateBarData() {
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return categories.map((c) => ({
    name: c,
    revenue: Math.round(3000 + Math.random() * 7000),
    users: Math.round(200 + Math.random() * 800),
  }));
}

function generatePieData() {
  return [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 15 },
    { name: 'API', value: 10 },
  ];
}

function generateMetricStream() {
  return {
    cpu: Math.round(30 + Math.random() * 60),
    memory: Math.round(40 + Math.random() * 50),
    requests: Math.round(100 + Math.random() * 900),
  };
}

interface DemoContentProps {
  project: Project;
}

function EcommerceDemo() {
  const [data, setData] = useState(() => generateTimeSeriesData(20));
  const [barData] = useState(() => generateBarData());
  const [pieData] = useState(() => generatePieData());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStream = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setData((prev) => {
        const next = [...prev];
        const last = next[next.length - 1].value;
        const newVal = last + (Math.random() - 0.48) * 10;
        next.push({ time: `T${next.length}`, value: Math.round(Math.max(10, Math.min(100, newVal)) * 10) / 10 });
        return next.slice(-20);
      });
    }, 1000);
  }, []);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startStream();
    return () => stopStream();
  }, [startStream, stopStream]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Badge className="bg-emerald-600/20 text-emerald-400">Live Data Stream</Badge>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={stopStream}><Pause className="w-3 h-3" /></Button>
          <Button size="sm" variant="outline" onClick={startStream}><Play className="w-3 h-3" /></Button>
          <Button size="sm" variant="outline" onClick={() => setData(generateTimeSeriesData(20))}><RotateCcw className="w-3 h-3" /></Button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #10b98140', borderRadius: 8 }} />
          <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #10b98140', borderRadius: 8 }} />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name }) => name}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #10b98140', borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DataPipelineDemo() {
  const [metrics, setMetrics] = useState(() => generateMetricStream());
  const [running, setRunning] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setMetrics(generateMetricStream());
        setLogs((prev) => {
          const types = ['INFO', 'WARN', 'DEBUG'];
          const messages = [
            'Processing batch #1024',
            'Spark job completed in 2.3s',
            'Kafka lag: 0 messages',
            'Airflow DAG success: etl_daily',
            'Delta Lake checkpoint saved',
            'Schema validation passed',
          ];
          const type = types[Math.floor(Math.random() * types.length)];
          const msg = messages[Math.floor(Math.random() * messages.length)];
          return [...prev.slice(-8), `[${type}] ${msg}`];
        });
      }, 1200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge className={running ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}>
          <Activity className="w-3 h-3 mr-1" /> {running ? 'Running' : 'Paused'}
        </Badge>
        <Button size="sm" variant="outline" onClick={() => setRunning(!running)}>
          {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'CPU', value: `${metrics.cpu}%`, color: metrics.cpu > 70 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'Memory', value: `${metrics.memory}%`, color: metrics.memory > 70 ? 'text-red-400' : 'text-teal-400' },
          { label: 'Req/s', value: metrics.requests.toString(), color: 'text-cyan-400' },
        ].map((m) => (
          <div key={m.label} className="glass rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-black/40 rounded-lg p-3 font-mono text-xs max-h-32 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className={`py-0.5 ${log.includes('WARN') ? 'text-yellow-400' : log.includes('ERROR') ? 'text-red-400' : 'text-emerald-400/70'}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatbotDemo() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: 'Hello! I\'m an AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const responses = [
    'I can help you analyze your data pipelines. Would you like to start?',
    'Great question! Let me search through our knowledge base for that.',
    'Based on the latest data, your Spark jobs are running 23% faster than last week.',
    'I\'ve found 3 optimization opportunities in your Airflow DAGs.',
    'Your recommendation model accuracy has improved to 94.2%.',
  ];

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 800);
  };

  return (
    <div className="space-y-3">
      <div className="bg-black/40 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'glass'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-black/40 rounded-lg px-3 py-2 text-sm outline-none border border-emerald-600/30 focus:border-emerald-600"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={send}>Send</Button>
      </div>
    </div>
  );
}

function GenericDemo({ project }: DemoContentProps) {
  const [data, setData] = useState(() => generateTimeSeriesData(15));
  const [counter, setCounter] = useState(0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Performance', value: '98.5%', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
          { label: 'Uptime', value: '99.9%', icon: <Activity className="w-4 h-4 text-teal-400" /> },
          { label: 'Interactions', value: counter.toString(), icon: <TrendingUp className="w-4 h-4 text-cyan-400" /> },
        ].map((m) => (
          <div key={m.label} className="glass rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">{m.icon}<span className="text-xs text-muted-foreground">{m.label}</span></div>
            <div className="text-xl font-bold text-emerald-400">{m.value}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #10b98140', borderRadius: 8 }} />
          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setCounter((c) => c + 1); setData(generateTimeSeriesData(15)); }}>
        Simulate Interaction
      </Button>
    </div>
  );
}

interface ProjectDemoDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export function ProjectDemoDialog({ project, open, onClose }: ProjectDemoDialogProps) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!isClient) return null;

  const renderDemo = () => {
    if (project.id === 1 || project.id === 10) return <EcommerceDemo />;
    if (project.id === 2 || project.id === 5 || project.id === 8 || project.id === 18) return <DataPipelineDemo />;
    if (project.id === 3) return <ChatbotDemo />;
    return <GenericDemo project={project} />;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-emerald-600/20">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${project.gradient} text-white`}>
              {project.icon}
            </div>
            <div>
              <DialogTitle className="text-xl">{project.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{project.category} Project</p>
            </div>
          </div>
        </DialogHeader>
        <Separator className="bg-emerald-600/20" />
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-emerald-400 mb-3">Interactive Demo</h4>
          {renderDemo()}
        </div>
        <div className="mt-4">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
