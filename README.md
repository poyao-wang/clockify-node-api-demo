# clockify-node-api-demo

This is a demo of my back-end api that connected to [Clockify API](https://clockify.me/developers-api).
You can use GET requests to add/delete/update your database on [Clockify](https://clockify.me)

_Read this in other languages: [日本語](README.ja.md)._

<p>&nbsp;</p>

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Setup](#setup)
- [Api endpoints](#api-endpoints)
  - [Projects](#projects)
  - [Tasks](#tasks)
  - [Time Entries](#time-entries)

## Tech Stack

- nodejs

- [axios](https://www.npmjs.com/package/axios)

  - Used for making http requests to [Clockify API](https://clockify.me/developers-api)

- [express](https://www.npmjs.com/package/express)

  - Used for API sever routing

- [jest](https://www.npmjs.com/package/jest)

  - Used for API testing

<p>&nbsp;</p>

## Installation

Clone the repository

```bash
  git clone https://github.com/poyao-wang/clockify-node-api-demo.git
```

Go to the project directory

```bash
  cd clockify-node-api-demo
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

<p>&nbsp;</p>

## Setup

Change the config setup in config.json to the infor of your Clockify account.

```bash
{
  ... ,
  "apiKey": "YOUR_KEY",
  "userId": "YOUR_USERID",
  "workspaceId": "YOUR_WORKSPACEID"
}
```

<p>&nbsp;</p>

## Api endpoints

### Projects

Add/delete/update projects.

**To create new project**

```bash
GET /api/projects/new-project/NEW_PROJECT_NAME?color=COLOR_CODE
```

**To delete existing project**

```bash
GET /api/projects/delete-by-id/PROJECT_ID
```

**To find existing project by name**

```bash
GET /api/projects/find-by-name/PROJECT_NAME
```

**To update an existing project**

```bash
GET /api/projects/update-by-id/PROJECT_ID?name=NEW_PROJECT_NAMR&color=NEW_COLOR_CODE
```

<p>&nbsp;</p>

### Tasks

Add/delete/update tasks under existing project.

**To create a new task**

```bash
GET /api/tasks/new-task/projectId/PROJECT_ID/name/NEW_TASK_NAME?estimate=ESTIMATE_TIME
```

**To delete an existing task**

```bash
GET /api/tasks/delete-by-id/projectId/PROJECT_ID/taskId/TASK_ID
```

**To find an existing task by name**

```bash
GET /api/tasks/find-by-name/projectId/PROJECT_ID/name/TASK_NAME
```

**To update an existing task**

```bash
GET /api/tasks/find-by-name/projectId/PROJECT_ID/taskId/TASK_ID?name=NEW_NAME&estimate=NEW_ESTIMATE_TIME
```

<p>&nbsp;</p>

### Time Entries

Create/stop time entries.

**To create time entry**

```bash
GET /api/time-entries/new-entry?tagId=TAG_ID&description=DESCRIPTION&projectId=PROJECT_ID&taskId=TASK_ID
```

**To create time entry with roll back**

```bash
GET /api/time-entries/new-entry/rollback?rollBackMinutes=ROLL_BACK_MINUTES?tagId=TAG_ID&description=DESCRIPTION&projectId=PROJECT_ID&taskId=TASK_ID
```

**To stop current time entry**

```bash
GET /api/time-entries/stop-current
```

**To stop current time entry with roll back**

```bash
GET /api/time-entries/stop-current/rollback?rollBackMinutes=ROLL_BACK_MINUTES
```
