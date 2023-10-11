const jobModel = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const getAllJobs = async (req, res) => {
  const jobs = await jobModel
    .find({ createdBy: req.user.userId })
    .sort('createdAt');
  res.status(StatusCodes.OK).json({ msg: 'success', count: jobs.length, jobs });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await jobModel.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  res.status(StatusCodes.OK).json({ msg: 'success', job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'success', job });
};
const ubdateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === '' || position === '') {
    throw new BadRequestError('company or position fields can not be embty');
  }
  const job = await jobModel.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  res.status(StatusCodes.OK).json({ msg: 'success', job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await jobModel.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, ubdateJob, deleteJob };
