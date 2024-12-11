//
// Created by User on 11.12.2024.
//

#ifndef TASKLIST_H
#define TASKLIST_H
#include <string>
#include <vector>
#include "Task.h"

class TaskList {
    const int id;
    const std::string name;
    std::vector<Task> tasks;

public:
    TaskList(int id, std::string name) : id(id), name(std::move(name)) {
    }

    int getID() & { return id; }
    std::string getName() & { return name; }
    std::vector<Task> getTasks() { return tasks; }
};

#endif //TASKLIST_H
