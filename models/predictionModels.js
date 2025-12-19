'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionSchema = new mongoose.Schema({
  dataId: { type: String },
  prediction: { type: Number, required: true },
  latencyMs: { type: Number, required: true },
  source: { type: String },
  correlationId: { type: String },
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Prediction', PredictionSchema);
