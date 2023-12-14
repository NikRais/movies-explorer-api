const movieRouter = require('express').Router();

const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidation, movieIdValidation,
} = require('../middlewares/validations');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovieValidation, addMovie);
movieRouter.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = movieRouter;
