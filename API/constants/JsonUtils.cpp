//
// Created by User on 16.12.2024.
//

#include <crow/json.h>

#include "JsonF.h"
#include "../tasks/Task.h"


struct Task;

bool JsonF::util::validateTaskJson(const crow::json::rvalue &task) {
    bool hasFields = task.has(task::TASKBODY) && task.has(task::ID);
    std::string taskbody;
    try {
        task[task::ID].i();
        taskbody = std::move(task[task::TASKBODY].s());
    } catch (const std::exception &) {
        return false;
    }


    return hasFields && !taskbody.empty();
}

crow::json::wvalue JsonF::util::toJson(const std::unordered_map<int, std::string> &items) {
    crow::json::wvalue::list output;
    if (items.empty()) { return output; }
    for (const auto &pair: items) {
        crow::json::wvalue item;
        item[list::ID] = pair.first;
        item[list::NAME] = pair.second;
        output.push_back(std::move(item));
    }

    return output;
}

bool JsonF::util::validateListJson(const crow::json::rvalue &req) {
    bool hasField = req.has(list::NAME);
    std::string listName;
    try {
        listName = std::move(req[list::NAME].s());
    } catch (const std::exception &) {
        return false;
    }

    return hasField && !listName.empty();
}

crow::json::wvalue JsonF::util::toJson(const std::unordered_map<int, Task> &items) {
    crow::json::wvalue temp;
    crow::json::wvalue::list tasklist;
    for (const auto &[id, task]: items) {
        temp[task::ID] = id;
        temp[task::TASKBODY] = task.taskBody;
        tasklist.push_back(std::move(temp));
    }
    return tasklist;
}
