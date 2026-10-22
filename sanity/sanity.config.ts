import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'

import { apiVersion, dataset, projectId } from './env'
import { schemaTypes, SINGLETON_TYPES } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'Cysters In Action',
  basePath: '/studio',
  // Falls back to a placeholder so Studio boots during local scaffolding
  // (see .env.example) instead of throwing "Configuration must contain projectId".
  projectId: projectId || 'placeholder',
  dataset: dataset || 'development',
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        draftMode: { enable: '/api/draft-mode/enable' },
      },
    }),
    // Vision is for developers only — query the dataset directly with GROQ.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Singletons: no duplicate/delete, and keep them out of the "New document" menu.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action ?? ''))
        : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
        : prev,
  },
})
