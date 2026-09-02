import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = process.env.GITHUB_REPO || 'junedpharma/portfolio';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${folder}/${Date.now()}_${cleanName}`;
    const filePath = `public/${filename}`;

    // If GITHUB_TOKEN is available, commit file directly to GitHub Repository
    if (GITHUB_TOKEN) {
      const githubUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
      
      const res = await fetch(githubUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Portfolio-App'
        },
        body: JSON.stringify({
          message: `Upload media file ${filename} via Admin Portal`,
          content: base64Content,
          branch: GITHUB_BRANCH
        })
      });

      if (res.ok) {
        const rawCdnUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;
        return NextResponse.json({ success: true, url: rawCdnUrl });
      } else {
        const errJson = await res.json();
        console.warn('GitHub API commit warning:', errJson);
      }
    }

    // Fallback: If no GITHUB_TOKEN is set, return Data URL
    const mimeType = file.type || 'application/octet-stream';
    const dataUrl = `data:${mimeType};base64,${base64Content}`;
    return NextResponse.json({ success: true, url: dataUrl });

  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
