const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
const db = require('./services/db')
const reportsRouter = require('./routes/reports')

// start the server
app.listen(port, () => {
    console.log('API server listening on port ' + port);
    db.init();
})


app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.use('/reports', reportsRouter)



// Default response for any other request
app.use(function(req, res){
    res.status(404);
});