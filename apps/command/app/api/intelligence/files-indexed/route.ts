import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const getMemoryDir = () => {
  const possiblePaths = [
    path.join(process.cwd(), 'ai', 'memory'),
    path.join(process.cwd(), '..', '..', 'ai', 'memory'),
    path.join(__dirname, '..', '..', '..', '..', '..', 'ai', 'memory'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
      return p;
    }
  }
  return possiblePaths[1];
};

export async function GET() {
  try {
    const memoryDir = getMemoryDir();
    let mdFiles = 0;

    if (fs.existsSync(memoryDir)) {
      const files = fs.readdirSync(memoryDir);
      mdFiles = files.filter(f => f.endsWith('.md')).length;
    }

    return NextResponse.json({
      indexed: mdFiles,
      total: mdFiles
    });
  } catch (err: any) {
    return NextResponse.json({ indexed: 0, total: 0 });
  }
}
