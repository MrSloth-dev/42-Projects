import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api.js';
import { Search, /*Download,*/ ChevronDown, Filter, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Project } from '../services/api.js';
import { projectsApi } from '../services/api.js';

interface ProjectsDashboardProps { }

const ProjectsDashboard: React.FC<ProjectsDashboardProps> = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('projectFilters')
    return saved ? JSON.parse(saved) : {
      solo: undefined as boolean | undefined,
      languages: [] as string[],
      specializations: undefined as string | undefined,
    }
  });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      if (e.ctrlKey && e.key === 'k') {
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
      await authApi.getCurrentUser();
      const response = await authApi.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);

    } catch (err) {
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
      await authApi.logout()
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed ', err)
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/'
    }
  };


  const toggleRowExpansion = (projectId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(projectId)) {
      newExpandedRows.delete(projectId);
    } else {
      newExpandedRows.add(projectId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = !search ||
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(search.toLowerCase()));

    const matchesSolo = filters.solo === undefined || project.solo === filters.solo;

    const matchesLanguages = filters.languages.length === 0 ||
      (project.languages && project.languages.length > 0 &&
        project.languages.some(lang => {
          return filters.languages.includes(lang.name);
        }));

    const matchesSpecialization = !filters.specializations ||
      (project.specializations && project.specializations.length > 0 &&
        project.specializations.some(spec => spec.name === filters.specializations));

    return matchesSearch && matchesSolo && matchesLanguages && matchesSpecialization;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortBy) return 0;

    let aVal: any = a[sortBy as keyof Project];
    let bVal: any = b[sortBy as keyof Project];

    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (authLoading) return (
    <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
      <div className="text-[color:var(--color-42-secondary)] text-lg font-medium">Loading...</div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-gruvbox-gradient">
      <header className="bg-gruvbox-surface/95 backdrop-blur-sm border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="w-full px-12 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[color:var(--color-42-primary)] to-[color:var(--color-42-secondary)] bg-clip-text text-transparent">
              42 Projects
            </h1>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[color:var(--color-42-primary)] mb-4">Welcome to 42 Projects</h2>
          <p className="text-[color:var(--color-muted-foreground)] mb-8">Please login with your 42 account to access the project database</p>
          <Button
            variant="42-primary"
            onClick={handleLogin}
            className="text-lg px-8 py-3"
          >
            Login with 42
          </Button>
        </div>
      </main>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
      <div className="text-[color:var(--color-42-secondary)] text-lg font-medium">Loading projects...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gruvbox-gradient flex items-center justify-center">
      <div className="text-[color:var(--color-destructive)] text-lg font-medium">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gruvbox-gradient">
      {/* Header */}
      <header className="bg-gruvbox-surface/95 backdrop-blur-sm border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="w-full px-12 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[color:var(--color-42-primary)] to-[color:var(--color-42-secondary)] bg-clip-text text-transparent">
              42 Projects
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[color:var(--color-42-primary)] font-medium">{user?.login_42}</span>
              </div>
              <Button
                variant="42-outline"
                size="sm"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-12 py-6">
        {/* Search & Filter Panel */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-[color:var(--color-42-primary)] mb-2">
                    Search Projects
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--color-42-accent)] h-4 w-4" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by name or description... (Ctrl + K)"
                      value={search}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-orange-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <Button
                  variant="42-outline"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="h-10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filtersExpanded ? "rotate-180" : ""}`} />
                </Button>

                {/* <Button
                  variant="42-outline"
                  onClick={() => setFilters({ solo: undefined, languages: [], specializations: undefined })}
                  className="h-10"
                >
                  Clear Filters
                </Button> */}

              </div>

              {filtersExpanded && (
                <div className="flex gap-4 pt-4 border-t border-[color:var(--color-border)]">
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--color-42-primary)] mb-2">Solo / Group</label>
                    <Select
                      value={filters.solo === undefined ? "all" : filters.solo.toString()}
                      onValueChange={(value: string) => setFilters({
                        ...filters,
                        solo: value === "all" ? undefined : value === "true"
                      })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Solo</SelectItem>
                        <SelectItem value="false">Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-[color:var(--color-42-primary)] mb-2">Languages</label>
                    <Select
                      value={filters.languages.length === 0 ? "all" : filters.languages[0]}
                      onValueChange={(value: string) => setFilters({
                        ...filters,
                        languages: value === "all" ? [] : [value]
                      })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="ocaml">OCaml</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="compiled_languages">Compiled Languages</SelectItem>
                        <SelectItem value="functional_languages">Functional Languages</SelectItem>
                        <SelectItem value="shell">Shell</SelectItem>
                        <SelectItem value="php">PHP</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="kotlin">Kotlin</SelectItem>
                        <SelectItem value="swift">Swift</SelectItem>
                        <SelectItem value="dart">Dart</SelectItem>
                        <SelectItem value="zig">Zig</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="assembly">Assembly</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                        <SelectItem value="undefined">Undefined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--color-42-primary)] mb-2">Specialization</label>
                    <Select
                      value={filters.specializations || "all"}
                      onValueChange={(value: string) => setFilters({
                        ...filters,
                        specializations: value === "all" ? undefined : value
                      })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        <SelectItem value="common_core">Common Core</SelectItem>
                        <SelectItem value="algo_ai_data">Algo & AI & Data</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="devops">Devops</SelectItem>
                        <SelectItem value="web_mobile">Web & Mobile</SelectItem>
                        <SelectItem value="system_kernel">System & Kernel</SelectItem>
                        <SelectItem value="graphics_gaming">Graphics & Gaming</SelectItem>
                        <SelectItem value="crypto_maths">Cryptography & Maths</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="professional_exp">Professional Experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects Dashboard */}
        <Card className="!z-0">

          <CardContent className="relative z-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[color:var(--color-42-surface-variant)]/50 bg-[color:var(--color-42-surface)]">
                    <TableHead
                      className="cursor-pointer hover:text-[color:var(--color-42-secondary)]"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Project
                        {sortBy === 'name' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-[color:var(--color-42-secondary)]"
                      onClick={() => handleSort('xp_points')}
                    >
                      <div className="flex items-center gap-1">
                        XP
                        {sortBy === 'xp_points' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-[color:var(--color-42-secondary)]"
                      onClick={() => handleSort('estimate_time')}
                    >
                      <div className="flex items-center gap-1">
                        Time
                        {sortBy === 'estimate_time' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-[color:var(--color-42-secondary)]"
                      onClick={() => handleSort('solo')}
                    >
                      <div className="flex items-center gap-1">
                        Solo / Group
                        {sortBy === 'solo' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    {/*<TableHead>Languages</TableHead> */}
                    <TableHead>Specializations</TableHead>
                    {/* <TableHead>Subject</TableHead>*/}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => (
                    <React.Fragment key={project.id}>
                      <TableRow>
                        <TableCell className="font-medium text-foreground">
                          {project.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div
                            className="cursor-pointer transition-all duration-200 hover:text-[color:var(--color-42-primary)]"
                            onClick={() => toggleRowExpansion(project.id)}
                            title={project.description}
                          >
                            {project.description && project.description.length > 60
                              ? `${project.description.substring(0, 60)}...`
                              : project.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell className="text-[color:var(--color-42-primary)] font-semibold">
                          {project.xp_points || 0}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {project.estimate_time ? `${project.estimate_time}h` : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="42-type">
                            {project.solo ? "Solo" : "Group"}
                          </Badge>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.languages && project.languages.length > 0 ? (
                              project.languages.map((lang, index) => (
                                <Badge key={index} variant="42-language">
                                  {lang.display_name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-[color:var(--color-muted-foreground)] text-sm">N/A</span>
                            )}
                          </div>
                        </TableCell> */}
                        <TableCell className="text-muted-foreground text-sm">
                          <div className="flex flex-wrap gap-1">
                            {project.specializations && project.specializations.length > 0 ? (
                              project.specializations.map((spec, index) => (
                                <Badge key={index} variant="42-language">
                                  {spec.display_name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-[color:var(--color-muted-foreground)]">N/A</span>
                            )}
                          </div>
                        </TableCell>
                        {/*<TableCell>
                          {project.subject_download_url ? (
                            <Button
                              variant="42-outline"
                              size="sm"
                              onClick={() => window.open(project.subject_download_url!, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          ) : (
                            <span className="text-[color:var(--color-muted-foreground)] text-sm">N/A</span>
                          )}
                        </TableCell>*/}
                      </TableRow>
                      {expandedRows.has(project.id) && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-[color:var(--color-42-surface-variant)]/50 border-l-4 border-[color:var(--color-42-primary)]">
                            <div className="p-4 rounded-lg bg-gruvbox-surface-variant">
                              <p className="text-foreground leading-relaxed mb-3">
                                {project.description || "No description available"}
                              </p>
                              {project.objectives && project.objectives.length > 0 && (
                                <div>
                                  <h4 className="text-[color:var(--color-42-primary)] font-medium mb-2">Objectives:</h4>
                                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    {project.objectives.map((objective, index) => (
                                      <li key={index}>{objective}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {project.prerequisites && project.prerequisites.length > 0 && (
                                <div className="mt-3">
                                  <h4 className="text-[color:var(--color-42-primary)] font-medium mb-2">Prerequisites:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {project.prerequisites.map((prereq, index) => (
                                      <Badge key={index} variant="42-language">
                                        {prereq}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {sortedProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg font-medium mb-2">No projects found</div>
            <div className="text-[color:var(--color-muted-foreground)]">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsDashboard;
