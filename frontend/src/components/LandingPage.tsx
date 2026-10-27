import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CirclePlay,
  Route,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import SiteFooter from './SiteFooter';
import CurriculumGraph from './CurriculumGraph';
import { authApi } from '../services/api';

const previewProjects = [
  {
    name: 'ft_transcendence',
    description: 'Full-stack multiplayer Pong web app with real-time chat, OAuth and 2FA.',
    language: 'TypeScript',
    track: 'Web & Mobile',
    time: '245 hrs',
    xp: '24,360',
  },
  {
    name: 'minishell',
    description: 'Recreate a POSIX-compliant bash subset with pipes, redirections and signals.',
    language: 'C',
    track: 'System & Kernel',
    time: '90 hrs',
    xp: '9,450',
  },
  {
    name: 'webserv',
    description: 'HTTP/1.1 RFC 7230 compliant server in C++98 with non-blocking I/O.',
    language: 'C++',
    track: 'Web & Mobile',
    time: '120 hrs',
    xp: '21,600',
  },
];

const features = [
  {
    icon: Search,
    title: 'Search everything',
    body: 'Instant fuzzy search across the whole curriculum.',
    tone: 'magenta',
  },
  {
    icon: SlidersHorizontal,
    title: 'Filter by track',
    body: 'Slice by track, mode, language and effort.',
    tone: 'cyan',
  },
  {
    icon: Route,
    title: 'Plan the sequence',
    body: 'Read prerequisites before you commit.',
    tone: 'magenta',
  },
] as const;

const LandingPage: React.FC = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await authApi.getCurrentUser();
        navigate('/dashboard');
      } catch {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await authApi.getAuthUrl();
      const data = response.data as { auth_url: string };
      window.location.href = data.auth_url;
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="h-0.5 w-24 overflow-hidden rounded-full bg-surface-low">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[color:var(--brand-magenta)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="surface-chrome sticky top-0 z-30 border-b border-border">
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-6 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
            <button
              onClick={() => navigate('/dashboard')}
              className="border-b-2 border-[color:var(--brand-magenta)] pb-0.5 text-foreground transition-colors hover:text-[color:var(--brand-magenta-deep)]"
            >
              Explore
            </button>
            <a href="#tracks" className="transition-colors hover:text-foreground">
              Tracks
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleLogin} className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button size="sm" onClick={handleLogin}>
              Sign in with 42
              <ArrowRight />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-14 lg:px-12 lg:pt-20">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-magenta)]" />
                Independent · built by students
              </span>

              <h1 className="mt-6 text-[40px] font-bold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-[52px] lg:text-[56px]">
                Navigate every project.
                <br />
                <span className="text-[color:var(--brand-magenta)]">Build your own path.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-7 text-muted-foreground">
                Every core project in one searchable map — XP, hours, languages and
                prerequisites.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Button size="lg" onClick={handleLogin}>
                  Start exploring
                  <ArrowRight />
                </Button>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-[color:var(--brand-magenta-deep)]"
                >
                  <CirclePlay className="h-5 w-5" />
                  See how it works
                </a>
              </div>

              {/* Stat strip */}
              <div className="mt-12 grid grid-cols-2 divide-border overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-4 sm:divide-x">
                <div className="px-5 py-5">
                  <div className="text-[22px] font-bold leading-7 tracking-tight">One map</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">the whole curriculum</div>
                </div>
                <div className="px-5 py-5">
                  <div className="text-[22px] font-bold leading-7 tracking-tight">10</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">specialization tracks</div>
                </div>
                <div className="px-5 py-5">
                  <div className="text-[22px] font-bold leading-7 tracking-tight">Both</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">solo & group work</div>
                </div>
                <div className="px-5 py-5">
                  <div className="flex items-center gap-2 text-[15px] font-semibold leading-7">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-cyan)]" />
                    Live 42 OAuth
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">intra sync active</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                <CurriculumGraph className="h-auto w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="how-it-works" className="border-t border-border">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--brand-magenta)]">
                Intuitive architecture
              </p>
              <h2 className="mt-3 text-[32px] font-bold leading-10 tracking-[-0.02em] text-foreground">
                Everything built for engineering flow.
              </h2>
            </div>

            <div id="tracks" className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title}>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        feature.tone === 'cyan'
                          ? 'bg-[color:var(--brand-cyan-soft)] text-secondary-foreground'
                          : 'bg-[color:var(--brand-magenta-soft)] text-[color:var(--brand-magenta-deep)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                      {feature.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="border-t border-border bg-surface-low/40">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-12">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="flex flex-col gap-4 border-b border-border p-6 lg:flex-row lg:items-center">
                <div className="flex h-11 flex-1 items-center gap-3 rounded-full border border-border px-4 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  Search projects by name, language, or topic…
                  <span className="ml-auto hidden rounded-md border border-border px-1.5 py-0.5 text-[11px] font-medium sm:block">
                    ⌘K
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
                    All tracks
                  </span>
                  <span className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
                    C / C++
                  </span>
                  <span className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
                    Web
                  </span>
                  <span className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground">
                    Graphics
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border">
                <div className="hidden grid-cols-12 gap-4 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:grid">
                  <div className="col-span-4">Project</div>
                  <div className="col-span-2">Language</div>
                  <div className="col-span-3">Track</div>
                  <div className="col-span-1">Duration</div>
                  <div className="col-span-2 text-right">XP reward</div>
                </div>
                {previewProjects.map((project) => (
                  <div
                    key={project.name}
                    className="grid grid-cols-1 gap-3 px-6 py-5 transition-colors hover:bg-surface-low/60 md:grid-cols-12 md:items-center md:gap-4"
                  >
                    <div className="md:col-span-4">
                      <div className="font-semibold tracking-[-0.01em]">{project.name}</div>
                      <div className="mt-0.5 truncate text-[13px] text-muted-foreground">
                        {project.description}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="inline-flex rounded-full bg-[color:var(--brand-cyan-soft)] px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {project.language}
                      </span>
                    </div>
                    <div className="md:col-span-3">
                      <span className="inline-flex rounded-full bg-surface-low px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {project.track}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground md:col-span-1">
                      {project.time}
                    </div>
                    <div className="text-left font-semibold text-[color:var(--brand-magenta)] md:col-span-2 md:text-right">
                      {project.xp} XP
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  A single, sortable view of the whole curriculum.
                </p>
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-magenta-deep)] transition-colors hover:text-[color:var(--brand-magenta)]"
                >
                  Explore the full directory
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default LandingPage;
