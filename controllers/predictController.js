// controllers/predictController.js
const { guardarMongo } = require("../../acquire/services/acquireMongoDB");
const { getModelInfo, predict } = require("../services/tfModelService");
const Prediction = require("../models/predictionModels");


function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.modelVersion,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.modelVersion
  });
}

async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    const { features, meta } = req.body;

    const { featureCount, dataId, source, correlationId } = meta;
    
        if (featureCount !== info.inputDim) {
          return res.status(400).json({
            error: `featureCount must be ${info.inputDim}, received ${featureCount}`
          });
        }
    
        if (!Array.isArray(features) || features.length !== info.inputDim) {
          return res.status(400).json({
            error: `features must be an array of ${info.inputDim} numbers`
          });
        }
        

        
        const prediction = await predict(features);
        const latencyMs = Date.now() - start;
        const ts = new Date();
    
        const doc = await Prediction.create({
          dataId: dataId || null,
          prediction,
          latencyMs,
          source,
          correlationId,
          createdAt: ts
        });
    
        res.status(201).json({
          dataId: dataId, 
          predictionId: doc._id.toString(),
          prediction,
          timestamp: ts.toISOString() 
        });

      } catch (err) {
        console.error("Error en /predict:", err);
        res.status(500).json({ error: "Internal error" });
      }
    }
    
    module.exports = {
      health,
      ready,
      doPredict
    };
