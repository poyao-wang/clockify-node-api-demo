const config = require("../../../config.json");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;

const { getRandomString } = require("../../../functions");

let projectId = "";

const TaskServices = require("../../../services/TaskServices");
const ProjectServices = require("../../../services/ProjectServices");

const projectService = new ProjectServices(apiKey, workspaceId);

describe("tasks", () => {
  beforeAll(async () => {
    await projectService.deleteAll();
    const project = await projectService.postNew({ name: "forTasksTest" });
    projectId = project.id;
  });
  afterAll(async () => {
    await projectService.deleteAll();
  });
  describe("postNew", () => {
    it("should return the task added", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = getRandomString(10);
      const task = { name: name };

      const result = await taskService.postNew(task);

      expect(result.name).toBe(name);
    });

    it("should throw 404 if invalid projectId provided", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, "123");

      const name = getRandomString(10);
      const task = { name: name };

      await expect(async () => await taskService.postNew(task)).rejects.toThrow(
        "Request failed with status code 404"
      );
    });

    it("should throw 400 if name is duplicated", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = getRandomString(10);
      const task = { name: name };

      await taskService.postNew(task);
      await expect(async () => await taskService.postNew(task)).rejects.toThrow(
        "Request failed with status code 400"
      );
    });
  });

  describe("getAll", () => {
    it("should return an array", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name1 = getRandomString(10);
      const task1 = { name: name1 };
      const result1 = await taskService.postNew(task1);

      const name2 = getRandomString(10);
      const task2 = { name: name2 };
      const result2 = await taskService.postNew(task2);

      const resultGetAll = await taskService.getAll();

      expect(Array.isArray(resultGetAll)).toBe(true);
      expect(resultGetAll[1].id).toBe(result1.id);
      expect(resultGetAll[0].id).toBe(result2.id);
    });
    it("should throw if apiKey is incorrect", async () => {
      const taskService = new TaskServices("123", workspaceId, projectId);
      await expect(async () => {
        await taskService.getAll();
      }).rejects.toThrow("Request failed with status code 401");
    });
  });

  describe("deleteById", () => {
    it("should return the id of deleted task", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = getRandomString(10);
      const task = { name: name };

      const resultAdded = await taskService.postNew(task);
      const taskId = resultAdded.id;

      const result = await taskService.deleteById(taskId);

      expect(result.id).toBe(taskId);
    });
    it("should throw if apiKey is incorrect", async () => {
      const taskService = new TaskServices("123", workspaceId, projectId);

      await expect(
        async () => await taskService.deleteById("123")
      ).rejects.toThrow("Request failed with status code 401");
    });
  });

  describe("getByName", () => {
    it("should return the task if exists", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = getRandomString(10);
      const task = { name: name };

      const resultAdded = await taskService.postNew(task);
      const taskId = resultAdded.id;

      const result = await taskService.getByName(name);

      expect(result.name).toBe(name);
      expect(result.id).toBe(result.id);
    });
    it("should throw if name does not match", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = "abcd";
      const task = { name: name };

      await taskService.postNew(task);
      await expect(async () => {
        await taskService.getByName("a");
      }).rejects.toThrow("nameDoesNotMatch");
    });
  });

  describe("putById", () => {
    it("should return the updated task", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = getRandomString(10);
      const task = { name: name };

      const resultAdded = await taskService.postNew(task);
      const taskId = resultAdded.id;

      const name2 = getRandomString(10);
      const task2 = { name: name2 };

      const result = await taskService.putById(taskId, task2);

      expect(result.name).toBe(name2);
      expect(result.id).toBe(result.id);
    });
    it("should throw with invalid taskId", async () => {
      const taskService = new TaskServices(apiKey, workspaceId, projectId);

      const name = getRandomString(10);
      const task = { name: name };
      const taskId = "123";

      await expect(async () => {
        await taskService.putById(taskId, task);
      }).rejects.toThrow("Request failed with status code 404");
    });
  });
});
