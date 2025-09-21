# YouTube Caption Extractor (Serverless)

A modern web application that extracts closed captions from YouTube videos entirely with serverless functions. Paste any YouTube URL and receive the available captions along with video metadata. No long-running backend service is required—the frontend is static and every heavy task is handled by Netlify Functions.

## ✨ Features

- **🎯 Simple Interface**: Enter a YouTube URL and extract captions in a single click.
- **⚡ Fast Caption Extraction**: Uses YouTube's own caption tracks—no audio transcription or AI processing required.
- **📱 Responsive Design**: Works beautifully on desktop and mobile.
- **🌍 Multi-language Support**: Automatically prefers English but will fall back to any available language.
- **📄 Export Options**: Copy captions or download them as TXT, JSON, or DOCX directly from the browser.
- **🧩 Purely Serverless**: All processing happens inside lightweight Netlify Functions.

## 🏗 Architecture

```
index.html + static assets
        │
        ▼
JavaScript fetches Netlify Functions
        │
        ├── /.netlify/functions/transcribe     → Extract captions & metadata
        ├── /.netlify/functions/download_json  → Generate JSON download
        └── /.netlify/functions/download_docx  → Generate DOCX download
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (for the serverless function dependencies)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional, for local development)

### Install dependencies for the functions

```bash
pip install -r netlify/functions/requirements.txt
```

### Local development with Netlify CLI

```bash
npm install -g netlify-cli   # if you do not already have it
netlify dev
```

The CLI serves the static site and proxies requests to the Python Netlify Functions so `/transcribe`, `/download/json`, and `/download/docx` behave exactly as they will in production.

### Manual function testing

You can invoke the functions directly by running:

```bash
netlify functions:invoke transcribe --payload '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Replace the payload with any target video.

## 📁 Project Structure

```
YT-script/
├── index.html                    # Static entry point
├── static/
│   ├── style.css                 # Styling
│   └── script.js                 # Frontend logic and API calls
├── netlify/
│   ├── functions/
│   │   ├── transcribe.py         # Caption extraction logic
│   │   ├── download_docx.py      # DOCX generation helper
│   │   ├── download_json.py      # JSON generation helper
│   │   └── requirements.txt      # Python packages for all functions
│   └── ...
├── netlify.toml                  # Netlify configuration & redirects
└── requirements.txt              # Convenience mirror of function dependencies
```

## 🌐 Deployment

1. Push the repository to GitHub (or your preferred Git provider).
2. Create a new Netlify site and connect it to the repository.
3. Netlify automatically detects `netlify.toml`:
   - Static assets are published from the repository root.
   - Python functions are bundled from `netlify/functions`.
   - Redirects ensure `/transcribe`, `/download/json`, and `/download/docx` map to the appropriate functions.
4. Deploy and start extracting captions—no Render/Flask server necessary.

## 🔧 Troubleshooting

- **404 on `/transcribe`**: Confirm the deploy includes the functions (Netlify build logs should show them). The frontend automatically falls back to `/.netlify/functions/transcribe` when direct routes are unavailable.
- **Missing captions**: Some videos do not provide caption tracks. Try another video or one with the CC badge on YouTube.
- **Rate limiting**: Heavy use may trigger temporary blocks from YouTube. Wait a few minutes and retry.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
