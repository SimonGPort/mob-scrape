let express = require('express')
let app = express()
let route = express.Router()
// let reloadMagic = require('./reload-magic.js')

// reloadMagic(app)






app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

app.get("/test", function (req, res, next) {
    res.json([
        { id: 1, username: "somebody" },
        { id: 2, username: "somebody_else" }
    ])
})

// Your endpoints go after this line

// Your endpoints go before this line

app.all('/*', (req, res, next) => { // needed for react router
    res.sendFile(__dirname + '/public/index.html');
})


app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })