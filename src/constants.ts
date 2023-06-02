export const ALLOWED_SVG_ELEMENTS = ['g', 'path', 'rect', 'circle', 'ellipse']
export const ALLOWED_ANIMATIONS = ['animate', 'animatemotion', 'animatetransform']
export const ELEMENT_ATTRUBUTES = [
  'width', 'height', 'x', 'y',
  'cx', 'cy', 'r',
  'cx', 'cy', 'rx', 'ry',
]
export const STYLING_ATTRIBUTES = [
  'fill', 
  'fill-opacity', 
  'stroke', 
  'stroke-width', 
  'stroke-opacity', 
  'stroke-dasharray', 
  'stroke-dashoffset',
]

export const MAX_DURATION = 5 * 60 * 1000
export const TIMELINE_PADDING = 1
export const REM_TO_PX_COEFFICIENT = 16

export const MAX_ZOOM = 60
export const MIN_ZOOM = 10