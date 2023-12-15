const { ValidationError, CastError } = require('mongoose').Error;
const Movie = require('../models/movie');

const serverResponse = require('../utils/serverResponse');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.find({ owner: ownerId })
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

/*
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
*/

module.exports.addMovie = (req, res, next) => {
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
  const owner = req.user._id;
  Movie.create({
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
    owner,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(serverResponse.CREATED).send(movie))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

/*
    return res.status(serverResponse.CREATED).send(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};
*/

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError('Не удалось найти фильм'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои фильмы');
      }
      return Movie.deleteOne({ _id: movieId });
    })
    .then(() => res.status(serverResponse.OK_REQUEST).send({ message: 'Фильм успешно удален!' }))
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Некорректная информация id фильма'));
      } else {
        next(error);
      }
    });
};

/*
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
*/
