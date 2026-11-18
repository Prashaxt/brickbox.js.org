export interface DocSection {
  id: string
  title: string
}

/** Order of the sidebar rows and of the sections on the page. */
export const SECTIONS: DocSection[] = [
  { id: 'getting-started', title: 'Getting started' },
  { id: 'rules', title: 'Rules' },
  { id: 'props', title: 'Props table' },
  { id: 'control-modes', title: 'Control modes' },
  { id: 'shapes-colours', title: 'Shapes and colours' },
  { id: 'press-shadows', title: 'Press and shadows' },
  { id: 'nesting', title: 'Nesting' },
  { id: 'api', title: 'API' },
  { id: 'ssr-motion', title: 'Server rendering and motion' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'migration', title: 'Migration' },
  { id: 'changelog', title: 'Changelog' },
]
