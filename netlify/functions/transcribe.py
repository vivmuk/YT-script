import json
import os
import re
import yt_dlp

def response(body, status=200, headers=None):
    base = {"Content-Type": "application/json"}
    if headers:
        base.update(headers)
    return {"statusCode": status, "headers": base, "body": json.dumps(body)}

def is_valid_youtube_url(url: str) -> bool:
    return any(d in url for d in ['youtube.com', 'youtu.be', 'www.youtube.com', 'm.youtube.com'])

def parse_vtt(vtt: str) -> str:
    out = []
    for line in vtt.split('\n'):
        line = line.strip()
        if not line or line.startswith('WEBVTT') or line.startswith('NOTE') or '-->' in line or line.isdigit() or line.startswith('STYLE') or line.startswith('::cue'):
            continue
        line = re.sub(r'<[^>]+>', '', line)
        line = re.sub(r'&[a-zA-Z]+;', ' ', line)
        if line:
            out.append(line)
    return ' '.join(out)

def parse_xml(xml: str) -> str:
    text = re.sub(r'<[^>]+>', ' ', xml)
    text = re.sub(r'&[a-zA-Z]+;', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def parse_json3(s: str) -> str:
    s = s.lstrip().removeprefix(")]}'").lstrip()
    data = json.loads(s)
    parts = []
    for ev in data.get('events', []):
        for seg in (ev.get('segs') or []):
            t = seg.get('utf8', '')
            if t:
                parts.append(t)
    joined = ''.join(parts).replace('\n', ' ')
    return re.sub(r'\s+', ' ', joined).strip()

def handler(event, context):
    try:
        data = json.loads(event.get('body') or '{}')
        url = (data.get('url') or '').strip()
        if not url:
            return response({"error": "No URL provided"}, 400)
        if not is_valid_youtube_url(url):
            return response({"error": "Invalid YouTube URL"}, 400)

        ydl_opts = {
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['en','en-US','en-GB'],
            'skip_download': True,
            'quiet': True,
            'no_warnings': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            subtitles = info.get('subtitles', {})
            auto = info.get('automatic_captions', {})

            selected = None
            lang = None
            ctype = None
            for L in ['en','en-US','en-GB']:
                if L in subtitles:
                    selected = subtitles[L]; lang=L; ctype='Manual'; break
            if not selected:
                for L in ['en','en-US','en-GB']:
                    if L in auto:
                        selected = auto[L]; lang=L; ctype='Automatic'; break
            if not selected:
                if subtitles:
                    lang = list(subtitles.keys())[0]; selected=subtitles[lang]; ctype='Manual'
                elif auto:
                    lang = list(auto.keys())[0]; selected=auto[lang]; ctype='Automatic'

            if not selected:
                return response({"error":"No closed captions found for this video."}, 404)

            preferred = ['json3','vtt','ttml','srv3','srv2','srv1']
            fmt = None
            for f in selected:
                if f.get('ext') in preferred:
                    fmt = f; break
            if not fmt:
                fmt = selected[0]

            content = ydl.urlopen(fmt['url']).read().decode('utf-8','ignore')
            ext = fmt.get('ext','')
            if ext=='json3':
                text = parse_json3(content)
            elif ext=='vtt':
                text = parse_vtt(content)
            else:
                text = parse_xml(content)

            def fmt_dur(s):
                if not s: return "Unknown Duration"
                h=s//3600; m=(s%3600)//60; sec=s%60
                return f"{h:02d}:{m:02d}:{sec:02d}" if h>0 else f"{m:02d}:{sec:02d}"

            return response({
                "transcription": text,
                "title": info.get('title','Unknown Title'),
                "duration": fmt_dur(info.get('duration',0)),
                "uploader": info.get('uploader','Unknown'),
                "language": lang,
                "caption_type": ctype,
                "success": True
            })
    except Exception as e:
        return response({"error": f"Caption extraction failed: {str(e)}"}, 500)


