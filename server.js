let express = require('express')
let app = express()
let route = express.Router()
const fetch = require('node-fetch')
const cheerio = require('cheerio')
// let reloadMagic = require('./reload-magic.js')

// reloadMagic(app)

const url = 'https://www.koodomobile.com/fr/rate-plans?INTCMP=KMNew_NavMenu_Shop_Plans'







app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

app.get("/test", async function (req, res, next) {
    let response = "test"

    response = await this.getTheHTML(url)
    console.log(response)
    let $ = cheerio.load(response)
    let array = []
    $('.koodo-currency').each(function (i, element) {
        console.log(i)
        let $element = $(element)
        array.push($element.text())
    })

    res.json(array)
})

getTheHTML = (url) => {

    return fetch(`${url}`).then(value => value.text())
}

// Your endpoints go after this line

// Your endpoints go before this line

app.all('/*', (req, res, next) => { // needed for react router
    res.sendFile(__dirname + '/public/index.html');
})


app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })