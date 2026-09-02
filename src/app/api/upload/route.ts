import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${cleanName}`;
    const relativeAssetPath = `/uploads/${folder}/${fileName}`;
    const localPublicPath = path.join(process.cwd(), 'public', 'uploads', folder, fileName);

    // 1. Write file directly to local public/ folder on disk
    try {
      const dirPath = path.dirname(localPublicPath);
      await fs.promises.mkdir(dirPath, { recursive: true });
      await fs.promises.writeFile(localPublicPath, buffer);
    } catch (fsErr) {
      console.warn('Local disk public folder write warning:', fsErr);
    }

    // 2. If GITHUB_TOKEN is available, commit file to public/ folder in GitHub repo for live deployment
    if (GITHUB_TOKEN) {
      const githubFilePath = `public/uploads/${folder}/${fileName}`;
      const githubUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${githubFilePath}`;

      const res = await fetch(githubUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Portfolio-App'
        },
        body: JSON.stringify({
          message: `Add asset ${fileName} to public folder`,
          content: buffer.toString('base64'),
          branch: GITHUB_BRANCH
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        console.warn('GitHub API commit warning:', errJson);
      }
    }

    // Return clean public asset path (e.g. /uploads/notice-pdfs/1788_file.pdf)
    return NextResponse.json({ success: true, url: relativeAssetPath });

  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
