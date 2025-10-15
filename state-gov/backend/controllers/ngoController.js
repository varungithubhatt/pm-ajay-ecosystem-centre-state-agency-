const Ngo = require('../models/AgenciesModel');

// Get all NGOs
exports.getAllNgos = async (req, res) => {
  try {
    const ngos = await Ngo.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single NGO by ID
exports.getNgoById = async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'NGO not found' });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new NGO
exports.createNgo = async (req, res) => {
  try {
    const newNgo = new Ngo(req.body);
    const savedNgo = await newNgo.save();
    res.status(201).json(savedNgo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update NGO details
exports.updateNgo = async (req, res) => {
  try {
    const updatedNgo = await Ngo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNgo) return res.status(404).json({ error: 'NGO not found' });
    res.json(updatedNgo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update NGO status
exports.updateNgoStatus = async (req, res) => {
  try {
    const updatedNgo = await Ngo.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, last_active_at: Date.now() },
      { new: true }
    );
    if (!updatedNgo) return res.status(404).json({ error: 'NGO not found' });
    res.json(updatedNgo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
