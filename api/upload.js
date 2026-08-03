import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const filename = req.query.filename || `image-${Date.now()}.jpg`;
    const blob = await put(filename, req, {
      access: "public",
      addRandomSuffix: true
    });
    return res.status(200).json(blob);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}