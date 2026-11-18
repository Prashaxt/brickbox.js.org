export type PropGroup = 'Shape and angle' | 'Motion' | 'Look' | 'Touch and state' | 'Nesting' | 'Advanced'

/** Control type used by the playground */
export type PropControl =
  | 'n' //      range slider
  | 's' //      select
  | 'b' //      checkbox
  | 't2' //     tilt: two sliders (x, y)
  | 'ps' //     pressSink: "set" box + slider
  | 'c' //      select of presets + custom colour
  | 'ig' //     ignore: adds a demo knob
  | 'sh' //     shading: auto / on / off
  | 'shadow' //  shadow: mode + blur + spread + colour
  | 'lift' //   lift: adds a nested demo part

export interface PropDef {
  /** option name */
  k: string
  /** display name when it differs from k */
  n?: string
  g?: PropGroup
  t?: PropControl
  /** reference only: listed in the docs, no playground control */
  ro?: boolean
  /** lives under the advanced option object */
  adv?: boolean
  /** belongs to a nested part, not to the main box */
  nest?: boolean
  min?: number
  max?: number
  step?: number
  /** unit shown after the value */
  u?: string
  /** default value of the control */
  d?: number | string | boolean
  /** preset options */
  o?: string[]
  /** starting colour for the custom colour picker */
  cc?: string
  /** custom-element attribute */
  a: string
  /** accepted values (text) */
  v: string
  /** default (text) */
  ds: string
  /** what it does */
  x: string
}

export const LIGHT_DIRECTIONS = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left']

/** One list of every prop: the playground controls and the docs table both read it. */
export const PROPS: PropDef[] = [
  { k: 'depth', g: 'Shape and angle', t: 'n', min: 0, max: 120, u: 'px', d: 24, a: 'depth', v: 'number (px) or CSS length', ds: '24', x: 'How far the box extends back.' },
  { k: 'tilt', g: 'Shape and angle', t: 't2', a: 'tilt="14 22"', v: '{ x, y } in degrees, negatives allowed', ds: '{ x: 14, y: 22 }', x: 'Resting angle. Positive x shows the bottom wall, negative x the top. Positive y shows the right wall, negative y the left.' },
  { k: 'maxAngle', g: 'Shape and angle', t: 'n', min: 10, max: 90, u: '°', d: 60, a: 'max-angle', v: 'number (deg)', ds: '60', x: 'Largest angle hover and drag can reach.' },
  { k: 'perspective', g: 'Shape and angle', t: 'n', min: 200, max: 2000, step: 50, u: 'px', d: 1000, a: 'perspective', v: 'number (px)', ds: '1000', x: 'Camera distance. Lower looks more dramatic.' },
  { k: 'control', g: 'Motion', t: 's', d: 'hover', o: ['hover', 'drag', 'both', 'static'], a: 'control', v: '"hover", "drag", "both", "static"', ds: '"hover"', x: 'How the box reacts to the pointer. "both" tilts on hover until you grab it, drag takes over while held, then hover resumes. On touch screens "hover" and "both" behave like drag. "static" adds no tilt listeners.' },
  { k: 'reverseHover', g: 'Motion', t: 'b', d: false, a: 'reverse-hover', v: 'boolean', ds: 'false', x: 'Flip the hover tilt direction, so the box leans away from the pointer instead of toward it.' },
  { k: 'reverseDrag', g: 'Motion', t: 'b', d: false, a: 'reverse-drag', v: 'boolean', ds: 'false', x: 'Flip the drag direction. Needs control "drag" or "both".' },
  { k: 'springBack', g: 'Motion', t: 'b', d: true, a: 'spring-back', v: 'boolean', ds: 'true', x: 'Return to the resting tilt after release or when the pointer leaves.' },
  { k: 'springDuration', g: 'Motion', t: 'n', min: 0, max: 2000, step: 50, u: ' ms', d: 700, a: 'spring-duration', v: 'number (ms)', ds: '700', x: 'Length of the return animation.' },
  { k: 'pressSink', g: 'Motion', t: 'ps', a: 'press-sink', v: 'number or string, 0 to 99 (80 or "80%")', ds: 'unset (no press)', x: 'How far the face sinks when pressed, as a percent of depth. Above 99 counts as 99. Unset or 0 means no press.' },
  { k: 'pressDuration', g: 'Motion', t: 'n', min: 0, max: 600, step: 10, u: ' ms', d: 150, a: 'press-duration', v: 'number (ms)', ds: '150', x: 'How fast the press happens. Only matters when pressSink is set.' },
  { k: 'sideColor', g: 'Look', t: 'c', d: 'match', o: ['match', 'none'], cc: '#2b4eff', a: 'side-color', v: '"match", "none", or any CSS colour', ds: '"match"', x: '"match" follows the element’s background (a solid colour, or a single linear gradient continued around the edge). A colour is used exactly as given. "none" (or "transparent") builds no walls at all.' },
  { k: 'shading', g: 'Look', t: 'sh', a: 'shading', v: 'boolean', ds: 'on for "match", off for an explicit colour', x: 'Lighting on the walls.' },
  { k: 'light', g: 'Look', t: 's', d: 'top-left', o: LIGHT_DIRECTIONS, a: 'light', v: 'top, top-right, right, bottom-right, bottom, bottom-left, left, top-left, or degrees (0 is top, clockwise)', ds: '"top-left"', x: 'Where the light comes from. 315 is top-left.' },
  { k: 'shadow', g: 'Look', t: 'shadow', a: 'shadow', v: '"none", "followLight" or "bottom", optionally followed by blur spread colour', ds: '"none"', x: 'A soft shadow of the real silhouette, holes included. "followLight" casts it away from light, "bottom" straight down. Blur and spread are in px. What you leave out comes from depth, and the distance always does.' },
  { k: 'edgeColor', g: 'Look', t: 'c', d: 'none', o: ['none', 'auto'], cc: '#121a33', a: 'edge-color', v: '"none", "auto", or any CSS colour', ds: '"none"', x: 'Thin lines on the back rim and on sharp corners. "auto" is a darker line.' },
  { k: 'edgeWidth', g: 'Look', t: 'n', min: 1, max: 6, u: ' px', d: 1, a: 'edge-width', v: 'number (px)', ds: '1', x: 'Width of the edge lines.' },
  { k: 'touchScroll', g: 'Touch and state', t: 'b', d: true, a: 'touch-scroll', v: 'boolean', ds: 'true', x: 'Touch only. true lets vertical swipes scroll the page and only horizontal drags tilt. false lets both axes tilt, but a swipe starting on the box no longer scrolls the page.' },
  { k: 'ignore', g: 'Touch and state', t: 'ig', a: 'ignore', v: 'CSS selector', ds: 'none', x: 'Areas inside the element that ignore hover, drag and press, like a knob. Elements with a data-brickbox-ignore attribute are ignored too. Tick the box to add a demo knob.' },
  { k: 'disabled', g: 'Touch and state', t: 'b', d: false, a: 'disabled', v: 'boolean', ds: 'false', x: 'Render the element normally with no 3D.' },
  { k: 'lift', g: 'Nesting', t: 'lift', nest: true, a: 'lift', v: 'number (px) or CSS length', ds: 'unset', x: 'Makes this box a part standing on its parent brickbox. Its base sits lift above the parent’s face (0 sits on it), and its depth is its height. Tick the box to add a demo part.' },
  { k: 'tolerance', n: 'advanced.tolerance', g: 'Advanced', t: 'n', adv: true, min: 0.05, max: 2, step: 0.05, u: ' px', d: 0.25, a: 'tolerance', v: 'number (px)', ds: '0.25', x: 'How closely curved walls follow the true curve. Lower is smoother and heavier.' },
  { k: 'trackColor', n: 'advanced.trackColor', g: 'Advanced', t: 'b', adv: true, d: true, a: 'not an attribute', v: 'boolean', ds: 'true', x: 'Re-colours the walls when the face’s colour or shape changes (hover, class, theme, transitions). Turn it off to save work, and call update() yourself after a change.' },
  { k: 'sensitivity', n: 'advanced.sensitivity', ro: true, adv: true, a: 'not an attribute', v: 'number', ds: '0.5', x: 'Degrees of tilt per pixel of drag.' },
  { k: 'bounce', n: 'advanced.bounce', ro: true, adv: true, a: 'not an attribute', v: 'number, 0 to 1', ds: '1', x: '0 is a plain ease back, 1 is the springy overshoot.' },
  { k: 'cull', n: 'advanced.cull', ro: true, adv: true, a: 'not an attribute', v: 'boolean', ds: 'true', x: 'Hide back-facing walls to roughly halve wall painting.' },
]

/** Group order and colour, used by the docs table and the playground fieldsets. */
export const GROUP_COLORS: Record<PropGroup, string> = {
  'Shape and angle': 'var(--orange)',
  Motion: 'var(--yellow)',
  Look: 'var(--purple)',
  'Touch and state': 'var(--green)',
  Nesting: 'var(--blue)',
  Advanced: 'var(--lilac)',
}

export const groupOf = (p: PropDef): PropGroup => p.g ?? 'Advanced'
