const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt-nodejs')

const pool = require('../database');
const poolConnect = pool.connect();

const request = pool.request(); // or: new sql.Request(pool1)

pool.on('error', err => {
    // ... error handler
    console.log(err)
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


passport.use('local', new LocalStrategy({
    usernameField: 'usuario', //campos name
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    await poolConnect;
    try {
        if (req.body.password == '' | req.body.usuario == '') {
            console.log('Ingrese datos validos! LOGIN')
        } else {
            var currentAccountsData = await request.query(`SELECT id,login,pass,tipo,estado FROM usuarios WHERE login='${username}'`, function (err, result) {
                if (err) {
                    return done(err)
                }
                if (result.recordset[0] == null) {
                    return done(null, false, req.flash('loginMessage', 'Usuario no encontrado'));
                } else {
                    bcrypt.compare(password, result.recordset[0].pass, function (err, check) {
                        if (err) {
                            req.flash('loginMessage', 'Contraseña incorrecta')
                            console.log('Error while checking password');
                            return done();
                        } else if (check) {
                            console.log('bcrypt check: ', check)
                            let estado = result.recordset[0].estado
                            if (estado == '0') {
                                req.flash('loginMessage', 'Usuario no habilitado, hable con el administrador.')
                                return done(null, false);
                            } else if (estado == '2') {
                                req.flash('loginMessage', 'Debe cambiar de contraseña antes de utilizar el sistema.')
                                // res.redirect('/update_pwd')
                                return done(null, false);
                            } else {
                                return done(null, { //DATOS DEL USUARIO QUE SE MANDA A LA SESSION 'req.user'
                                    id: result.recordset[0].id,
                                    email: result.recordset[0].login,
                                    tipo: result.recordset[0].tipo,
                                    estado: result.recordset[0].estado
                                    // pass: result.rows[0].pass
                                });
                            }
                        } else {
                            req.flash('loginMessage', 'Datos Incorrectos')
                            return done(null, false);
                        }
                    });
                }
            })
        }
    } catch (e) {
        console.log(e)
        throw (e);
    }
}))