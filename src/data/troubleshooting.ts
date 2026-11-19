/** Question and answer pairs for the docs Troubleshooting section. Backticks become <code> on the page and are removed in the structured data. */
export const TROUBLE: [string, string][] = [
  ['My box looks flat.', '`opacity`, `filter` or `overflow` is probably on the child or the 3D layer. Move it to the wrapper.'],
  [
    'The shape is a rounded rectangle, not my clip-path.',
    'It probably uses `url(#id)` or `shape()`, which aren’t supported (`calc()`, `min()`, `max()` and `clamp()` are). Rewrite it as `polygon()`, `circle()`, `ellipse()`, `inset()` or `path()`.',
  ],
  [
    'My nested box doesn’t stand out from its parent.',
    'Something between the nested box and its parent’s face flattens the 3D scene: `overflow` other than `visible`, `opacity` below 1, `filter`, `clip-path`, `mask`, `isolation: isolate`, `mix-blend-mode` or `contain: paint`. In development brickbox names the element. Remove it, or move the nested box out of it. A parent face with its own `clip-path` can’t have parts standing out of it either, so put the part next to it.',
  ],
  [
    'The keys move away from under my pointer.',
    'When the parent tilts on hover, everything on it moves, so a small key can slide out from under a still pointer. For a panel with many small keys, use `control="drag"` on the parent, or a small `maxAngle`.',
  ],
  [
    'The walls look clipped or distorted.',
    '`depth` is probably more than about half of `perspective`. Lower the depth or raise `perspective`.',
  ],
  [
    'The page slows down with many boxes.',
    'Every wall segment is its own element with a 3D transform. Raise `advanced.tolerance` for fewer, coarser segments, and use fewer boxes where you can. Boxes that share a `path()` share one sampling, and boxes far off screen wait to build their walls until you scroll close.',
  ],
  [
    'Nothing happens with <brick-box>.',
    'Check that you called `defineBrickBox()`, and that the element has exactly one element child.',
  ],
  [
    ':active or onPointerDown on my element fires before a drag.',
    'That’s a known limit, and it only applies when `pressSink` is set. A press is cancelled when a drag starts, but handlers and `:active` styles on your own element can fire first. Put buttons and inputs inside a `data-brickbox-ignore` area and brickbox won’t start a press or drag on them.',
  ],
]
