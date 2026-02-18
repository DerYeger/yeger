import { defineNodeWithDefaults } from 'd3-graph-controller'

import 'd3-graph-controller/default.css'

const a = defineNodeWithDefaults({
  type: 'node',
  id: 'a',
  label: {
    color: 'black',
    fontSize: '2rem',
    text: 'A',
  },
  color: 'var(--color-primary)',
})
