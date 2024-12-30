//
// Created by User on 16.12.2024.
//

#include <crow/http_request.h>
#include <crow/json.h>
#include <crow/mustache.h>

#include "JsonF.h"
#include "../tasks/Task.h"


bool JsonF::util::validateTaskReq(const crow::request &req) {
    if (req.body.empty()) {return false;}
    auto json = crow::json::load(req.body);
    bool hasFields = json.has(task::TASKBODY);
    std::string taskbody;
    try {
        taskbody = json[task::TASKBODY].s();
    } catch (const std::exception &) {
        return false;
    }


    return hasFields && !taskbody.empty();
}

crow::json::wvalue JsonF::util::toJsonLists(const std::unordered_map<int, std::string> &items) {
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

bool JsonF::util::validateListReq(const crow::request &req) {
    if (req.body.empty()) { return false; }

    auto json = crow::json::load(req.body);
    bool hasField = json.has(list::NAME);
    std::string listName;
    try {
        listName = std::move(json[list::NAME].s());
    } catch (const std::exception &) {
        return false;
    }

    return hasField && !listName.empty();
}

crow::json::wvalue JsonF::util::toJsonTasks(const std::unordered_map<int, Task> &items) {
    crow::json::wvalue temp;
    crow::json::wvalue::list tasklist;
    for (const auto &[id, task]: items) {
        temp[task::ID] = id;
        temp[task::TASKBODY] = task.taskBody;
        tasklist.push_back(std::move(temp));
    }
    return tasklist;
}
