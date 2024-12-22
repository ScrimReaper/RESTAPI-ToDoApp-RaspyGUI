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
    // Using emplace to construct the object directly in the map, avoiding unnecessary default construction.
    // This improves efficiency and eliminates the need for a default constructor in TaskList.
    tasks.emplace(nextId, std::move(newTask)); //use emplace

    return nextId;
}

bool TaskList::putTask(const int taskId, std::string taskBody) {
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

    return true;
}

bool TaskList::deleteTask(int taskId) {
    return tasks.erase(taskId) != 0;
}
