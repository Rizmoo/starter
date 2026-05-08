import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Link } from '@inertiajs/react';
import { 
  ArrowRight, Zap, Shield, TrendingUp, 
  CheckCircle2, Rocket, Layout, 
  Globe, Users, Clock, Sparkles
} from 'lucide-react';

export default function Welcome() {
  return (
    <GuestLayout title="BizFlow - All-in-One Business Management">
      <div className="relative isolate overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>The future of business is here</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                  Master Your <span className="text-primary italic">Process.</span> <br />
                  Grow Your <span className="text-secondary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Business.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Automate the mundane, focus on the exceptional. BizFlow gives you the tools to manage your team, track your finances, and scale your operations without the friction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-md font-bold shadow-xl shadow-primary/20 group">
                      Get Started Free <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-md font-bold border-2">
                      View Demo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 pt-4 grayscale opacity-60">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trusted by teams at</div>
                  <div className="flex items-center gap-4">
                    <Rocket className="h-5 w-5" />
                    <Globe className="h-5 w-5" />
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </div>
              
              <div className="relative lg:ml-10 animate-in fade-in slide-in-from-right duration-700">
                <div className="relative z-10 w-full rounded-2xl border border-border bg-card/50 shadow-2xl overflow-hidden aspect-[4/3] group cursor-pointer lg:scale-110">
                  <img 
                    src="/images/hero_dashboard.png" 
                    alt="BizFlow Dashboard" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-card border border-border p-4 rounded-xl shadow-xl hidden sm:block animate-bounce-subtle">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-bold">Growth Rate</div>
                      <div className="text-lg font-bold">+124.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features/Bento Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Powerful Core</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">Everything You Need to Win</h3>
              <p className="text-lg text-muted-foreground">
                Stop juggling multiple tools. We've integrated the essentials into one unified experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Real-time Analytics', 
                  desc: 'Deep dives into your data with live-updating charts and customizable reporting engines.',
                  icon: TrendingUp,
                  color: 'bg-blue-500/10 text-blue-500'
                },
                { 
                  title: 'Enterprise Security', 
                  desc: 'Multi-factor authentication, end-to-end encryption, and automated audit logging.',
                  icon: Shield,
                  color: 'bg-green-500/10 text-green-500'
                },
                { 
                  title: 'Team Collaboration', 
                  desc: 'Contextual commenting, shared task boards, and multi-tenant user permissions.',
                  icon: Users,
                  color: 'bg-purple-500/10 text-purple-500'
                },
                { 
                  title: 'Global Payments', 
                  desc: 'Manage invoicing and accept payments in 135+ currencies with local compliance.',
                  icon: Globe,
                  color: 'bg-amber-500/10 text-amber-500'
                },
                { 
                  title: 'Smart Automation', 
                  desc: 'Zapier-like workflows built directly into your business processes. No code required.',
                  icon: Zap,
                  color: 'bg-red-500/10 text-red-500'
                },
                { 
                  title: 'Custom Dashboards', 
                  desc: 'Drag and drop widgets to build the specific view your team needs to function.',
                  icon: Layout,
                  color: 'bg-indigo-500/10 text-indigo-500'
                }
              ].map((f, i) => (
                <Card key={i} className="group hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md border-border/60 bg-card">
                  <CardContent className="pt-8 space-y-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.color} shadow-inner`}>
                      <f.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold">{f.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section id="testimonials" className="py-24">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <h3 className="text-4xl font-extrabold tracking-tight">Built by scaling teams, for scaling teams</h3>
                <p className="text-lg text-muted-foreground italic">
                  "BizFlow transformed how we track our global sales operations. What used to take hours of manual data entry now happens automatically in the background. It's the brain of our company."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-muted border-2 border-primary overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=random" alt="User" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Jane Doe</div>
                    <div className="text-sm text-muted-foreground">CTO, RocketShip Inc.</div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                <Card className="bg-primary p-8 text-primary-foreground transform lg:-rotate-2 hover:rotate-0 transition-transform">
                  <div className="text-5xl font-extrabold mb-1">50k+</div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">Daily Active Users</div>
                </Card>
                <Card className="bg-card p-8 border-border transform lg:rotate-3 hover:rotate-0 transition-transform">
                  <div className="text-5xl font-extrabold mb-1">99.9%</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Uptime SLA</div>
                </Card>
                <Card className="bg-card p-8 border-border transform lg:-translate-y-4 hover:translate-y-0 transition-transform">
                  <div className="text-5xl font-extrabold mb-1">200+</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Integrations</div>
                </Card>
                <Card className="bg-secondary p-8 text-secondary-foreground transform lg:rotate-1 hover:rotate-0 transition-transform">
                  <div className="text-5xl font-extrabold mb-1">15+</div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">Global Awards</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section id="pricing" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="container px-4 mx-auto relative z-10 text-center space-y-10">
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight">Ready to Flow?</h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join 12,000+ businesses that have upgraded their workflow this year. <br className="hidden md:block" />
              Get started for free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link href="/register">
                <Button size="xl" variant="secondary" className="h-16 px-12 group text-lg font-bold shadow-2xl">
                  Create Your Account <ChevronRightIcon className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="text-sm font-bold flex items-center gap-2 opacity-80">
                <CheckCircle2 className="h-4 w-4" />
                No credit card required
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="container px-4 mx-auto max-w-3xl">
            <h3 className="text-3xl font-extrabold text-center mb-16">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-bold text-lg">Can I export my data at any time?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, absolutely. We believe your data belongs to you. You can export all your records in CSV, JSON, or Excel format with a single click.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-bold text-lg">Does BizFlow integrate with my existing tools?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We have native integrations for Slack, Google Workspace, Stripe, and Zapier. We also provide a robust API for custom integrations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-bold text-lg">What kind of support do you offer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We offer 24/7 email support for all plans, and 1-on-1 dedicated success managers for our Enterprise customers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

      </div>
    </GuestLayout>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
