let express = require('express')
let app = express()
let route = express.Router()
const fetch = require('node-fetch')
const cheerio = require('cheerio')
// let reloadMagic = require('./reload-magic.js')

// reloadMagic(app)

const urlKoodo = 'https://www.koodomobile.com/rate-plans'

const urlBell1 = 'https://www.bell.ca/Mobility/Cell_phone_plans'
const urlBell2 = 'https://www.bell.ca/Mobility/Cell_phone_plans/Promotional-plans'
const urlBell3 = 'https://www.bell.ca/Mobility/Cell_phone_plans/Basic-Rate-Plans'







app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

// ----Koodo----
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

// ----BELL----
app.get("/bell", async function (req, res, next) {
    let response1 = await this.getTheHTML(urlBell1)
    let response2 = await this.getTheHTML(urlBell2)
    let response3 = await this.getTheHTML(urlBell3)

    let $ = cheerio.load(response1)
    try {
        let arrayPrice = []
        $('.rsx-price').children('span').each(function (i, element) {
            let $element = $(element)
            arrayPrice.push($element.text())
        })
        let arrayCondition = []
        let arrayTime = []
        let arrayText = []
        $('.rp-plan-features').children('dl').each(function (i, element) {
            let $element = $(element)
            let result = $element.text()
            if (result.includes("Data")) {
                result = result.trim().replace("Data", "").trim()
                arrayCondition.push(result)
            }
            if (result.includes("Talk")) {
                result = result.trim().replace("Talk", "").trim()
                arrayTime.push(result)
            }
            if (result.includes("Text")) {
                result = result.trim().replace("Text", "").trim()
                arrayText.push(result)
            }
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
        result = result.filter((plan) => {
            return plan.condition
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