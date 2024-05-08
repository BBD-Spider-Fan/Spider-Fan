const express = require('express');
const path = require('path');


// Create routes
const domainRouter = require('./routes/domain');
const crawledDataRouter = require('./routes/crawled_data');
const authRouter = require('./routes/auth');

const authMiddleware = require('./middleware/oauthMiddleware');

const app = express();

// Creates a logger for us uses a package so will remove later.
// app.use(logger('dev'));

/*
if (process.env.NODE_ENV !== 'production') {
    // Log stuff in dev as we don't want any more prod deps
    const morgan = require('morgan');
    app.use(morgan("dev"));
}
*/

app.use(express.json());

app.use(express.urlencoded({extended: false}));

// Serve our static assets
app.use(express.static(path.join(__dirname, 'public')));

/*app.use("/api/auth", authRouter)

// Register our routes on new router to apply the middleware
const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.use('/domain', domainRouter);
apiRouter.use('/crawledData', crawledDataRouter);
app.use('/api', apiRouter);*/

module.exports = app;
