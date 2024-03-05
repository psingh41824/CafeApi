require('dotenv').config()
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const http = require('http');
const PORT = process.env.PORT || 4000
const server = http.createServer(app);
const MONGO_URL = process.env.MONGO_URL
const bodyParser = require('body-parser')
const cafeRoute = require('./routes/cafeRoute')



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use('/api', cafeRoute)

mongoose.connect(MONGO_URL, {dbName: 'OtpGenerate',  retryWrites: true, w: 'majority' })

.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Connection failed', error))

server.listen(PORT,console.log("server is running"));