const express = require('express');
const router = express.Router();
const DropdownData = require('../models/DropdownDataModel');

// Add new dropdown data
router.post('/', async (req, res) => {
  const { category, subCategory, dealer, additionalItem } = req.body;

  try {
    const newDropdownData = new DropdownData({
      category,
      subCategory,
      dealer,
      additionalItem,
    });

    const savedDropdownData = await newDropdownData.save();
    res.status(201).json(savedDropdownData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all dropdown data
router.get('/', async (req, res) => {
  try {
    const dropdownData = await DropdownData.find();
    res.json(dropdownData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update dropdown data by ID
router.put('/:id', async (req, res) => {
  const { category, subCategory, dealer, additionalItem } = req.body;

  try {
    const updatedDropdownData = await DropdownData.findByIdAndUpdate(
      req.params.id,
      { category, subCategory, dealer, additionalItem },
      { new: true }
    );
    if (!updatedDropdownData) {
      return res.status(404).json({ message: 'Dropdown data not found' });
    }
    res.json(updatedDropdownData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a specific field in dropdown data
router.patch('/:id/field', async (req, res) => {
  const { field, value } = req.body;

  if (!field || value === undefined) {
    return res.status(400).json({ message: 'Field or value is missing' });
  }

  try {
    const update = { [field]: value };
    const updatedDropdownData = await DropdownData.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!updatedDropdownData) {
      return res.status(404).json({ message: 'Dropdown data not found' });
    }
    res.json(updatedDropdownData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
