const request = require("supertest");
const config = require("../../../config.json");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;

const { getRandomString } = require("../../../functions");

const ProjectServices = require("../../../services/ProjectServices");

const projectService = new ProjectServices(apiKey, workspaceId);

let sever;
let projectId;

describe("/api/tasks", () => {
  beforeAll(async () => {
    await projectService.deleteAll();
    const project = await projectService.postNew({ name: "forTaskApiTest" });
    projectId = project.id;
  });
  afterAll(async () => {
    await projectService.deleteAll();
  });
  beforeEach(() => {
    sever = require("../../../index");
  });
  afterEach(() => {
    sever.close();
  });

  describe("GET /new-task/projectId/:projectId/name/:name", () => {
    it("should pass with proper projectId and name", async () => {
      const name = getRandomString(10);
      const estimate = 6;
      const url =
        `/api/tasks/new-task/projectId/${projectId}/name/${name}` +
        `?estimate=${estimate}`;

      const res = await request(sever).get(url);
      expect(res.body.name).toBe(name);
      expect(res.body.estimate).toBe("PT1H30M");
      expect(res.status).toBe(200);
    });

    it("should return 404 with invalid projectId", async () => {
      const name = getRandomString(10);
      const url = `/api/tasks/new-task/projectId/123/name/${name}`;

      const res = await request(sever).get(url);
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("PROJECT");
      expect(res.body.message).toContain("not found");
    });
    it("should return 400 with duplicates", async () => {
      const name = getRandomString(10);
      const url = `/api/tasks/new-task/projectId/${projectId}/name/${name}`;

      await request(sever).get(url);
      const res = await request(sever).get(url);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("task");
      expect(res.body.message).toContain("already exists");
    });
  });

  describe("GET /delete-by-id/projectId/:projectId/taskId/:taskId", () => {
    it("should return the deleted task", async () => {
      const name = getRandomString(10);
      let url = `/api/tasks/new-task/projectId/${projectId}/name/${name}`;
      const resAfterAdd = await request(sever).get(url);
      const taskId = resAfterAdd.body.id;

      url = `/api/tasks/delete-by-id/projectId/${projectId}/taskId/${taskId}`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(taskId);
    });
    it("should return 404 with invalid id", async () => {
      const taskId = "123";

      url = `/api/tasks/delete-by-id/projectId/${projectId}/taskId/${taskId}`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("TASK");
      expect(res.body.message).toContain("not found");
    });
  });

  describe("GET /find-by-name/:projectId/:name", () => {
    it("should return the task found", async () => {
      const name = getRandomString(10);
      let url = `/api/tasks/new-task/projectId/${projectId}/name/${name}`;
      const resAfterAdd = await request(sever).get(url);
      const id = resAfterAdd.body.id;

      url = `/api/tasks/find-by-name/projectId/${projectId}/name/${name}`;
      const res = await request(sever).get(url);
      expect(res.body.id).toBe(id);
    });
    it("should return 404 with invalid projectId", async () => {
      const name = "dummyName";
      const url = `/api/tasks/find-by-name/projectId/123/name/${name}`;

      const res = await request(sever).get(url);
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("PROJECT");
      expect(res.body.message).toContain("not found");
    });
  });

  describe("GET /update-by-id/projectId/:projectId/taskId/:taskId", () => {
    it("should return the updated task", async () => {
      const name1 = getRandomString(10);
      let url = `/api/tasks/new-task/projectId/${projectId}/name/${name1}`;
      const resAfterAdd = await request(sever).get(url);
      const taskId = resAfterAdd.body.id;

      const name2 = getRandomString(10);
      url =
        `/api/tasks/update-by-id/projectId/${projectId}/taskId/${taskId}` +
        `?name=${name2}`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(taskId);
      expect(res.body.name).toBe(name2);
    });
    it("should return 404 with invalid taskId", async () => {
      const taskId = "123";
      const name2 = getRandomString(10);
      url =
        `/api/tasks/update-by-id/projectId/${projectId}/taskId/${taskId}` +
        `?name=${name2}`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("TASK");
      expect(res.body.message).toContain("not found");
    });
  });
});
