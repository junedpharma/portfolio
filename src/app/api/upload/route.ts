import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = 'junedpharma/portfolio';
const GITHUB_BRANCH = 'main';
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

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${cleanName}`;
    const githubFilePath = `public/uploads/${folder}/${fileName}`;
    const rawCdnUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${githubFilePath}`;

    if (GITHUB_TOKEN) {
      const githubUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${githubFilePath}`;
      const res = await fetch(githubUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Portfolio-App'
        },
        body: JSON.stringify({
          message: `Upload media asset ${fileName} via Admin Portal`,
          content: buffer.toString('base64'),
          branch: GITHUB_BRANCH
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        console.warn('GitHub API commit warning:', errJson);
      }
    } else {
      console.warn('GITHUB_TOKEN environment variable is not configured in Vercel. Set GITHUB_TOKEN to commit files to GitHub API.');
    }

    // Always return raw.githubusercontent.com CDN URL
    return NextResponse.json({ success: true, url: rawCdnUrl });

  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
