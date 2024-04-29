const express = require('express');
const path = require('path');
// const logger = require('morgan');

// Create routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Creates a logger for us uses a package so will remove later.
// app.use(logger('dev'));

if (process.env.NODE_ENV !== 'production') {
    // Log stuff in dev as we don't want any more prod deps
    const morgan = require('morgan');
    app.use(morgan("dev"));
}

app.use(express.json());

// Url encoding not 100% sure that we will need this as we have control over asset names as well as sending json.
app.use(express.urlencoded({extended: false}));

// Serve our static assets
app.use(express.static(path.join(__dirname, 'public')));

// Register our routes
app.use('/a', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
