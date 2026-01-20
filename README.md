# YouTube Shorts Blocker

A Chrome extension that blocks YouTube Shorts and optionally hides comments.

## Features

- Redirects `/shorts/videoId` URLs to YouTube homepage
- Redirects `/@channel/shorts` URLs to the channel page
- Hides Shorts from the YouTube feed
- Removes Shorts from the sidebar navigation
- Toggle to hide comments on videos

## Installation

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `shorts_blocker` folder

## Development

- `npm run build` - compile TypeScript once
- `npm run watch` - compile on file changes
