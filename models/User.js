const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  emp_id: { type: String, unique: true, required: true },
  name: { type: String, required: false },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  profile_img: { type: String, default: '' },
  aadhar_photo: { type: String, default: '' }, // Aadhar photo URL
  license_photo: { type: String, default: '' }, // Driving License photo URL
  driving_license_no: { type: String, default: '' }, // Driving License number
});

module.exports = mongoose.model('User', userSchema);
