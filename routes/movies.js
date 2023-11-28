const movieRouter = require('express').Router();

const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidation, movieIdValidation,
} = require('../middlewares/validations');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', createMovieValidation, addMovie);
movieRouter.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = movieRouter;
