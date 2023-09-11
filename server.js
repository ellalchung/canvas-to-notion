require('dotenv').config()

const express = require('express')
const path = require('path')
const ical = require('./ical.js')

const app = express()

app.set('view engine', 'ejs');

app.listen(process.env.PORT)

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/submit-cal-link', (req, res) => {
    res.render('form')
})

app.post('/submit-cal-link', (req, res) => {
        ical.parseAssignments(req.body.link);
        res.render('success');
})

app.use((req, res) => {
    res.status(404);
    res.render('404');
})




