import React from 'react';
import { Github, Heart } from 'lucide-react';
import { Logo } from './Logo';

const SiteFooter: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <footer className="border-t border-border">
    <div
      className={`mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-6 lg:px-12 ${
        compact ? 'py-5' : 'py-8'
      } md:flex-row md:items-center md:justify-between`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Logo wordmarkClassName="text-sm" />
        <span className="hidden h-4 w-px bg-border sm:block" />
        <p className="text-xs text-muted-foreground">
          An independent student project. Not affiliated with or endorsed by 42
          School.
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <a
          href="https://github.com/MrSloth-dev/42-Projects"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
        <a
          href="https://github.com/MrSloth-dev/42-Projects/blob/main/README.md"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Heart className="h-3.5 w-3.5" />
          Contribute
        </a>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-cyan-soft)] px-2.5 py-1 font-medium text-secondary-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-cyan)]" />
          API online
        </span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
