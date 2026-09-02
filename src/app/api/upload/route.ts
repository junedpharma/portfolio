import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = 'junedpharma/portfolio';
const GITHUB_BRANCH = 'main';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'GITHUB_TOKEN environment variable is missing in Vercel. Please add GITHUB_TOKEN in Vercel Project Settings.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'notice-pdfs';

    if (!file) {
      return NextResponse.json({ error: 'No file selected for upload' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename cleanly, preserving extension
    const fileExt = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.pdf';
    const rawName = file.name.slice(0, file.name.lastIndexOf('.')) || 'file';
    const cleanBaseName = rawName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30);
    const fileName = `${Date.now()}_${cleanBaseName || 'document'}${fileExt}`;

    const githubFilePath = `public/uploads/${folder}/${fileName}`;
    const githubUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${githubFilePath}`;

    const res = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Portfolio-App'
      },
      body: JSON.stringify({
        message: `Upload ${fileName} via Admin Portal`,
        content: buffer.toString('base64'),
        branch: GITHUB_BRANCH
      })
    });

    if (!res.ok) {
      const errJson = await res.json();
      console.error('GitHub API Commit Error:', errJson);
      return NextResponse.json(
        { error: errJson.message || 'GitHub API rejected file commit. Verify GITHUB_TOKEN repo permissions.' },
        { status: res.status }
      );
    }

    // Direct CDN URL for committed file
    const rawCdnUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${githubFilePath}`;
    return NextResponse.json({ success: true, url: rawCdnUrl });

  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
