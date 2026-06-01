const express = require('express');
const path = require('path');


const app = express(); //Levanto la APP (Objeto app)

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/js', express.static(path.join(__dirname, 'js')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/zapatillas', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'zapatillas.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/remeras', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'remeras.html'));
});

app.get('/buzos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'buzos.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contacto.html'));
});

app.get('/camperas', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'camperas.html'));
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'carrito.html'));
});


module.exports = app;