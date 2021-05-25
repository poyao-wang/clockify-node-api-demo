const express = require("express");
const router = express.Router();

const config = require("../config.json");
const ProjectServices = require("../services/ProjectServices");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

const service = new ProjectServices(apiKey, workspaceId);

router.get("/new-project/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const color = req.query.color;
    const object = { name: name };
    if (color) object.color = "#" + color;

    const result = await service.postNew(object);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

router.get("/delete-by-id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await service.deleteById(id);
    res.status(200).send(result);
  } catch (error) {
    const status = error.response.status;
    const errMessage = error.response.data;
    res.status(error.response.status).send(error.response.data);
  }
});

router.get("/find-by-name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const result = await service.getByName(name);
    res.status(200).send(result);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
      return;
    }
    res.status(500).send(error);
  }
});

router.get("/update-by-id/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const name = req.query.name;
    const color = req.query.color;
    const project = {};
    if (name) project.name = name;
    if (color) project.color = "#" + color;

    const result = await service.putById(projectId, project);
    res.status(200).send(result);
  } catch (error) {
    if (error.response.status) {
      res.status(error.response.status).send(error.response.data);
      return;
    }
    res.status(500).send(error);
  }
});

module.exports = router;
