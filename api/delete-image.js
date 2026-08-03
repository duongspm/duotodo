import { del } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url" });
    await del(url);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}