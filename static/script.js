class YouTubeTranscriber {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.currentTranscription = '';
    }

    initializeElements() {
        // Input elements
        this.urlInput = document.getElementById('youtube-url');
        this.transcribeBtn = document.getElementById('transcribe-btn');
        this.exampleBtns = document.querySelectorAll('.example-btn');

        // Section elements
        this.loadingSection = document.getElementById('loading-section');
        this.resultsSection = document.getElementById('results-section');
        this.errorSection = document.getElementById('error-section');

        // Loading elements
        this.loadingStatus = document.getElementById('loading-status');
        this.progressFill = document.getElementById('progress-fill');

        // Result elements
        this.videoTitle = document.getElementById('video-title');
        this.videoDuration = document.getElementById('video-duration');
        this.videoUploader = document.getElementById('video-uploader');
        this.captionLanguage = document.getElementById('caption-language');
        this.captionType = document.getElementById('caption-type');
        this.transcriptionText = document.getElementById('transcription-text');

        // Action buttons
        this.copyBtn = document.getElementById('copy-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.downloadJsonBtn = document.getElementById('download-json-btn');
        this.downloadDocxBtn = document.getElementById('download-docx-btn');
        this.retryBtn = document.getElementById('retry-btn');

        // Error elements
        this.errorMessage = document.getElementById('error-message');
    }

    attachEventListeners() {
        // Main extract button
        this.transcribeBtn.addEventListener('click', () => this.handleExtractCaptions());

        // Enter key on input
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleExtractCaptions();
            }
        });

        // Example buttons
        this.exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.getAttribute('data-url');
                this.urlInput.value = url;
                this.handleExtractCaptions();
            });
        });

        // Action buttons
        this.copyBtn.addEventListener('click', () => this.copyTranscription());
        this.downloadBtn.addEventListener('click', () => this.downloadTranscription());
        this.downloadJsonBtn.addEventListener('click', () => this.downloadAsJson());
        this.downloadDocxBtn.addEventListener('click', () => this.downloadAsDocx());
        this.retryBtn.addEventListener('click', () => this.handleRetry());

        // Input validation
        this.urlInput.addEventListener('input', () => this.validateInput());
    }

    validateInput() {
        const url = this.urlInput.value.trim();
        const isValid = this.isValidYouTubeUrl(url);
        
        if (url && !isValid) {
            this.urlInput.style.borderColor = '#dc3545';
        } else {
            this.urlInput.style.borderColor = '';
        }

        this.transcribeBtn.disabled = !url || !isValid;
    }

    isValidYouTubeUrl(url) {
        const youtubeDomains = ['youtube.com', 'youtu.be', 'www.youtube.com', 'm.youtube.com'];
        return youtubeDomains.some(domain => url.includes(domain));
    }

    async handleExtractCaptions() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('Please enter a YouTube URL');
            return;
        }

        if (!this.isValidYouTubeUrl(url)) {
            this.showError('Please enter a valid YouTube URL');
            return;
        }

        this.showLoading();
        
        try {
            await this.extractCaptions(url);
        } catch (error) {
            this.showError(error.message || 'An unexpected error occurred');
        }
    }

    async extractCaptions(url) {
        // Simulate progress updates
        this.updateProgress(10, 'Validating YouTube URL...');
        
        const response = await fetch('/transcribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });

        this.updateProgress(50, 'Fetching closed captions...');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to extract captions');
        }

        this.updateProgress(80, 'Processing caption text...');

        const data = await response.json();

        this.updateProgress(100, 'Captions extracted successfully!');

        setTimeout(() => {
            this.showResults(data);
        }, 500);
    }

    showLoading() {
        this.hideAllSections();
        this.loadingSection.style.display = 'block';
        this.transcribeBtn.disabled = true;
        this.updateProgress(0, 'Preparing to extract captions...');
    }

    updateProgress(percentage, status) {
        this.progressFill.style.width = `${percentage}%`;
        this.loadingStatus.textContent = status;
    }

    showResults(data) {
        this.hideAllSections();
        this.resultsSection.style.display = 'block';
        this.transcribeBtn.disabled = false;

        // Update video info
        this.videoTitle.textContent = data.title || 'Unknown Title';
        this.videoDuration.innerHTML = `<i class="fas fa-clock"></i> ${data.duration || 'Unknown Duration'}`;
        
        if (data.uploader) {
            this.videoUploader.innerHTML = `<i class="fas fa-user"></i> ${data.uploader}`;
            this.videoUploader.style.display = 'flex';
        } else {
            this.videoUploader.style.display = 'none';
        }

        // Update caption info
        if (data.language) {
            this.captionLanguage.innerHTML = `<i class="fas fa-language"></i> ${data.language.toUpperCase()}`;
            this.captionLanguage.style.display = 'flex';
        } else {
            this.captionLanguage.style.display = 'none';
        }

        if (data.caption_type) {
            this.captionType.innerHTML = `<i class="fas fa-info-circle"></i> ${data.caption_type}`;
            this.captionType.style.display = 'flex';
        } else {
            this.captionType.style.display = 'none';
        }

        // Update transcription
        this.currentTranscription = data.transcription || '';
        this.transcriptionText.textContent = this.currentTranscription;

        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        this.hideAllSections();
        this.errorSection.style.display = 'block';
        this.transcribeBtn.disabled = false;
        this.errorMessage.textContent = message;
    }

    hideAllSections() {
        this.loadingSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }

    async copyTranscription() {
        try {
            await navigator.clipboard.writeText(this.currentTranscription);
            
            // Visual feedback
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.copyBtn.classList.add('copy-success');
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
                this.copyBtn.classList.remove('copy-success');
            }, 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentTranscription;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showTemporaryMessage('Transcription copied to clipboard!');
        }
    }

    downloadTranscription() {
        const title = this.videoTitle.textContent || 'YouTube_Transcription';
        const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        
        const blob = new Blob([this.currentTranscription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        this.showTemporaryMessage('Transcription downloaded!');
    }

    async downloadAsJson() {
        const payload = {
            transcription: this.currentTranscription,
            title: this.videoTitle.textContent,
            duration: this.videoDuration.textContent.replace(/^[^0-9]*/, ''),
            uploader: (this.videoUploader.textContent || '').replace(/^\s*User\s*/i, ''),
            language: (this.captionLanguage.textContent || '').replace(/^[^A-Za-z0-9-]*/,'') ,
            caption_type: (this.captionType.textContent || '').replace(/^[^A-Za-z]*/,'')
        };

        const res = await fetch('/download/json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            this.showError('Failed to generate JSON');
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.safeFilename(this.videoTitle.textContent)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showTemporaryMessage('JSON downloaded!');
    }

    async downloadAsDocx() {
        const payload = {
            transcription: this.currentTranscription,
            title: this.videoTitle.textContent,
            duration: this.videoDuration.textContent.replace(/^[^0-9]*/, ''),
            uploader: (this.videoUploader.textContent || '').replace(/^\s*User\s*/i, ''),
            language: (this.captionLanguage.textContent || '').replace(/^[^A-Za-z0-9-]*/,'') ,
            caption_type: (this.captionType.textContent || '').replace(/^[^A-Za-z]*/,'')
        };

        const res = await fetch('/download/docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            this.showError('Failed to generate Word document');
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.safeFilename(this.videoTitle.textContent)}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showTemporaryMessage('Word document downloaded!');
    }

    safeFilename(name) {
        return (name || 'youtube_captions').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    showTemporaryMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    handleRetry() {
        this.hideAllSections();
        this.urlInput.focus();
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YouTubeTranscriber();
});
