import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'

import { apiVersion, dataset, projectId } from './env'
import { NO_CREATE_TYPES, schemaTypes, SINGLETON_TYPES } from './schemaTypes'
import { structure } from './structure'
import { ApproveAndPublishAction, RejectAction, RequestChangesAction } from './actions/storyActions'

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
    // Singletons: no duplicate/delete. Site-created-only types (contactSubmission):
    // no duplicate (would just create a fake one) — delete stays, for cleanup/spam.
    actions: (input, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return input.filter(
          ({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action ?? ''),
        )
      }
      if (NO_CREATE_TYPES.has(context.schemaType)) {
        return input.filter(({ action }) => action !== 'duplicate')
      }
      if (context.schemaType === 'story') {
        return [...input, ApproveAndPublishAction, RequestChangesAction, RejectAction]
      }
      return input
    },
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(
            (item) =>
              !SINGLETON_TYPES.has(item.templateId) && !NO_CREATE_TYPES.has(item.templateId),
          )
        : prev,
  },
})
