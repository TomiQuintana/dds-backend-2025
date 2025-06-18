const express = require("express");
const router = express.Router();

const Contrato = require('../models/contratosModel');
const { Op, ValidationError } = require("sequelize"); // Asegúrate de importar Sequelize

router.get("/api/contratos", async (req, res) => {
  try {
    const { NombreContrato } = req.query;

    let where = {};
    if (NombreContrato) {
      where.NombreContrato = {
        [Op.like]: `%${NombreContrato}%`
      };
    }

    const contratos = await Contrato.findAll({
      where,
      order: [["NombreContrato", "ASC"]]
    });

    res.json(contratos);
  } catch (error) {
    console.error("Error al obtener contratos:", error);
    res.status(500).json({ error: "Error al obtener contratos" });
  }
});



// POST /api/contratos
router.post("/api/contratos/", async (req, res) => {
  try {
    let item = await Contrato.create({
      IdContrato: req.body.IdContrato,
      NombreContrato: req.body.NombreContrato,
      FechaInicio: req.body.FechaInicio,
      FechaFin: req.body.FechaFin,
      ImporteMensual: req.body.ImporteMensual,
      TelefonoContacto: req.body.TelefonoContacto,
    });
    res.status(200).json(item.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

// POST api/contratos 

//router.post("/", async (req, res) => {
  //try {
    //const contratoNuevo = await Contrato.create(req.body);
    //res.status(201).json(contratoNuevo);
  //} catch (error) {
    //console.error("Error al crear contrato:", error);
    //res.status(400).json({ error: "Error al crear contrato", detalle: error });
  //}
//});



module.exports = router;
