import express from 'express';
import { protect } from '../middleware/auth.js';
import Medicine from '../models/Medicine.js';

const router = express.Router();

// @route   GET /api/medicines
// @desc    Get all medicines with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    
    let query = { inStock: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOptions = {};
    if (sortBy === 'price-low') {
      sortOptions.price = 1;
    } else if (sortBy === 'price-high') {
      sortOptions.price = -1;
    } else if (sortBy === 'name') {
      sortOptions.name = 1;
    } else {
      sortOptions.createdAt = -1;
    }
    
    const medicines = await Medicine.find(query).sort(sortOptions);
    
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/medicines/:id
// @desc    Get medicine by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/medicines/categories
// @desc    Get medicine categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Medicine.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
