require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/movie', function handleGetMovie(req, res) {
  let response = MOVIES.json;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  // if (req.query.type) {
  //   response = response.filter(pokemon =>
  //     pokemon.type.includes(req.query.type)
  //   )
  // }

  res.json(response)
})