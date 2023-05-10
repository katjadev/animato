export interface RawProject {
  title: string;
  data: string;
  createdAt: number;
  modifiedAt: number;
}

export interface Project extends RawProject {
  id: string;
}

export type TimelineMark = {
  title: string;
  height: number;
  position: number;
  time: number;
}

export type AnimationKeyframe = {
  time: number;
  position: number;
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
  element: Element;
  children: ElementTreeNode[];
}
