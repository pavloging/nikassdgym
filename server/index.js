require('dotenv').config();
const { teeConsoleToFile } = require('./utils/file-log');

// На проде LOG_DIR задан в docker-compose.yml: лог дублируется в файл на диске хоста.
if (process.env.LOG_DIR) teeConsoleToFile(process.env.LOG_DIR);
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const { requestLog } = require('./middlewares/request-log');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(requestLog);
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
