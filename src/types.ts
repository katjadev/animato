export interface RawProject {
  title: string;
  data: string;
  createdAt: number;
  modifiedAt: number;
}

export interface Project extends RawProject {
  id: string;
}