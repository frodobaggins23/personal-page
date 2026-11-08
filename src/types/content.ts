export type ProjectSlug = 'moje-hory' | 'self-hosted' | 'agent-rules' | 'three-glasses';

export type ProjectStatus = 'inProgress' | 'done';

export type TerminalLine =
    | { type: 'text'; text: string }
    | {
          type: 'prompt';
          user: string;
          path: string;
          command: string;
          hasCursor?: boolean;
          isDesktopOnly?: boolean;
      }
    | { type: 'tree'; prefix: string; highlight: string; suffix: string };

export type ProjectMedia =
    { kind: 'image' } | { kind: 'terminal'; tone: 'default' | 'muted'; lines: TerminalLine[] };

export interface ProjectCommon {
    slug: ProjectSlug;
    status: ProjectStatus;
    stack: string[];
    links: { demo: string; source: string };
    media: ProjectMedia;
}

export interface JobCommon {
    id: string;
    company: string;
    url: string;
    from: string;
    to: string | null;
    stack: string[];
}

export interface CommonContent {
    brand: { handle: string; promptUser: string; projectsPath: string };
    languages: Record<'cs' | 'en', { label: string; name: string }>;
    links: { linkedin: string; github: string };
    hero: { stack: string[] };
    experience: { jobs: JobCommon[]; before: { year: string } };
    projects: ProjectCommon[];
}
