const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  enterpriseName: { type: String, required: true },
  ownerName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  gstNo: { type: String, required: true },
  dtpNo: { type: String },
  regNo: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String },
  dealer: { type: String },
  additionalItems: { type: String },
  img1: { type: String },
  img2: { type: String },
  img3: { type: String },
  isPending: { type: Boolean, default: true },
  isAccepted: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  reason: { type: String, default: '' },
  emp_id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  createdTime: { type: Date, default: Date.now },
  createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  actionTime: { type: String, default: '' },
  actionDate: { type: String, default: '' },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
