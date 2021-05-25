const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");

const timeEntry = require("./routes/timeEntry");
const projectsRoute = require("./routes/projects");
const tasksRoute = require("./routes/tasks");

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use("/api/time-entries", timeEntry);
app.use("/api/projects", projectsRoute);
app.use("/api/tasks", tasksRoute);

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

const sever = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = sever;
