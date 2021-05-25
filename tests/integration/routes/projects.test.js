const request = require("supertest");
const config = require("../../../config.json");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;

const { getRandomString } = require("../../../functions");

const ProjectServices = require("../../../services/ProjectServices");

const projectService = new ProjectServices(apiKey, workspaceId);

let sever;

describe("/api/projects", () => {
  beforeAll(async () => await projectService.deleteAll());
  beforeEach(() => {
    sever = require("../../../index");
  });
  afterEach(() => {
    sever.close();
  });

  describe("GET /new-project/:name", () => {
    it("should pass with proper project name and color code", async () => {
      const name = getRandomString(10);
      const colorCode = "000000";
      const url = `/api/projects/new-project/${name}?color=${colorCode}`;

      const res = await request(sever).get(url);

      expect(res.body.name).toBe(name);
      expect(res.body.color).toBe("#" + colorCode);
      expect(res.status).toBe(200);
      await projectService.deleteById(res.body.id);
    });
    it("should return 400 with invalid color code", async () => {
      const name = getRandomString(10);
      const colorCode = "00000";
      const url = `/api/projects/new-project/${name}?color=${colorCode}`;

      const res = await request(sever).get(url);

      expect(res.body.message).toBe("Color is not valid");
      expect(res.status).toBe(400);
    });
    it("should return 400 with duplicates", async () => {
      const name = "testDuplicates";
      const url = `/api/projects/new-project/${name}`;

      const firstRes = await request(sever).get(url);
      const res = await request(sever).get(url);

      expect(res.status).toBe(400);
      await projectService.deleteById(firstRes.body.id);
    });
  });

  describe("GET /delete-by-id/:id", () => {
    it("should return the deleted project", async () => {
      const name = getRandomString(10);
      let url = `/api/projects/new-project/${name}`;
      const resAfterAdd = await request(sever).get(url);
      const id = resAfterAdd.body.id;

      url = `/api/projects/delete-by-id/${id}`;
      const res = await request(sever).get(url);

      expect(res.body.id).toBe(id);
    });
    it("should return 404 when incorrect id was provided", async () => {
      const id = "123";
      const url = `/api/projects/delete-by-id/${id}`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /find-by-name/:name", () => {
    it("should return the project found", async () => {
      const name = getRandomString(10);
      let url = `/api/projects/new-project/${name}`;
      const resAfterAdd = await request(sever).get(url);
      const id = resAfterAdd.body.id;

      url = `/api/projects/find-by-name/${name}`;
      const res = await request(sever).get(url);

      expect(res.body.id).toBe(id);
      await projectService.deleteById(id);
    });
  });

  describe("GET /update-by-id/:projectId", () => {
    it("should return the updated project", async () => {
      const name1 = getRandomString(10);
      let url = `/api/projects/new-project/${name1}`;
      const resAfterAdd = await request(sever).get(url);
      const projectId = resAfterAdd.body.id;

      const name2 = getRandomString(10);
      const colorCode = "000000";
      url =
        `/api/projects/update-by-id/${projectId}` +
        `?name=${name2}&color=${colorCode}`;
      const res = await request(sever).get(url);

      expect(res.body.id).toBe(projectId);
      expect(res.body.name).toBe(name2);
      expect(res.body.color).toBe("#" + colorCode);
    });
    it("should return 404 with invalid projectId", async () => {
      const id = "123";
      const url = `/api/projects/update-by-id/123?name=name`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(404);
    });
  });
});
