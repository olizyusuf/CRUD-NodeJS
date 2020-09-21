const { urlencoded } = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const port = process.env.port || 3000;
const app = express();

// untuk mengakses folder public css
app.use(express.static('public'));
// untuk mengakses nilai form
app.use(express.urlencoded({ extended: false }));

// koneksi ke database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbnodelogin'
})

connection.connect(function (err) {
    if (err) throw err;
});

// routing

// halaman index
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// menampilkan list barang
app.get('/listbrg', (req, res) => {
    connection.query('SELECT * FROM tbl_barang',
        (error, results) => {
            res.render('listbrg.ejs', { tbl_barang: results });
        }
    );
});

// menuju halaman add barang
app.get('/addbrg', (req, res) => {
    res.render('addbrg.ejs');
});

// add barang dari form
app.post('/createbrg', (req, res) => {
    var kd_brg = req.body.kd_barang;
    var nama = req.body.nama;
    var hrg_beli = req.body.hrg_beli;
    var hrg_jual = req.body.hrg_jual;
    connection.query('INSERT INTO tbl_barang (kd_brg,nama,hrg_beli,hrg_jual) VALUES (?,?,?,?)', [kd_brg, nama, hrg_beli, hrg_jual],
        (error, results) => {
            res.redirect('/listbrg');
        })
});

// hapus barang
app.post('/deletebrg/:id', (req, res) => {
    var id = req.params.id;
    connection.query('DELETE FROM tbl_barang WHERE id=?',[id],
    (error, results) => {
        res.redirect('/listbrg');
    })
});

// menampilkan edit barang
app.get('/editbrg/:id', (req, res) => {
    var id = req.params.id;
    connection.query('SELECT * FROM tbl_barang WHERE id=?',[id],
    (error, results) => {
        res.render('editbrg.ejs',{ tbl_barang: results[0] });
    })
});

// update barang
app.post('/update/:id', (req,res) => {
    var kd_brg = req.body.kd_barang;
    var nama = req.body.nama;
    var hrg_beli = req.body.hrg_beli;
    var hrg_jual = req.body.hrg_jual;
    var id = req.params.id;
    connection.query('UPDATE tbl_barang SET kd_brg=?, nama=?, hrg_beli=?, hrg_jual=? WHERE id=?', [kd_brg, nama, hrg_beli, hrg_jual, id],
        (error, results) => {
            res.redirect('/listbrg');
        })
});

app.listen(port);
console.log('Server berjalan di port ' + port);