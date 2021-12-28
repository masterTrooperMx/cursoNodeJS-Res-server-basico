const { Router } = require('express');
const {request, response} = require('express');
const {check} = require('express-validator');

const router = Router();
// controllers
const {buscar} = require('../controllers/buscar.controllers');
// middleware

// helpers

// end point
router.get('/:coleccion/:termino',buscar);


module.exports = router;