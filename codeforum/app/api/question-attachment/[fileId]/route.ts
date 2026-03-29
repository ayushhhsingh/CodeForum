import { storage } from "@/models/server/config";
import { questionAttachmentBucket } from "@/models/name";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  try {
    const [fileInfo, fileView] = await Promise.all([
      storage.getFile(questionAttachmentBucket, fileId),
      storage.getFileView(questionAttachmentBucket, fileId),
    ]);

    return new Response(fileView, {
      headers: {
        "Content-Type": fileInfo.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}
