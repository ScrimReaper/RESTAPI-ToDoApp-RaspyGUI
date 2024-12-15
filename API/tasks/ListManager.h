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


    const std::unordered_map<int, TaskList> &getLists() { return container; }

    bool deleteList(int listId);

    TaskList getList(int list_id);

    bool putList(int listId, std::string name) ;

    int postList(std::string name) ;
};
#endif //LISTMANAGER_H
