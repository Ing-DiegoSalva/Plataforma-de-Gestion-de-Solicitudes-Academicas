const express = require('express');

const {
    registrar,
    login,
    obtenerUsuario,
    logout
} = require('../controllers/auth.controller');

const {
    verificarToken
} = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.get('/me', verificarToken, obtenerUsuario);
router.post('/logout', logout);

module.exports = router;