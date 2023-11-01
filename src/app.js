const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const axios = require('axios');


const app = express()
const port = process.env.PORT || 4000
// Mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views',direktoriViews)
hbs.registerPartials(direktoriPartials)

//Setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman utama
app.get('', (req, res) => {
res.render('index', {
    judul: 'Weather Check App',
    nama: 'Abel Levran'
})
})

//ini halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Abel Levran',
    teksBantuan: 'Ini adalah teks bantuan'
    })
})

//ini halaman info Cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Masukan lokasi yang ingin dicari!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, 
location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
        }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'About Me',
        nama: 'Abel Levran',
        alamat: 'Maninjau',
        telepon: '081378927443',
        email: 'abellevrann@gmail.com',
        pendidikan: 'S1 Informatika Universitas Negeri Padang',
        nim : '21343024',
        keterampilan: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
        sertifikat: [' MikroTik Certified Network Associate'],
    })
})

// ini halaman berita
app.get('/berita', async (req, res) => {
    try {
        const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
        const apiKey = '0ae5a50eea21dadf96420aa9c52ed139';

        const params = {
            access_key: apiKey,
            countries: 'id', 
        };

        const response = await axios.get(urlApiMediaStack, { params });
        const dataBerita = response.data;

        dataBerita.data.forEach(berita => {
            // Disesuaikan dengan struktur data yang diberikan oleh API, Anda harus menyesuaikan kunci yang menyimpan URL gambar.
            berita.imageURL = berita.image; // Contoh: Jika URL gambar disimpan dalam kunci 'image'
        });

        res.render('berita', {
            nama: 'Abel Levran',
            berita: dataBerita.data,
        });
    } catch (error) {
        console.error(error);
        res.render('error', {
            judul: 'Terjadi Kesalahan',
            pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
        });
    }
});



app.get('/bantuan/*',(req,res)=>{
    res.render('404',{
        judul: '404',
        nama: 'Abel Levran',
        pesanKesalahan:'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        judul:'404',
        nama: 'Abel Levran',
        pesanKesalahan:'Halaman tidak ditemukan'
    })
})


app.listen(port, () => {
console.log('Server berjalan pada port' + port)
})