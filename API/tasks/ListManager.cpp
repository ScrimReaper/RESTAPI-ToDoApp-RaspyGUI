//
// Created by User on 15.12.2024.
//
#include "ListManager.h"

#include <stdexcept>

bool ListManager::deleteList(const int listId) {
    if (listId == 0) {
        return false;
    }
    return container.erase(listId) != 0;
}


bool ListManager::putList(const int listId, std::string name) {
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
    if (!container.contains(listId)) {
        return false;
    }
    TaskList &list = container[listId];
    list.setName(std::move(name));
    return true;
}

int ListManager::postList(std::string name) {
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
    const int listID = getNextListID();
    container.emplace(listID, std::move(TaskList(listID, std::move(name))));
    return listID;
}

std::unordered_map<int, std::string> ListManager::getLists() {
    std::unordered_map<int, std::string> list;
    if (container.empty()) {
        return list;
    }
    for (const auto &pair: container) {
        int key = pair.first;
        TaskList tempList = pair.second;
        std::string name = tempList.getName();
        list[key] = std::move(name);
    }

    return list;
}

const std::unordered_map<int, Task> &ListManager::getTasks(int listID) {
    if (container.contains(listID)) {
        const TaskList &list = container[listID];
        return list.getTasks();
    }
    throw std::invalid_argument("List not found.");
}

bool ListManager::putTask(int listId, int taskId, std::string taskBody) {
    if (container.contains(listId)) {
        TaskList &list = container[listId];

        return list.putTask(taskId, taskBody);
    }
    return false;
}

int ListManager::postTask(std::string taskBody, int listId) {
    if (container.contains(listId)) {
        TaskList &list = container[listId];
        return list.postTask(taskBody);
    }
    throw std::invalid_argument("List not found.");
}

bool ListManager::deleteTask(int listId, int taskId) {
    if (container.contains(listId) ) {
        TaskList &list = container[listId];
        return list.deleteTask(taskId);
    }
    return false;
}

