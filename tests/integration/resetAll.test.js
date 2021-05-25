const request = require("supertest");

const apiKey = "X1RKstMZtV7NtnPX";
const workspaceId = "5fa77842e7712f7f43c89cde";
const userId = "5f4a46725a388d188799f2d5";

let sever;
let projectId = "";
let taskId = "";

const TaskServices = require("../../services/TaskServices");
const ProjectServices = require("../../services/ProjectServices");

const projectService = new ProjectServices(apiKey, workspaceId);

it("should delete all projects", async () => {
  await projectService.deleteAll();
});
