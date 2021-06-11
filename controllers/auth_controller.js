const typeorm = require('typeorm');
const response = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { User } = require('../entities/user-model');

// Nuevo usuario
const crearUsuario = async (req, res = response) => {

    const {nombre, email, password} = req.body;
    const connection = await typeorm.createConnection(require('../database/config_db'));

    try {
        
        const userRepo = connection.getRepository('User');

        const existeEmail = await userRepo.findOne({email});

        if (existeEmail) {
            connection.close();
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe en la base de datos'
            });
        }

        const usuario = new User(nombre, email, password);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        const savedUser = await userRepo.save(usuario);
        
        // Generar mi JWT
        const token = await generarJWT(savedUser.id);

        res.json({
            ok: true,
            user: savedUser,
            token: token
        }); 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    // Cerrar conexión
    connection.close();

}

// Login
const login = async (req, res = response) => {

    const {email, password} = req.body;
    const connection = await typeorm.createConnection(require('../database/config_db'));

    try {
        // Validar Email
        const userRepo = connection.getRepository('User');

        const usuarioDB = await userRepo.findOne({email});

        if (!usuarioDB) {
            connection.close();
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar Password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            connection.close();            
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es correcta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);        

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

    // Cerrar conexión
    connection.close();
}

// Validar/Renovar JWT
const renewToken = async (req, res = response) => {
    const connection = await typeorm.createConnection(require('../database/config_db'));
    const userRepo = connection.getRepository('User');

    const uid = req.uid;

    console.log('uid: ', uid);

    const token = await generarJWT(uid);

    const usuarioToken = await userRepo.findOne(uid);

    res.json({
        ok: true,
        usuario: usuarioToken,
        token
    });

    // Cerrar conexión
    connection.close();
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}