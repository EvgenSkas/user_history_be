const express = require('express');
const bodyParser = require('body-parser');
const { initModels } = require('./models');
const cors = require('cors');

const logger = require('./logger');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());


app.use(cors({
    origin: ['https://myheatsticks.tilda.ws', 'https://myheatsticks.tilda.ws/user']
}));


app.use('/api', routes);

const startServer = async () => {
    try {
        await initModels(); 
        logger.info('Server started on port 3000');
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    } catch (error) {
        logger.error(error);
        console.error('Unable to start server:', error);
    }
};

startServer();

// ****************** LOGGING ************************
app.use((req, res, next) => {
    logger.info(`${req.method} request for ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).send('Server Error');
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});