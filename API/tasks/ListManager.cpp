//
// Created by User on 15.12.2024.
//
#include "ListManager.h"

#include <stdexcept>

bool ListManager::deleteList(const int listId) {
    return container.erase(listId) != 0;
}

TaskList ListManager::getList(const int list_id) {
    try {
        return container.at(list_id);
    } catch (const std::out_of_range) {
        throw std::invalid_argument("List not found.");
    }
}

bool ListManager::putList(const int listId, std::string name) {
    if (name.empty()) {
        throw new std::invalid_argument("Name cannot be empty.");
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
        throw new std::invalid_argument("Name cannot be empty.");
    }
    const int listID = getNextListID();
    container[listID] = std::move(TaskList(listID, std::move(name)));
    return listID;
}

std::unordered_map<int, std::string> ListManager::getLists() {
    std::unordered_map<int, std::string> list;
    if (container.empty()) {
        return list;
    }
    for (const auto &pair : container) {
        int key = pair.first;
        TaskList tempList = pair.second;
        std::string name = tempList.getName();
        list[key] = std::move(name);
    }

    return list;
}
