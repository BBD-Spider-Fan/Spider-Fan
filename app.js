const express = require('express');
const cors = require('cors');
const path = require('path');


// Create routes
const usersRouter = require('./routes/users');
const domainRouter = require('./routes/domain');
const crawledDataRouter = require('./routes/crawled_data');

const jwtMiddleware = require('./middleware/jwt_middleware');
const oMiddleware = require('./middleware/oauthMiddleware');

const app = express();

app.use(cors());

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

// app().use("/api/auth", authRouter)

// Register our routes on new router to apply the middleware
const apiRouter = express.Router();
apiRouter.use(oMiddleware);
apiRouter.use('/users', usersRouter);
apiRouter.use('/domain', domainRouter);
apiRouter.use('/crawledData', crawledDataRouter);
app.use('/api', apiRouter);

module.exports = app;
