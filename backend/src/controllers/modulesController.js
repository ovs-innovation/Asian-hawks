import Tender from "../models/Tender.js";

export async function listTenders(req, res) {
  const { keyword, state, category } = req.query;
  const filter = { status: "open" };
  if (state) filter.state = new RegExp(state, "i");
  if (category) filter.category = new RegExp(category, "i");
  if (keyword) filter.$text = { $search: keyword };
  const items = await Tender.find(filter).sort({ closingDate: 1 }).limit(50);
  res.json({ items });
}

export async function getTender(req, res) {
  const item = await Tender.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: "Tender not found" });
  res.json({ item });
}

