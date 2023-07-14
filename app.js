const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const index = require('./routes/index');
var bodyParser = require('body-parser')



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use('/', index);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});