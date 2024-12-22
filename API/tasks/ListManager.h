//
// Created by User on 15.12.2024.
//

#ifndef LISTMANAGER_H
#define LISTMANAGER_H
#include "TaskList.h"


class ListManager {
    std::unordered_map<int, TaskList> container;
    int next_list_id = 0;
    int getNextListID() { return next_list_id++; }

public:
    ListManager() = default;

    /**
     * @return The Names of the Lists as Strings mapped to the IDs
     */
    std::unordered_map<int, std::string> getLists();

    bool deleteList(int listId);


    bool putList(int listId, std::string name);

    int postList(std::string name);

    const std::unordered_map<int, Task> &getTasks(int listID);

    int postTask(std::string taskBody, int listId);
    bool deleteTask(int listId, int taskId);
    bool putTask(int listId, int taskId, std::string taskBody);
};
#endif //LISTMANAGER_H
