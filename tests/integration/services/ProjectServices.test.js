const config = require("../../../config.json");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;

const { getRandomString } = require("../../../functions");

const ProjectServices = require("../../../services/ProjectServices");

describe("projects", () => {
  afterAll(async () => {
    await new ProjectServices(apiKey, workspaceId).deleteAll();
  });

  describe("getAll", () => {
    it("should return an array", async () => {
      const result = await new ProjectServices(apiKey, workspaceId).getAll();
      expect(Array.isArray(result)).toBe(true);
    });
    it("should throw if apiKey is incorrect", async () => {
      const service = new ProjectServices("123", workspaceId);
      expect(async () => await service.getAll()).rejects.toThrow(
        "Request failed with status code 401"
      );
    });
  });

  describe("postNew", () => {
    it("should return the added project", async () => {
      const service = new ProjectServices(apiKey, workspaceId);
      const name = getRandomString(10);
      const project = { name: name };

      const result = await service.postNew(project);

      expect(result.name).toBe(name);

      await service.deleteById(result.id);
    });
    it("should throw if apiKey is incorrect", async () => {
      const service = new ProjectServices("123", workspaceId);

      const name = getRandomString(10);
      const project = { name: name };

      expect(async () => await service.postNew(project)).rejects.toThrow(
        "Request failed with status code 401"
      );
    });
    it("should throw if project name already exists", async () => {
      const service = new ProjectServices(apiKey, workspaceId);
      const name = getRandomString(10);
      const project = { name: name };

      await service.postNew(project);

      expect(async () => await service.postNew(project)).rejects.toThrow(
        "Request failed with status code 400"
      );
    });
  });

  describe("deleteById", () => {
    it("should return the id of deleted project", async () => {
      const service = new ProjectServices(apiKey, workspaceId);
      const name = getRandomString(10);

      const postResult = await service.postNew({ name: name });
      const projectId = postResult.id;

      const result = await service.deleteById(projectId);

      expect(result.id).toBe(projectId);
    });
    it("should throw if apiKey is incorrect", async () => {
      const service = new ProjectServices("123", workspaceId);

      expect(async () => await service.deleteById("123")).rejects.toThrow(
        "Request failed with status code 401"
      );
    });
  });

  describe("deleteAll", () => {
    it("should delete all projects and return an empty array", async () => {
      const service = new ProjectServices(apiKey, workspaceId);
      const result = await service.postNew({ name: "dummy" });

      await new ProjectServices(apiKey, workspaceId).deleteAll();
      const resultAfterDelete = await service.getAll();
      expect(resultAfterDelete.length).toBe(0);
    });
    it("should throw if apiKey is incorrect", async () => {
      const service = new ProjectServices("123", workspaceId);
      expect(async () => await service.deleteAll()).rejects.toThrow(
        "Request failed with status code 401"
      );
    });
  });

  describe("getByName", () => {
    it("should return the project if exists", async () => {
      const name = getRandomString(10);
      const project = { name: name };
      const result = await new ProjectServices(apiKey, workspaceId).postNew(
        project
      );

      const findResult = await new ProjectServices(
        apiKey,
        workspaceId
      ).getByName(name);

      expect(result.name).toBe(findResult.name);
      expect(result.id).toBe(findResult.id);
    });
    it("should throw nameDoesNotMatch if name does not match", async () => {
      const service = new ProjectServices(apiKey, workspaceId);

      const name = "abcd";
      const project = { name: name };
      await service.postNew(project);

      expect(async () => await service.getByName("a")).rejects.toThrow(
        "nameDoesNotMatch"
      );
    });
  });

  describe("putById", () => {
    it("should return the updated project", async () => {
      const service = new ProjectServices(apiKey, workspaceId);
      const name1 = getRandomString(10);
      const project1 = { name: name1 };

      const postResult = await service.postNew(project1);
      const projectId = postResult.id;

      const name2 = getRandomString(10);
      const project2 = { name: name2 };
      const result = await service.putById(projectId, project2);

      expect(result.id).toBe(projectId);
    });
    it("should throw with incorrect projectId", async () => {
      const service = new ProjectServices(apiKey, workspaceId);
      const name = getRandomString(10);
      const project = { name: name };

      expect(async () => await service.putById("123", project)).rejects.toThrow(
        "Request failed with status code 404"
      );
    });
  });
});
