export interface QsStep {
  title: string
  /** code to show in a copyable block, or plain text when `note` is true */
  body: string
  note?: boolean
}

export const QUICK_START: [framework: string, steps: QsStep[]][] = [
  [
    'React',
    [
      { title: 'Install it', body: 'npm i brickbox' },
      {
        title: 'Wrap one element',
        body: `import { BrickBox } from 'brickbox/react';

<BrickBox depth={24} control="hover" tilt={{ x: 14, y: 22 }}>
  <div className="rectangle">this is a rectangle</div>
</BrickBox>`,
      },
    ],
  ],
  [
    'HTML',
    [
      { title: 'Install it', body: 'npm i brickbox' },
      {
        title: 'Wrap one element',
        body: `<brick-box depth="24" control="hover" tilt="14 22">
  <div class="rectangle">this is a rectangle</div>
</brick-box>
<script type="module">
  import { defineBrickBox } from 'brickbox/element';
  defineBrickBox();
</script>`,
      },
      {
        title: 'Mind the import',
        body: 'The import needs a bundler or an import map. Define the element after the page has parsed. Module scripts do this for you.',
        note: true,
      },
    ],
  ],
  [
    'JavaScript',
    [
      { title: 'Install it', body: 'npm i brickbox' },
      {
        title: 'Wrap, update, clean up',
        body: `import { brickbox } from 'brickbox';

// wrapperEl contains exactly one element child
const box = brickbox(wrapperEl, { depth: 24 });
box.update({ depth: 40 });
box.destroy();`,
      },
      {
        title: 'How update works',
        body: 'update() merges new options. A key set to undefined resets to its default.',
        note: true,
      },
    ],
  ],
]
