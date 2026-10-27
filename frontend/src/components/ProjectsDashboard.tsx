import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  LogOut,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { authApi, projectsApi } from '../services/api.js';
import type { Project } from '../services/api.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Logo } from './Logo';
import SiteFooter from './SiteFooter';

const PAGE_SIZE = 25;
const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const languageLabels: Record<string, string> = {
  c: 'C',
  cpp: 'C++',
  python: 'Python',
  ocaml: 'OCaml',
  java: 'Java',
  compiled_languages: 'Compiled languages',
  functional_languages: 'Functional languages',
  shell: 'Shell',
  php: 'PHP',
  csharp: 'C#',
  kotlin: 'Kotlin',
  swift: 'Swift',
  dart: 'Dart / Flutter',
  javascript: 'JavaScript',
  ruby: 'Ruby',
  zig: 'Zig',
  go: 'Go',
  assembly: 'Assembly',
  rust: 'Rust',
  undefined: 'Undefined',
  na: 'Not applicable',
};

const specializationLabels: Record<string, string> = {
  common_core: 'Common Core',
  algo_ai_data: 'Algo & AI & Data',
  security: 'Security',
  devops: 'Devops',
  web_mobile: 'Web & Mobile',
  system_kernel: 'System & Kernel',
  graphics_gaming: 'Graphics & Gaming',
  crypto_maths: 'Cryptography & Maths',
  development: 'Development',
  professional_exp: 'Professional Experience',
};

const trackTones: Record<string, string> = {
  common_core:
    'bg-[color:var(--brand-magenta-soft)] text-[color:var(--brand-magenta-deep)]',
  algo_ai_data: 'bg-[#ecfdf3] text-[#15803d]',
  security: 'bg-[#fee2e2] text-[#b91c1c]',
  devops: 'bg-[color:var(--brand-cyan-soft)] text-secondary-foreground',
  web_mobile: 'bg-[color:var(--brand-cyan-soft)] text-secondary-foreground',
  system_kernel: 'bg-[#fff4e5] text-[#b45309]',
  graphics_gaming: 'bg-[#fce7f3] text-[#be185d]',
  crypto_maths: 'bg-[#f3e8ff] text-[#7e22ce]',
  development: 'bg-[#e8f1ff] text-[#1d4ed8]',
  professional_exp: 'bg-surface-low text-muted-foreground',
};

const trackClass = (name?: string) =>
  (name && trackTones[name]) || 'bg-surface-low text-muted-foreground';

type Filters = {
  solo: boolean | undefined;
  languages: string[];
  specializations: string | undefined;
};

const defaultFilters: Filters = {
  solo: undefined,
  languages: [],
  specializations: undefined,
};

const loadFilters = (): Filters => {
  try {
    const saved = localStorage.getItem('projectFilters');
    return saved ? { ...defaultFilters, ...JSON.parse(saved) } : defaultFilters;
  } catch {
    return defaultFilters;
  }
};

const formatNumber = (value: number | null | undefined) =>
  value == null ? '—' : value.toLocaleString('en-US');

const ProjectsDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(loadFilters);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<{ login_42?: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('projectFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    fetchProjects();
    checkAuthentication();
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearch('');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('search')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getProjects();
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data as { login_42?: string });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await authApi.getAuthUrl();
      const data = response.data as { auth_url: string };
      window.location.href = data.auth_url;
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed ', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/';
    }
  };

  const toggleRowExpansion = (projectId: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder(column === 'xp_points' || column === 'estimate_time' ? 'desc' : 'asc');
    }
  };

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !term ||
        project.name.toLowerCase().includes(term) ||
        (project.description || '').toLowerCase().includes(term) ||
        (project.languages || []).some((lang) =>
          (lang.display_name || lang.name).toLowerCase().includes(term)
        ) ||
        (project.specializations || []).some((spec) =>
          (spec.display_name || spec.name).toLowerCase().includes(term)
        );

      const matchesSolo = filters.solo === undefined || project.solo === filters.solo;

      const matchesLanguages =
        filters.languages.length === 0 ||
        (project.languages || []).some((lang) => filters.languages.includes(lang.name));

      const matchesSpecialization =
        !filters.specializations ||
        (project.specializations || []).some(
          (spec) => spec.name === filters.specializations
        );

      return (
        matchesSearch && matchesSolo && matchesLanguages && matchesSpecialization
      );
    });
  }, [projects, search, filters]);

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (!sortBy) return 0;

      let aVal: unknown = a[sortBy as keyof Project];
      let bVal: unknown = b[sortBy as keyof Project];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if ((aVal as never) < (bVal as never)) return sortOrder === 'asc' ? -1 : 1;
      if ((aVal as never) > (bVal as never)) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortBy, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleProjects = sortedProjects.slice(pageStart, pageStart + PAGE_SIZE);

  const stats = useMemo(() => {
    const solo = projects.filter((project) => project.solo).length;
    const tracks = new Set(
      projects.flatMap((project) => (project.specializations || []).map((s) => s.name))
    );
    return { total: projects.length, solo, tracks: tracks.size };
  }, [projects]);

  const activeFilterCount =
    (filters.solo === undefined ? 0 : 1) +
    filters.languages.length +
    (filters.specializations ? 1 : 0);

  const sortLabel =
    sortBy === 'xp_points'
      ? `XP ${sortOrder === 'asc' ? 'low → high' : 'high → low'}`
      : sortBy === 'estimate_time'
        ? `Time ${sortOrder === 'asc' ? 'low → high' : 'high → low'}`
        : sortBy === 'solo'
          ? `Mode ${sortOrder === 'asc' ? 'A → Z' : 'Z → A'}`
          : `Name ${sortOrder === 'asc' ? 'A → Z' : 'Z → A'}`;

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" />
    );
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

  if (!isAuthenticated) {
    return (
      <div className="grid-canvas flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-6 lg:px-12">
            <Logo />
            <Button size="sm" onClick={handleLogin}>
              Sign in with 42
            </Button>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-magenta)]" />
              Members only
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.02em]">
              Sign in to explore projects
            </h1>
            <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
              Project Navigator reads the curriculum through your 42 account, so you
              only see the projects available to you.
            </p>
            <Button className="mt-7 w-full" size="lg" onClick={handleLogin}>
              Sign in with 42
              <ArrowUpRight />
            </Button>
          </div>
        </main>
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
            <span className="border-b-2 border-[color:var(--brand-magenta)] pb-0.5 text-foreground">
              Explore
            </span>
            <a href="/#tracks" className="transition-colors hover:text-foreground">
              Tracks
            </a>
            <a href="/#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand-cyan-soft)] text-xs font-bold text-secondary-foreground">
                {(user?.login_42 || '42').slice(0, 2).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-foreground">
                {user?.login_42}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-6 py-10 lg:px-12">
        {/* Page intro */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-magenta)]" />
              Curriculum index · {stats.total} projects
            </p>
            <h1 className="mt-2 text-[34px] font-bold leading-10 tracking-[-0.025em] lg:text-[40px] lg:leading-[46px]">
              Project Explorer
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold">
              {stats.total} total
            </span>
            <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold">
              {stats.solo} solo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-cyan-soft)] px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-cyan)]" />
              Live data
            </span>
          </div>
        </div>

        {/* Controls */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 lg:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search by project name, description, language or track…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="h-12 rounded-full pl-11 pr-24"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:block">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full border border-border p-0.5">
              {[
                { label: `All (${stats.total})`, value: undefined },
                { label: 'Solo', value: true },
                { label: 'Group', value: false },
              ].map((option) => {
                const active = filters.solo === option.value;
                return (
                  <button
                    key={option.label}
                    onClick={() => setFilters({ ...filters, solo: option.value })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[color:var(--brand-magenta)] text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <Select
              value={filters.languages.length === 0 ? 'all' : filters.languages[0]}
              onValueChange={(value: string) =>
                setFilters({
                  ...filters,
                  languages: value === 'all' ? [] : [value],
                })
              }
            >
              <SelectTrigger className="h-9 w-auto gap-2 px-3.5 text-xs font-semibold">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Language: Any</SelectItem>
                {Object.entries(languageLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.specializations || 'all'}
              onValueChange={(value: string) =>
                setFilters({
                  ...filters,
                  specializations: value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger className="h-9 w-auto gap-2 px-3.5 text-xs font-semibold">
                <SelectValue placeholder="Track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Track: All tracks</SelectItem>
                {Object.entries(specializationLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}:${sortOrder}`}
              onValueChange={(value: string) => {
                const [column, order] = value.split(':');
                setSortBy(column);
                setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <SelectTrigger className="h-9 w-auto gap-2 px-3.5 text-xs font-semibold">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name:asc">Name A → Z</SelectItem>
                <SelectItem value="name:desc">Name Z → A</SelectItem>
                <SelectItem value="xp_points:desc">XP high → low</SelectItem>
                <SelectItem value="xp_points:asc">XP low → high</SelectItem>
                <SelectItem value="estimate_time:asc">Time low → high</SelectItem>
                <SelectItem value="estimate_time:desc">Time high → low</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => {
                setFilters(defaultFilters);
                setSearch('');
              }}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-[color:var(--brand-magenta-deep)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear filters
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Applied
              </span>
              {filters.solo !== undefined && (
                <Badge variant="outline" className="gap-1.5">
                  {filters.solo ? 'Solo' : 'Group'}
                  <button
                    aria-label="Remove mode filter"
                    onClick={() => setFilters({ ...filters, solo: undefined })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.languages.map((language) => (
                <Badge key={language} variant="outline" className="gap-1.5">
                  {languageLabels[language] || language}
                  <button
                    aria-label={`Remove ${language} filter`}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        languages: filters.languages.filter((item) => item !== language),
                      })
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.specializations && (
                <Badge variant="outline" className="gap-1.5">
                  {specializationLabels[filters.specializations] ||
                    filters.specializations}
                  <button
                    aria-label="Remove track filter"
                    onClick={() => setFilters({ ...filters, specializations: undefined })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </section>

        {/* Results */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading
              ? 'Loading projects…'
              : `Showing ${sortedProjects.length} ${
                  sortedProjects.length === 1 ? 'project' : 'projects'
                }`}
          </p>
          <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-cyan)]" />
            Sorted by {sortLabel.toLowerCase()}
          </p>
        </div>

        <section className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          {error ? (
            <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
              <p className="text-lg font-semibold">Could not load projects</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchProjects}>
                Try again
              </Button>
            </div>
          ) : loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-6 px-6 py-5">
                  <div className="h-3 w-40 animate-pulse rounded-full bg-surface-low" />
                  <div className="hidden h-3 flex-1 animate-pulse rounded-full bg-surface-low md:block" />
                  <div className="h-3 w-16 animate-pulse rounded-full bg-surface-low" />
                </div>
              ))}
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-20 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-low">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-2 text-lg font-semibold">No projects found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or clear a few filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearch('');
                  setFilters(defaultFilters);
                }}
              >
                Reset everything
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[210px]">
                      <button
                        onClick={() => handleSort('name')}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        Project
                        <SortIcon column="name" />
                      </button>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[110px]">
                      <button
                        onClick={() => handleSort('xp_points')}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        XP
                        <SortIcon column="xp_points" />
                      </button>
                    </TableHead>
                    <TableHead className="w-[90px]">
                      <button
                        onClick={() => handleSort('estimate_time')}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        Time
                        <SortIcon column="estimate_time" />
                      </button>
                    </TableHead>
                    <TableHead className="w-[100px]">Mode</TableHead>
                    <TableHead className="w-[150px]">Languages</TableHead>
                    <TableHead className="w-[160px]">Track</TableHead>
                    <TableHead className="w-[52px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleProjects.map((project) => {
                    const expanded = expandedRows.has(project.id);
                    const track = project.specializations?.[0];

                    return (
                      <React.Fragment key={project.id}>
                        <TableRow
                          onClick={() => toggleRowExpansion(project.id)}
                          className={`cursor-pointer ${expanded ? 'bg-surface-low/50' : ''}`}
                          data-state={expanded ? 'selected' : undefined}
                        >
                          <TableCell>
                            <div>
                              <div className="font-semibold tracking-[-0.01em] text-foreground">
                                {project.name}
                              </div>
                              <div className="mt-0.5 text-[11px] tracking-[0.02em] text-muted-foreground">
                                {project.slug}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[380px]">
                            <div
                              className="line-clamp-2 text-left text-[13px] leading-5 text-muted-foreground"
                              title={project.description}
                            >
                              {project.description || 'No description'}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-[color:var(--brand-magenta)]">
                            {formatNumber(project.xp_points)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {project.estimate_time ? `${project.estimate_time}h` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={project.solo ? 'cyan' : 'neutral'}>
                              {project.solo ? 'Solo' : 'Group'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {project.languages && project.languages.length > 0 ? (
                                project.languages.slice(0, 2).map((lang) => (
                                  <Badge key={lang.name} variant="language">
                                    {lang.display_name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">N/A</span>
                              )}
                              {project.languages && project.languages.length > 2 && (
                                <Badge variant="language">
                                  +{project.languages.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {track ? (
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${trackClass(
                                  track.name
                                )}`}
                              >
                                {track.display_name}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleRowExpansion(project.id);
                              }}
                              aria-expanded={expanded}
                              aria-label={`${expanded ? 'Collapse' : 'Expand'} ${
                                project.name
                              }`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  expanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          </TableCell>
                        </TableRow>

                        {expanded && (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="p-0">
                              <div className="border-l-2 border-[color:var(--brand-magenta)] bg-surface-low/60 px-6 py-6">
                                <div className="mb-5">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                      Project brief
                                    </p>
                                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.01em]">
                                      {project.name}
                                    </h3>
                                  </div>
                                </div>

                                <div className="grid gap-8 lg:grid-cols-12">
                                <div className="lg:col-span-7">
                                  <p className="text-[15px] leading-7 text-foreground/80">
                                    {project.description || 'No description available'}
                                  </p>

                                  {project.objectives && project.objectives.length > 0 && (
                                    <div className="mt-5">
                                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                        Objectives
                                      </h4>
                                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                                        {project.objectives.map((objective, index) => (
                                          <li
                                            key={index}
                                            className="flex gap-2 text-[13px] leading-5 text-foreground/80"
                                          >
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-magenta)]" />
                                            {objective}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-5 lg:col-span-5">
                                  {project.prerequisites &&
                                    project.prerequisites.length > 0 && (
                                      <div>
                                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                          Prerequisites
                                        </h4>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {project.prerequisites.map((prereq, index) => (
                                            <Badge key={index} variant="outline">
                                              {prereq}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {project.specializations &&
                                    project.specializations.length > 0 && (
                                      <div>
                                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                          Tracks
                                        </h4>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                          {project.specializations.map((spec) => (
                                            <span
                                              key={spec.name}
                                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${trackClass(
                                                spec.name
                                              )}`}
                                            >
                                              {spec.display_name}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {project.subject_download_url && (
                                    <div className="pt-1">
                                      <a
                                        href={project.subject_download_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-magenta-deep)] transition-colors hover:text-[color:var(--brand-magenta)]"
                                      >
                                        Open subject
                                        <ArrowUpRight className="h-4 w-4" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && !error && sortedProjects.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, sortedProjects.length)} of{' '}
                {sortedProjects.length} projects
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-surface-low disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors ${
                        pageNumber === currentPage
                          ? 'bg-[color:var(--brand-magenta)] text-white'
                          : 'text-muted-foreground hover:bg-surface-low'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-surface-low disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter compact />
    </div>
  );
};

export default ProjectsDashboard;
