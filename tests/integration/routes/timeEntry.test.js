const request = require("supertest");

const apiKey = "X1RKstMZtV7NtnPX";
const workspaceId = "5fa77842e7712f7f43c89cde";
const userId = "5f4a46725a388d188799f2d5";

let sever;
let projectId = "";
let taskId = "";

const TaskServices = require("../../../services/TaskServices");
const ProjectServices = require("../../../services/ProjectServices");
const TimeEntryServices = require("../../../services/TimeEntryServices");

const projectService = new ProjectServices(apiKey, workspaceId);

describe("/api/time-entries/", () => {
  beforeAll(async () => {
    await projectService.deleteAll();
    const project = await projectService.postNew({
      name: "projectForTimeRouteTest",
    });
    projectId = project.id;
    const taskService = new TaskServices(apiKey, workspaceId, projectId);
    const task = await taskService.postNew({ name: "taskForTimeRouteTest" });
    taskId = task.id;
  });
  afterAll(async () => {
    // await projectService.deleteAll();
  });

  beforeEach(() => {
    sever = require("../../../index");
  });
  afterEach(() => {
    sever.close();
  });

  describe("GET /new-entry", () => {
    let description, urlQueryProjectId, urlQueryTaskId, urlQueryDescription;
    beforeEach(() => {
      description = getRandomString(10);
      urlQueryProjectId = `?projectId=${projectId}`;
      urlQueryTaskId = `&taskId=${taskId}`;
      urlQueryDescription = `&description=${description}`;
    });
    it("should return 200 and the time entry", async () => {
      const url =
        `/api/time-entries/new-entry` +
        urlQueryProjectId +
        urlQueryTaskId +
        urlQueryDescription;

      const res = await request(sever).get(url);

      expect(res.status).toBe(200);
      expect(res.body.description).toBe(description);
      expect(res.body.projectId).toBe(projectId);
      expect(res.body.taskId).toBe(taskId);
    });
    it("should return 200 and and null on taskId if not provided ", async () => {
      const url =
        `/api/time-entries/new-entry` + urlQueryProjectId + urlQueryDescription;

      const res = await request(sever).get(url);

      expect(res.status).toBe(200);
      expect(res.body.taskId).toBe(null);
    });
    it("should return 400 with taskId but no projectId ", async () => {
      const url =
        `/api/time-entries/new-entry?` +
        `taskId=${taskId}` +
        urlQueryDescription;
      const res = await request(sever).get(url);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("no PROJECT");
    });
  });

  describe("Get /new-entry/rollback", () => {
    let description,
      urlQueryProjectId,
      urlQueryTaskId,
      urlQueryDescription,
      rollBackMinutes,
      urlRollBackMinutes,
      url;
    beforeEach(() => {
      description = getRandomString(10);
      urlQueryProjectId = `?projectId=${projectId}`;
      urlQueryTaskId = `&taskId=${taskId}`;
      urlQueryDescription = `&description=${description}`;
      rollBackMinutes = 5;
      urlRollBackMinutes = `&rollBackMinutes=${rollBackMinutes}`;
    });
    it("should return 200 with current and new time entry", async () => {
      url =
        `/api/time-entries/new-entry/rollback` +
        urlQueryProjectId +
        urlQueryTaskId +
        urlQueryDescription +
        `&rollBackMinutes=6`;
      const res1st = await request(sever).get(url);

      url =
        `/api/time-entries/new-entry/rollback` +
        urlQueryProjectId +
        urlQueryTaskId +
        urlQueryDescription +
        urlRollBackMinutes;
      const res2nd = await request(sever).get(url);

      expect(res1st.status).toBe(200);
      expect(res2nd.status).toBe(200);
      expect(res1st.body.new.id).toBe(res2nd.body.current.id);
    });
    it("should return 400 with incorrect projectId", async () => {
      url =
        `/api/time-entries/new-entry/rollback` +
        "?projectId=123" +
        urlQueryTaskId +
        urlQueryDescription +
        urlRollBackMinutes;
      const res2nd = await request(sever).get(url);
      expect(res2nd.status).toBe(404);
      expect(res2nd.body.new.data.message).toContain("PROJECT");
      expect(res2nd.body.new.data.message).toContain("not found");
    });
  });

  describe("GET /stop-current", () => {
    let description, urlQueryDescription, url, resCurrent;
    beforeEach(async () => {
      description = getRandomString(10);
      urlQueryDescription = `?&description=${description}`;
    });
    it("should return 200 and the time entry", async () => {
      url = `/api/time-entries/new-entry` + urlQueryDescription;
      try {
        resCurrent = await request(sever).get(url);
      } catch (error) {}

      url = `/api/time-entries/stop-current`;

      const res = await request(sever).get(url);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(resCurrent.body.id);
    });
    it("should return 404 if no timer is running", async () => {
      url = `/api/time-entries/stop-current`;
      try {
        resCurrent = await request(sever).get(url);
      } catch (error) {}

      const res = await request(sever).get(url);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("time entry");
      expect(res.body.message).toContain("doesn't exist");
    });
  });

  describe("Get /stop-current/rollback", () => {
    let description,
      urlQueryDescription,
      rollBackMinutes,
      urlRollBackMinutes,
      url,
      resCurrent;
    beforeEach(async () => {
      description = getRandomString(10);
      urlQueryDescription = `?description=${description}`;
      rollBackMinutes = 5;
      urlRollBackMinutes = `&rollBackMinutes=${rollBackMinutes}`;
      url = `/api/time-entries/new-entry/rollback${urlQueryDescription}${urlRollBackMinutes}`;
      try {
        resCurrent = await request(sever).get(url);
      } catch (error) {}
    });

    it("should return 200 with the stopped time entry id and rolled back duration", async () => {
      rollBackMinutes = 3;
      urlRollBackMinutes = `&rollBackMinutes=${rollBackMinutes}`;
      url = `/api/time-entries/stop-current/rollback${urlQueryDescription}${urlRollBackMinutes}`;
      console.log(url);
      const res = await request(sever).get(url);
      const duration = res.body.timeInterval.duration;
      const durationMinutes = parseISO8601Duration(duration).minutes;

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(resCurrent.body.new.id);
      expect(durationMinutes).toBe("2");
    });

    it("should return 400 when rollback time is greater than duration", async () => {
      rollBackMinutes = 7;
      urlRollBackMinutes = `&rollBackMinutes=${rollBackMinutes}`;
      url = `/api/time-entries/stop-current/rollback${urlQueryDescription}${urlRollBackMinutes}`;
      const res = await request(sever).get(url);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("is greater than end");
    });
  });
});

function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

function parseISO8601Duration(iso8601Duration) {
  var iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

  var matches = iso8601Duration.match(iso8601DurationRegex);

  return {
    sign: matches[1] === undefined ? "+" : "-",
    years: matches[2] === undefined ? 0 : matches[2],
    months: matches[3] === undefined ? 0 : matches[3],
    weeks: matches[4] === undefined ? 0 : matches[4],
    days: matches[5] === undefined ? 0 : matches[5],
    hours: matches[6] === undefined ? 0 : matches[6],
    minutes: matches[7] === undefined ? 0 : matches[7],
    seconds: matches[8] === undefined ? 0 : matches[8],
  };
}
