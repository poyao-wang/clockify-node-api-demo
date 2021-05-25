const express = require("express");
const router = express.Router();

const config = require("../config.json");
const TimeEntryServices = require("../services/TimeEntryServices");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

const service = new TimeEntryServices(apiKey, workspaceId, userId);

router.get("/new-entry", async (req, res) => {
  try {
    const tagIds = [req.query.tagId];
    const description = req.query.description;
    const projectId = req.query.projectId;
    const taskId = req.query.taskId;
    const start = new Date();
    const timeEntry = { start, description, projectId, taskId, tagIds };
    const result = await service.postNew(timeEntry);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

router.get("/new-entry/rollback", async (req, res) => {
  let rollBackMinutes = req.query.rollBackMinutes;
  if (!rollBackMinutes) rollBackMinutes = 0;
  const description = req.query.description;
  const tagIds = [req.query.tagId];
  const projectId = req.query.projectId;
  const taskId = req.query.taskId;
  const start = new Date(Date.now() - rollBackMinutes * 60 * 1000);
  const timeEntry = { start, description, projectId, taskId, tagIds };
  let resultCurrent;
  let resultNew;

  try {
    resultCurrent = await service.stopCurrent({ end: start });
  } catch (error) {
    resultCurrent = {
      status: error.response.status,
      data: error.response.data,
    };
  }

  try {
    resultNew = await service.postNew(timeEntry);
  } catch (error) {
    resultNew = {
      status: error.response.status,
      data: error.response.data,
    };
  }

  result = { current: resultCurrent, new: resultNew };

  if (result.new.status) {
    res.status(result.new.status).send(result);
    return;
  }

  res.status(200).send(result);
});

router.get("/stop-current", async (req, res) => {
  try {
    const end = new Date();
    const timeEntry = { end: end };
    const result = await service.stopCurrent(timeEntry);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

router.get("/stop-current/rollback", async (req, res) => {
  try {
    let rollBackMinutes = req.query.rollBackMinutes;
    if (!rollBackMinutes) rollBackMinutes = 0;
    const end = new Date(Date.now() - rollBackMinutes * 60 * 1000);
    const timeEntry = { end: end };
    const result = await service.stopCurrent(timeEntry);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

module.exports = router;
