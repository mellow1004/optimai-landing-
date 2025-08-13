export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "Intake endpoint fungerar ✅",
    data: req.body || null
  });
}
