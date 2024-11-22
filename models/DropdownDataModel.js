const mongoose = require('mongoose');

const DropdownDataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  dealer: {
    type: String,
    required: true,
  },
  additionalItem: {
    type: String,
    required: true,
  },
});

const DropdownData = mongoose.model('DropdownData', DropdownDataSchema);

module.exports = DropdownData;
