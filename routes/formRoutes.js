const express = require('express');
const Form = require('../models/formModel');
const moment = require('moment');

const router = express.Router();

// @route POST /api/forms
// @desc Save form data
// @access Public
router.post('/', async (req, res) => {
  try {
    const formData = req.body;

    // Create and save form data
    const newForm = new Form(formData);
    const savedForm = await newForm.save();

    res.status(201).json({ message: 'Form data saved successfully', data: savedForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving form data', error: error.message });
  }
});

// @route GET /api/forms
// @desc Get all form data
// @access Public
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching form data', error: error.message });
  }
});

// @route PUT /api/forms/:id/update-status
// @desc Update status of a form
// @access Public
router.put('/:id/update-status', async (req, res) => {
    const { id } = req.params;
    const { isAccepted, isRejected, reason } = req.body;
  
    if (typeof isAccepted === 'undefined' || typeof isRejected === 'undefined') {
      return res.status(400).json({ message: 'Invalid request: isAccepted and isRejected are required.' });
    }
  
    try {
      const updatedForm = await Form.findByIdAndUpdate(
        id,
        {
          isAccepted,
          isRejected,
          isPending: false,
          actionDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
          actionTime: new Date().toISOString().split('T')[1].split('.')[0], // Format HH:mm:ss
          reason: reason || null,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedForm) {
        return res.status(404).json({ message: 'Form not found.' });
      }
  
      res.json({ message: 'Form status updated successfully', data: updatedForm });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating form status', error: error.message });
    }
  });



  // @route GET /api/forms/:emp_id
// @desc Fetch data by emp_id
// @access Public
router.get('/:emp_id', async (req, res) => {
    const { emp_id } = req.params;
  
    try {
      const forms = await Form.find({ emp_id });
      if (!forms || forms.length === 0) {
        return res.status(404).json({ message: 'No forms found for this employee ID.' });
      }
  
      const data = {
        pending: {},
        approved: {},
        rejected: {},
      };
  
      forms.forEach(form => {
        const date = form.createdDate;
        const formattedDate = moment(date).isSame(moment(), 'day')
          ? 'Today'
          : moment(date).format('YYYY-MM-DD');
  
        if (form.isPending && !form.isAccepted && !form.isRejected) {
          if (!data.pending[formattedDate]) data.pending[formattedDate] = [];
          data.pending[formattedDate].push(form);
        } else if (form.isAccepted && !form.isRejected) {
          if (!data.approved[formattedDate]) data.approved[formattedDate] = [];
          data.approved[formattedDate].push(form);
        } else if (form.isRejected) {
          if (!data.rejected[formattedDate]) data.rejected[formattedDate] = [];
          data.rejected[formattedDate].push(form);
        }
      });
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching forms', error: error.message });
    }
  });
  

module.exports = router;
