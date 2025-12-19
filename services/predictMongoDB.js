"use strict";

const Feature = require("../models/predictionModels");

async function guardarMongo(data){
    try {
        const datos = new Feature(data);
        return await datos.save();
    } catch (err) {
        throw new Error(`Error al crear los datos: ${err}`);
    }
}

module.exports = {guardarMongo};