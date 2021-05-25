const express = require("express");
const router = express.Router();

const config = require("../config.json");
const TaskServices = require("../services/TaskServices");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

module.exports = router;

router.get("/new-task/projectId/:projectId/name/:name", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const estimate = req.query.estimate;

    const service = new TaskServices(apiKey, workspaceId, projectId);
    const name = req.params.name;
    const object = { name: name };
    if (estimate) object.estimate = "PT" + estimate * 15 + "M";

    const result = await service.postNew(object);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

router.get(
  "/delete-by-id/projectId/:projectId/taskId/:taskId",
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const service = new TaskServices(apiKey, workspaceId, projectId);
      const taskId = req.params.taskId;
      const result = await service.deleteById(taskId);
      res.status(200).send(result);
    } catch (error) {
      res.status(error.response.status).send(error.response.data);
    }
  }
);

router.get(
  "/find-by-name/projectId/:projectId/name/:name",
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const service = new TaskServices(apiKey, workspaceId, projectId);
      const name = req.params.name;
      const result = await service.getByName(name);
      res.status(200).send(result);
    } catch (error) {
      res.status(error.response.status).send(error.response.data);
    }
  }
);

router.get(
  "/update-by-id/projectId/:projectId/taskId/:taskId",
  async (req, res) => {
    try {
      const name = req.query.name;
      const estimate = req.query.estimate;
      let task = {};
      if (name) task.name = name;
      if (estimate) task.estimate = "PT" + estimate * 15 + "M";

      const projectId = req.params.projectId;
      const service = new TaskServices(apiKey, workspaceId, projectId);
      const taskId = req.params.taskId;
      const result = await service.putById(taskId, task);
      res.status(200).send(result);
    } catch (error) {
      res.status(error.response.status).send(error.response.data);
    }
  }
);
