const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')

const forecast = require('./utils/forecast')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Pradeep Giri'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Ramu'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name:'title ka name'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'you must provide address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }
    
        forecast(latitude, longitude, (error, forecastdata) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastdata,
                address: location
            })
        })
    })   
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'you must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/about/*', (req, res) => {
    res.render('404', {
        title: 404,
        errorMsg: 'Page not found'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 404,
        errorMsg: 'Page not found'
    })
})

app.get('/weather/*', (req, res) => {
    res.render('404', {
        title: 404,
        errorMsg: 'Page not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        errorMsg: 'Page not found'
    })
})


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})