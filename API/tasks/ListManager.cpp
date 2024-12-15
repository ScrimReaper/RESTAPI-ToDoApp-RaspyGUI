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
