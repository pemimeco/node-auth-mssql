const pool = require('../database')
const sql = require('mssql')
const QRCode = require('qrcode')
const path = require('path');
var Client = require('ftp');
const fs = require('fs')
const csv = require('csvtojson');
const e = require('express');

const poolConnect = pool.connect();
const transaction = pool.transaction();
const request = pool.request(transaction); // or: new sql.Request(pool1)

let txt_files = []


pool.on('error', err => {
    // ... error handler
    console.log(err)
});

//////////////////////////////////////////////////////////////
var options = {
    host: '192.168.100.174',
    user: 'pedrom',
    password: 'pedro2020'
}

var c = new Client();
c.connect(options);
c.on('ready', function () {
    c.list(function (err, list) {
        if (err) throw err;
        if (txt_files.length == 0) {
            for (let i = 0; i < list.length; i++) {
                if (path.extname(list[i].name) == '.txt') {
                    txt_files.push({
                        bdname: list[i].name
                    })
                }
            }
        }
        console.log(txt_files)
        // c.end();
    });
});
//////////////////////////////////////////////////////////////


async function updateAsegurados(req, res) {
    try {
        await poolConnect; // ensures that the pool has been created
        const file_asegurados = `./src/dbfiles/new-asegurados2.txt`;
        const table = new sql.Table('test_ase')
        table.create = true
        table.columns.add('agenda', sql.Int, {
            nullable: false
        })
        table.columns.add('cod_asegurado', sql.NVarChar(50), {
            nullable: false,
            primary: true
        })
        table.columns.add('nombre', sql.NVarChar(50), {
            nullable: false
        })
        table.columns.add('fec_nac', sql.NVarChar(50), {
            nullable: false
        })
        table.columns.add('sexo', sql.Char(1), {
            nullable: false
        })
        table.columns.add('ci', sql.NVarChar(50), {
            nullable: true
        })
        table.columns.add('ci_loc', sql.NVarChar(50), {
            nullable: true
        })
        table.columns.add('cod_emp', sql.Int, {
            nullable: false
        })
        table.columns.add('nom_emp', sql.NVarChar(50), {
            nullable: false
        })
        table.columns.add('fec_ing', sql.NVarChar(50), {
            nullable: false
        })
        table.columns.add('tipo_sangre', sql.NVarChar(10), {
            nullable: true
        })
        csv({
                delimiter: ["|"],
                headers: ['agenda', 'cod_asegurado', 'nombre', 'fec_nac', 'sexo', 'ci', 'ci_loc', 'cod_emp', 'nom_emp', 'fec_ing', 'tipo_sangre']
            })
            .fromFile(file_asegurados)
            .then((jsonObj) => {
                // ... error checks
                jsonObj.forEach((e) => {
                    table.rows.add(parseInt(e.agenda), e.cod_asegurado, e.nombre, e.fec_nac, e.sexo, e.ci, e.ci_loc,
                        parseInt(e.cod_emp), e.nom_emp, e.fec_ing, e.tipo_sangre)
                    // request.query(`if not exists (select 1 from test_ase where cod_asegurado = '${e.cod_asegurado}')
                    //                     insert into test_ase values(${parseInt(e.agenda)},'${e.cod_asegurado}','${e.nombre}','${e.fec_nac}','${e.sexo}',
                    //                     '${e.ci}','${e.ci_loc}',${parseInt(e.cod_emp)},'${e.nom_emp}','${e.fec_ing}','${e.tipo_sangre}')
                    //                 else
                    //                     update test_ase set agenda=${parseInt(e.agenda)},cod_asegurado='${e.cod_asegurado}',nombre='${e.nombre}',
                    //                     fec_nac='${e.fec_nac}',sexo='${e.sexo}',ci='${e.ci}',ci_loc='${e.ci_loc}',cod_emp=${parseInt(e.cod_emp)},
                    //                     nom_emp='${e.nom_emp}',fec_ing='${e.fec_ing}'
                    //                     where cod_asegurado = '${e.cod_asegurado}'`)
                });
            })
            .then(async () => {
                request.bulk(table, async (err, result) => {
                    if (err) {
                        console.log(err);
                        req.flash('aux', `${err}`);
                        res.redirect('/actualizarBD');
                    } else {
                        console.log(result);
                        req.flash('aux', `${result.rowsAffected} Asegurados insertados`);
                        res.redirect('/actualizarBD');
                    }
                })
            })
    } catch (err) {
        throw (err)
    }
}


async function updateBeneficiarios() {
    try {
        await poolConnect; // ensures that the pool has been created
        const file_bnf = './src/dbfiles/new-beneficiarios2.txt';
        const request = pool.request(); // or: new sql.Request(pool1)
        csv({
                delimiter: ["|"],
                headers: ['agenda', 'cod_bnf', 'nombre', 'fec_nac', 'sexo', 'cod_par', 'cod_emp', 'nom_emp', 'tipo_sangre']
            })
            .fromFile(file_bnf)
            .then((bnfObj) => {
                var bar = new Promise((resolve, reject) => {
                    bnfObj.forEach((e, index, array) => {
                        request.query(`if not exists (select 1 from beneficiarios where cod_bnf = '${e.cod_bnf}')
                                            insert into beneficiarios(agenda,cod_bnf,nombre,fec_nac,sexo,cod_par,cod_emp,nom_emp,tipo_sangre) 
                                            values(${parseInt(e.agenda)},'${e.cod_bnf}','${e.nombre}','${e.fec_nac}','${e.sexo}',
                                            ${parseInt(e.cod_par)},${parseInt(e.cod_emp)},'${e.nom_emp}','${e.tipo_sangre}')
                                        else
                                            update beneficiarios set agenda=${parseInt(e.agenda)},cod_bnf='${e.cod_bnf}',nombre='${e.nombre}',
                                            fec_nac='${e.fec_nac}',sexo='${e.sexo}',cod_par=${parseInt(e.cod_par)},cod_emp=${parseInt(e.cod_emp)},
                                            nom_emp='${e.nom_emp}'
                                            where cod_bnf = '${e.cod_bnf}'`)
                        // console.log(e)
                        if (index === array.length - 1) resolve();
                    });
                });
            })
    } catch (err) {
        throw (err)
    }
}

function descargarFTP(req,res,txtname){
    var ftp = new Client();
    ftp.connect(options);
    ftp.on('ready', function () {
        ftp.get(`${req.body.bdname}`, function (err, stream) {
            if (err) {
                req.flash('aux', `${err}`)
                res.redirect('/actualizarBD')
            } else {
                // stream.once('close', function () {c.end();});
                stream.pipe(fs.createWriteStream(`./src/dbfiles/${txtname}.txt`));
                req.flash('aux', `Archivo descargado Correctamente.`)
                res.redirect('/actualizarBD')
            }
        });
    });
}

async function actualizarBD(req, res, next) {
    try {
        if (req.isAuthenticated() && req.user.tipo == '1') {
            await poolConnect;
            console.log(req.body)
            if (req.body.btn_actualizarbd_ase == '') {//click en actualizar asegurados
                // updateAsegurados(req, res)
                
            }
            if (req.body.btn_actualizarbd_bnf == '') {//click en actualizar beneficiarios
                // updateBeneficiarios(req,res)                
            }
            if (req.body.btn_actualizarbd_emp == '') {//click en actualizar empresas
                // updateBeneficiarios(req,res)                
            }
            if (req.body.btn_descargarbd_ase == '') {//click en DESCARGAR asegurados
                descargarFTP(req,res,'test_ase')
            }
            if (req.body.btn_descargarbd_bnf == '') {//click en DESCARGAR beneficiarios
                descargarFTP(req, res, 'test_bnf')
            }
            if (req.body.btn_descargarbd_emp == '') {//click en DESCARGAR empresas
                descargarFTP(req, res, 'test_emp')
            }
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        req.flash('aux', `${e}`)
        res.redirect('/actualizarBD')
        // throw (e)
    }
}

async function renderView(req, res) {
    if (req.isAuthenticated() && req.user.tipo == '1') {
        QRCode.toDataURL(JSON.stringify(req.user), function (err, url) {
            // console.log(url)
            res.render('actualizarBD', {
                user: req.user,
                menu: 'Base de Datos',
                subm: 'actualizarBD',
                qr: `${url}`,
                file: `../photos/Usuarios/${req.user.email}.jpg`,
                bds: txt_files
            });
        })
        console.log(req.user.id)
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    renderView,
    actualizarBD
}