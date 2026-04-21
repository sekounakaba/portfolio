'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Globe, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emptySubscribe = () => () => {};

export default function Contact() {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { toast } = useToast();
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  if (!isClient) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setFormState('sending');
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormState('sent');
    toast({ title: 'Message sent successfully!', description: 'Thank you for reaching out.' });
    setTimeout(() => {
      setFormState('idle');
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Contact</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interested in collaborating or have a project in mind? Let&apos;s connect!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="glass">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-600/10">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:kaba.sekouna@gmail.com" className="font-medium hover:text-emerald-400 transition-colors">
                      kaba.sekouna@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-600/10">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href="tel:+33681822841" className="font-medium hover:text-emerald-400 transition-colors">
                      +33 6 81 82 28 41
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-600/10">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">17 Rue Gaston Monmousseau</p>
                    <p className="text-sm text-muted-foreground">93100 Montreuil, France</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-600/10">
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <a href="https://datasphereinnovation.fr" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-emerald-400 transition-colors">
                      DataSphere Innovation
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card className="glass overflow-hidden h-48">
              <div className="w-full h-full bg-gradient-to-br from-emerald-600/10 to-teal-600/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Montreuil, France</p>
                  <p className="text-xs text-muted-foreground/50">93100</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-strong">
              <CardContent className="p-6">
                {formState === 'sent' ? (
                  <div className="text-center py-12 space-y-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                      <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">Message Sent!</h3>
                    <p className="text-muted-foreground">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="bg-black/20 border-emerald-600/20 focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="bg-black/20 border-emerald-600/20 focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        className="bg-black/20 border-emerald-600/20 focus:border-emerald-600 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={formState === 'sending'}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {formState === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" /> Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
