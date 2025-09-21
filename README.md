# YouTube Caption Extractor

A beautiful, modern web application that extracts closed captions from YouTube videos. Simply paste a YouTube URL and get the video's text captions instantly - no AI processing required!

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)
![yt-dlp](https://img.shields.io/badge/yt--dlp-2023.9.24-red.svg)

## ✨ Features

- **🎯 Simple Interface**: Just paste a YouTube URL and extract captions
- **⚡ Lightning Fast**: Instantly extracts existing closed captions (no AI processing needed)
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🌍 Multi-Language Support**: Supports all available caption languages
- **📄 Export Options**: Copy to clipboard or download as text file
- **🎨 Modern UI**: Beautiful gradient design with smooth animations
- **🔍 Smart Validation**: Validates YouTube URLs before processing
- **📊 Caption Info**: Shows caption type (manual/automatic) and language
- **🎬 Video Details**: Displays video title, duration, and uploader info

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Youtube Transcribe"
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 🎯 Usage

1. **Enter YouTube URL**: Paste any YouTube video URL into the input field
2. **Click Extract Captions**: The app will fetch the closed captions instantly
3. **View Results**: See the captions along with video and caption information
4. **Export**:
   - Copy to clipboard
   - Download as .txt (plain text)
   - Download as .json (captions + metadata)
   - Download as .docx (Word document)

### 📝 Important Notes:
- The video must have closed captions available (either manual or auto-generated)
- Manual captions are preferred over automatic ones for better accuracy
- If no English captions are available, the app will try other languages
- Some videos may not have captions available

### Supported YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

## 🛠️ Technology Stack

- **Backend**: Flask (Python web framework)
- **Caption Extraction**: yt-dlp (YouTube metadata and caption extraction)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with gradients and animations
- **Caption Parsing**: Custom regex-based parsers for VTT, TTML, and SRV formats

## 📁 Project Structure

```
Youtube Transcribe/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # Custom CSS styles
    └── script.js         # Frontend JavaScript
```

## ⚙️ Configuration

### Caption Language Preferences

The app prioritizes English captions by default. You can modify the language preferences in `app.py`:

```python
# Priority order for caption languages
'subtitleslangs': ['en', 'en-US', 'en-GB']  # Add more languages as needed
```

### Caption Type Priority

The app prefers manual captions over automatic ones for better accuracy:

1. **Manual Subtitles**: Human-created captions (highest accuracy)
2. **Automatic Captions**: AI-generated captions (good accuracy)

### Supported Caption Formats

The app can parse multiple caption formats:
- **WebVTT (.vtt)**: Most common format
- **TTML (.ttml)**: XML-based format
- **SRV (.srv1, .srv2, .srv3)**: YouTube's internal formats

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production with Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Deploy to Render (1-click)

1. Push this repo to GitHub (done).
2. Create a new Web Service on Render, pick this repo.
3. Render reads `render.yaml`; no extra config needed.
4. After deploy, note your backend URL, e.g. `https://your-service.onrender.com`.
5. If hosting frontend on Netlify, set `window.BACKEND_BASE_URL` before loading `script.js`:

```html
<script>window.BACKEND_BASE_URL = 'https://your-service.onrender.com'</script>
<script src="/static/script.js"></script>
```

### Docker Deployment (Optional)
Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 🔧 Troubleshooting

### Common Issues

1. **No captions found**
   - The video may not have closed captions available
   - Try videos from major channels which usually have captions
   - Check if the video has captions by looking for the CC button on YouTube

2. **YouTube video unavailable**
   - Some videos may be region-restricted or age-restricted
   - Private videos cannot be accessed
   - Try with different videos

3. **Connection errors**
   - Check your internet connection
   - YouTube may temporarily block requests if too many are made

4. **Port already in use**
   - Change the port in `app.py`: `app.run(port=5001)`

### Performance Tips

- **Lightning Fast**: Caption extraction is nearly instant since no audio processing is required
- **No Storage**: No temporary files are created, everything is processed in memory
- **Low Resource Usage**: Minimal CPU and RAM requirements compared to AI transcription

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **yt-dlp**: For reliable YouTube metadata and caption extraction
- **Flask**: For the simple and powerful web framework
- **YouTube**: For providing closed captions on millions of videos

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Made with ❤️ for the open source community**
