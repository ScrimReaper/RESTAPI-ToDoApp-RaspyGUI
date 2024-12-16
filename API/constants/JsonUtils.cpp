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
