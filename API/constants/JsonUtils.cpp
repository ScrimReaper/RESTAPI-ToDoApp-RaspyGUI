//
// Created by User on 16.12.2024.
//

#include <crow/json.h>

#include "JsonF.h"


bool JsonF::util::validateTaskJson(const crow::json::rvalue &task) {
    bool hasFields = task.has(task::TASKBODY) && task.has(task::DONE) && task.has(task::ID);
    std::string taskbody;
    try {
        task[task::ID].i();
        task[task::DONE].b();
        taskbody = std::move(task[task::TASKBODY].s());
    } catch (const std::exception &) {
        return false;
    }


    return hasFields && taskbody.size() != 0;
}

crow::json::wvalue JsonF::util::toJson(const std::unordered_map<int, std::string> &items) {
    if (items.empty()) {
        throw new std::invalid_argument("Json items is empty");
    }
    crow::json::wvalue::list output;
    for (const auto &pair: items) {
        crow::json::wvalue item;
        item["id"] = pair.first;
        item["name"] = pair.second;
        output.push_back(std::move(item));
    }

    return output;
}

bool JsonF::util::validateListReqJson(const crow::json::rvalue &list) {
    bool hasField = list.has(list::NAME);
    std::string listName;
    try {
        listName = std::move(list[list::NAME].s());
    } catch (const std::exception &) {
        return false;
    }

    return hasField && listName.size() != 0;

}

