//
// Created by User on 16.12.2024.
//

#include "TaskList.h"

#include <stdexcept>

#include "Task.h"


int TaskList::postTask(std::string taskBody) {
    if (taskBody.empty()) {
        throw new std::invalid_argument("Name cannot be empty.");
    }
    Task newTask;
    const int nextId = getNextTaskID();
    newTask.id = nextId;
    newTask.taskBody = std::move(taskBody);
    newTask.done = false;
    tasks[nextId] = std::move(newTask);

    return nextId;
}

bool TaskList::putTask(const int taskId, std::string taskBody, bool done) {
    if (name.empty()) {
        return false;
        //for future logging maybe throw the exception, for now just return false
        //throw std::invalid_argument("Name cannot be empty.");
    }
    if (!tasks.contains(taskId)) {
        return false;
    }
    Task &task = tasks[taskId];
    task.taskBody = std::move(taskBody);
    task.done = done;

    return true;
}

bool TaskList::deleteTask(int taskId) {
    return tasks.erase(taskId) != 0;
}
