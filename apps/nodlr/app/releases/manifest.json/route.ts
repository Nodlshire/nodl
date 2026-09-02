import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

function getFileHash(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "public", "releases", filename);
    if (!fs.existsSync(filePath)) return "";
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buffer).digest("hex");
  } catch (err) {
    return "";
  }
}

export async function GET() {
  const releases = {
    "windows-amd64": {
      url: "https://nodlr.wnode.one/releases/nodl-desktop-windows-amd64.exe",
      sha256: getFileHash("nodl-desktop-windows-amd64.exe")
    },
    "linux-amd64": {
      url: "https://nodlr.wnode.one/releases/nodl-desktop-linux-amd64",
      sha256: getFileHash("nodl-desktop-linux-amd64")
    },
    "darwin-arm64": {
      url: "https://nodlr.wnode.one/releases/nodl-desktop-darwin-arm64",
      sha256: getFileHash("nodl-desktop-darwin-arm64")
    },
    "core-windows-amd64": {
      url: "https://nodlr.wnode.one/releases/nodl-core-windows-amd64.exe",
      sha256: getFileHash("nodl-core-windows-amd64.exe")
    },
    "core-linux-amd64": {
      url: "https://nodlr.wnode.one/releases/nodl-core-linux-amd64",
      sha256: getFileHash("nodl-core-linux-amd64")
    }
  };

  return NextResponse.json(
    {
      version: "1.0.1",
      min_required_version: "1.0.0",
      releases
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    }
  );
}
