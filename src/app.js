const express = require("express");
const cors = require("cors");
const {v4 : uuidv4, validate: isUuid} = require("uuid")

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function idValidate(request, response, next){
    const {id} = request.params;
    if(!isUuid(id)){
        return response.status(400).json('error: invalid id');
    }
    const projectIndex = repositories.findIndex(project => project.id === id);
    if(projectIndex<0){
        return response.status(400).json('error: project not found');
    }
    request.id = {id, projectIndex};
    return next();
}

app.use('/repositories/:id', idValidate);

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {title, url, techs} = request.body;
    const project = {id: uuidv4(), title, url, techs, likes : 0};
    repositories.push(project)
    response.json(project)
});

app.put("/repositories/:id", (request, response) => {
    const {id, projectIndex} = request.id;
    const {title, url, techs} = request.body;
    const {likes} = repositories[projectIndex];

    repositories[projectIndex] = {
        id : id, title, url, techs, likes
    }
    return response.json(repositories[projectIndex])
});

app.delete("/repositories/:id", (request, response) => {
    const id = request.id;
    repositories.splice(id.projectIndex, 1);
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const id = request.id;
    const likes = ++repositories[id.projectIndex].likes;
    return response.json({likes});
});

module.exports = app;

