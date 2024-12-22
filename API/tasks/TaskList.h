//
// Created by User on 11.12.2024.
//

#ifndef TASKLIST_H
#define TASKLIST_H
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <utility>

#include "Task.h"

class TaskList {
    int id;
    std::string name;
    /**
     * A map of tasks in the list, hashed by their ID.
     */
    std::unordered_map<int, Task> tasks;
    int next_task_id = 0;
    int getNextTaskID() { return next_task_id++; }

public:
    TaskList(const int id, std::string name) : id(id), name(std::move(name)) {
    }

    TaskList() = default; //default constructor for the maps


    int getID() { return id; }
    std::string getName() { return name; }
    const std::unordered_map<int, Task> &getTasks() const { return tasks; }
    /**
     *
     * @param newName cannot be empty, new Name to be set
     */
    void setName(std::string newName) {
        if (name.empty()) {
            throw new std::invalid_argument("Name cannot be empty.");
        }

        this->name = std::move(newName);
    }


    int postTask(std::string taskBody);

    bool putTask(int taskId, std::string taskBody);

    bool deleteTask(int taskId);
};

#endif //TASKLIST_H
