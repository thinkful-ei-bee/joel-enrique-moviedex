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
  let response = MOVIES;
  //let response;

  if(!req.query.name && !req.query.genre && !req.query.country && !req.query.avg_vote) {
    response = 'Please search by "?name=, "?genre=", "?country=" or "?avg_vote="';
  }

  // filter our movie by name if name query param is present
  if (req.query.name) {
    response = response.filter( movie => {
        return movie.film_title.toLowerCase().includes(req.query.name.toLowerCase())
      }
    )
  }

  // filter our movie by genre if genre query param is present
  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.includes(req.query.genre)
    )
  }

  // filter our movie by country if country query param is present
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.includes(req.query.country)
    )
  }

  res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})