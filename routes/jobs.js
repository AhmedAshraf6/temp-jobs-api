const express = require('express');
const router = express.Router();

const {
  createJob,
  deleteJob,
  getAllJobs,
  ubdateJob,
  getJob,
} = require('../controllers/jobs');

router.route('/').post(createJob).get(getAllJobs);

router.route('/:id').get(getJob).delete(deleteJob).patch(ubdateJob);

module.exports = router;
