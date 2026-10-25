import { readFile } from "node:fs/promises";
import path from "node:path";

const projectFiles: Record<string, Set<string>> = {
  "1": new Set(["PT1.pptx"]),
  "2": new Set(["V2.mp4"]),
  "3": new Set(["PT3.pptx", "V3.mp4"]),
  "4": new Set(),
  "5": new Set(["V5.mp4"]),
  "6": new Set(["PT6.pptx", "PF6.pdf"]),
  "7": new Set(["PF7.pdf"]),
  "8": new Set(["PF8.pdf"]),
  "9": new Set(),
  "10": new Set(["PF10.pdf"]),
};

const contentTypes: Record<string, string> = {
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const projectId = requestUrl.searchParams.get("project") ?? "";
  const filename = requestUrl.searchParams.get("file") ?? "";

  if (!projectFiles[projectId]?.has(filename)) {
    return new Response("Project media not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "src", "Projects", `project${projectId}`, filename);

  try {
    const file = await readFile(filePath);
    const extension = path.extname(filename).toLowerCase();
    const isPresentation = extension === ".pptx";
    const rangeHeader = request.headers.get("range");
    let responseFile: Uint8Array = file;
    let status = 200;
    const headers = new Headers({
      "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      "Content-Disposition": `${isPresentation ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
    });

    if (rangeHeader) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
      if (!range || (!range[1] && !range[2])) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${file.byteLength}` },
        });
      }

      const start = range[1]
        ? Number(range[1])
        : Math.max(0, file.byteLength - Number(range[2]));
      const end = range[2] && range[1]
        ? Math.min(Number(range[2]), file.byteLength - 1)
        : file.byteLength - 1;

      if (start >= file.byteLength || end < start) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${file.byteLength}` },
        });
      }

      responseFile = file.subarray(start, end + 1);
      status = 206;
      headers.set("Content-Range", `bytes ${start}-${end}/${file.byteLength}`);
    }

    headers.set("Content-Length", String(responseFile.byteLength));
    return new Response(new Uint8Array(responseFile), { status, headers });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return new Response("Project media file is missing", { status: 404 });
    }
    throw error;
  }
}
