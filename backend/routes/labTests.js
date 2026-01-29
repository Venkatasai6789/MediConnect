import express from 'express';
import { protect } from '../middleware/auth.js';
import LabTest from '../models/LabTest.js';

const router = express.Router();

// @route   GET /api/lab-tests
// @desc    Get all lab tests with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, search, sortBy } = req.query;
    
    let query = { inStock: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOptions = {};
    if (sortBy === 'price-low') {
      sortOptions.price = 1;
    } else if (sortBy === 'price-high') {
      sortOptions.price = -1;
    } else if (sortBy === 'popular') {
      sortOptions.testCount = -1;
    } else {
      sortOptions.createdAt = -1;
    }
    
    const labTests = await LabTest.find(query).sort(sortOptions);
    
    res.json({ success: true, count: labTests.length, data: labTests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/lab-tests/:id
// @desc    Get lab test by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);
    
    if (!labTest) {
      return res.status(404).json({ success: false, message: 'Lab test not found' });
    }
    
    res.json({ success: true, data: labTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/lab-tests/categories
// @desc    Get lab test categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await LabTest.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
