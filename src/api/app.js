const express = require('express')
const app = express()
const port = 4500

const distance = require('./service/distance');
const localVersion = require('./service/localVersion');

//app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({health: true})
});

// function to get the distance from the company to the provides plz
app.get('/functions/getDistanceFromCompanyToDestinationPlz/:plz', (req, res) => {
    let param = req.params.plz;
    //const distance = distance._checkDatabaseDistance(param);
    distance.checkDatabaseDistance(param).then((response) => {
        return res.send(response);
    })
});

//function to get the available local version for the provided plz
app.get('/functions/getLocalVersionsForPlz/:plz', (req, res) => {
    let param = req.params.plz;
    localVersion.getLocalVersionsForPlz(param).then((response) => {
        return res.send(response);
    })
});

app.listen(port, () =>
    console.log("Example app listening on port %s", port),
);