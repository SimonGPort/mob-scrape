let express = require('express')
let app = express()
let route = express.Router()
const fetch = require('node-fetch')
const cheerio = require('cheerio')
// let reloadMagic = require('./reload-magic.js')

// reloadMagic(app)

const urlKoodo = 'https://www.koodomobile.com/rate-plans'








app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

app.get("/koodo", async function (req, res, next) {
    let response = await this.getTheHTML(urlKoodo)
    let $ = cheerio.load(response)
    try {
        let arrayPrice = []
        $('.views-field-field-monthly-fee-value').children('.field-content').children('.koodo-currency').each(function (i, element) {
            let $element = $(element)
            arrayPrice.push($element.text())
        })
        let arrayCondition = []
        $('.inside').children('.views-field-field-data-mobile-value').children('.field-content').each(function (i, element) {
            let $element = $(element)
            arrayCondition.push($element.text().trim().replace('\n', ' '))
        })
        let arrayTime = []
        $('.inside').children('.views-field-field-canada-wide-any-min-mobile').children('.field-content').each(function (i, element) {
            let $element = $(element)
            arrayTime.push($element.text().trim().replace('\n', ' '))
        })
        let arrayText = []
        $('.inside').children('.views-field-field-unlim-text-and-pic-mobile').children('.field-content').each(function (i, element) {
            let $element = $(element)
            arrayText.push($element.text().trim().replace('\n', ' '))
        })

        let result = []
        arrayPrice.forEach((value, idx) => {
            let container = {}
            container.price = arrayPrice[idx]
            container.condition = arrayCondition[idx]
            container.time = arrayTime[idx]
            container.text = arrayText[idx]
            result.push(container)
        })

        res.json(result)
    }
    catch (err) {
        console.log("error", err);
        res.send(JSON.stringify({ success: false }));
        return;
    }
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