require('dotenv').config()
const express = require('express')
const workouts = require('./controllers/workouts')
const app = express()
const users = require('./controllers/users')
const { requireLogin, parseAuthorizationHeader } = require('./middleware/authorization')
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const path = require('path');

// Middleware
app.
    use(express.json())
    .use(express.static(path.join(__dirname, '../client/dist')))

    // CORS
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        // Make sure OPTIONS request are always allowed
        // That way pre-flight requests don't fail
        if(req.method === 'OPTIONS') {
            return res.status(200).send({})
        }
        next()
    })

    .use(parseAuthorizationHeader)


// Actions
app
    .get('/api/v1/', (req, res) => {
        res.send('Thou hast reacheth the API. Elaborate')
    })
    .use('/api/v1/workouts',requireLogin(), workouts)
    .use('/api/v1/users', users)

// Catch all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

// Error handling
app
    .use((err, req, res, next) => {
        console.error(err);
        const msg = {
            status: err.code || 500,
            error: err.message || 'Internal Server Error',
            isSuccess: false
        }
        res.status(msg.status).json(msg)
    })



app.listen(port, () => 
  console.log(`Server running at http://${hostname}:${port}/`)
);