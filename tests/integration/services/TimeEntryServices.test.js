const config = require("../../../config.json");

const apiKey = config.apiKey;
const workspaceId = config.workspaceId;
const userId = config.userId;

const {
  getRandomString,
  getISOStringWithoutSecsAndMillisecs1,
} = require("../../../functions");

let projectId = "";
let taskId = "";

const TaskServices = require("../../../services/TaskServices");
const ProjectServices = require("../../../services/ProjectServices");
const TimeEntryServices = require("../../../services/TimeEntryServices");

const projectService = new ProjectServices(apiKey, workspaceId);

describe("timeEntries", () => {
  beforeAll(async () => {
    await projectService.deleteAll();
    const project = await projectService.postNew({
      name: "projectForTimeEntryTest",
    });
    projectId = project.id;
    const taskService = new TaskServices(apiKey, workspaceId, projectId);
    const task = await taskService.postNew({ name: "taskForTimeEntryTest" });
    taskId = task.id;
  });
  afterAll(async () => {
    await projectService.deleteAll();
  });

  describe("postNew", () => {
    it("should return the time entry added", async () => {
      const timeEntryService = new TimeEntryServices(
        apiKey,
        workspaceId,
        userId
      );
      const description = getRandomString(10);
      const start = new Date();
      const timeEntry = { start, description, projectId, taskId };
      const result = await timeEntryService.postNew(timeEntry);

      expect(result.description).toBe(description);
      expect(result.taskId).toBe(taskId);
      expect(result.projectId).toBe(projectId);
    });
    it("should return 404 if invalid projectId provided", async () => {
      const timeEntryService = new TimeEntryServices(
        apiKey,
        workspaceId,
        userId
      );
      const description = getRandomString(10);
      const start = new Date();
      const timeEntry = { start, description, projectId: "123", taskId };

      await expect(
        async () => await timeEntryService.postNew(timeEntry)
      ).rejects.toThrow("Request failed with status code 404");
    });
  });

  describe("stopCurrent", () => {
    it("should return the stopped time entry", async () => {
      const timeEntryService = new TimeEntryServices(
        apiKey,
        workspaceId,
        userId
      );
      const description = getRandomString(10);
      const start = new Date();
      const timeEntry = { start, description, projectId, taskId };
      await timeEntryService.postNew(timeEntry);

      const end = new Date();
      const result = await timeEntryService.stopCurrent({ end });

      const endTrimmed = getISOStringWithoutSecsAndMillisecs1(end);

      expect(result.timeInterval.end).toContain(endTrimmed);
    });
    it("should throw 404 if no time entry is running", async () => {
      const timeEntryService = new TimeEntryServices(
        apiKey,
        workspaceId,
        userId
      );

      const end = new Date();

      await expect(async () => {
        await timeEntryService.stopCurrent({ end });
        await timeEntryService.stopCurrent({ end });
      }).rejects.toThrow("Request failed with status code 404");
    });
  });
});
