export type ScreenTab = 'queue' | 'workspace' | 'rules' | 'analytics';

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repo: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  branch: {
    source: string;
    target: string;
  };
  risk: {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    score: number;
  };
  stats: {
    additions: number;
    deletions: number;
    filesCount: number;
  };
  aiAlert?: string;
  status: 'Ready' | 'Blocked' | 'Reviewing';
  timeAgo: string;
}