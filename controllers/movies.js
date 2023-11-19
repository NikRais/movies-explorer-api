const Movie = require('../models/movie');

const serverResponse = require('../utils/serverResponse');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    if (!movies || movies.length === 0) {
      res.send('Сохраненных фильмов найти не удалось');
    }
    return res.status(serverResponse.OK_REQUEST).send(movies);
  } catch (err) {
    return next(err);
  }
};

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    });
    return res.status(serverResponse.CREATED).send(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFoundError('Не удалось найти фильм :('));
    }
    const movieOwnerId = movie.owner.valueOf();
    if (movieOwnerId !== userId) {
      return next(new ForbiddenError('Можно удалять только свои фильмы'));
    }
    const deletedMovie = await Movie.findByIdAndRemove(movieId);
    if (!deletedMovie) {
      return next(new NotFoundError('Не удалось найти фильм :('));
    }
    return res.status(serverResponse.OK_REQUEST).send('Фильм успешно удален!');
  } catch (err) {
    return next(err);
  }
};
