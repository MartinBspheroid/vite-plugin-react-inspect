import { defineConfig } from 'bumpp'

export default defineConfig({
  // Enable recursive bumping for monorepo
  recursive: true,
  // Enable commit, tag, and push by default
  commit: true,
  tag: true,
  push: true,
  // Files to update version in
  files: [
    'packages/*/package.json'
  ],
  // Execute build before committing
  execute: 'pnpm build'
})