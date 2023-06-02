declare global {
  interface Window {
    showOpenFilePicker: any;
  }
}

export interface RawProject {
  title: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project extends RawProject {
  id: string;
}

export type Action = {
  type: string;
  payload?: {[key: string]: any};
}

export type TimelineMark = {
  title: string;
  height: number;
  position: number;
  time: number;
}

export type AnimationKeyframe = {
  time: number;
}

export type Animation = {
  id: string;
  title: string;
  values: string[];
  keyframes: AnimationKeyframe[];
  duration: number;
}

export type AnimationGroup = {
  id: string;
  title: string;
  animations: Animation[];
}

export type ScrollPosition = {
  top: number;
  left: number;
}

export type ElementTreeNode = {
  id: string;
  title: string;
  tagName: string;
  children: ElementTreeNode[];
  width?: string;
  height?: string;
  x?: string;
  y?: string;
}
