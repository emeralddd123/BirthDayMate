require('dotenv').config()
const port = process.env.PORT || 3000;

const app = require('./app')
const CronJob  = require('./src/scripts/cronJobs')

const connnectToDb = require('./dbConnection')

connnectToDb()
CronJob.start()


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});