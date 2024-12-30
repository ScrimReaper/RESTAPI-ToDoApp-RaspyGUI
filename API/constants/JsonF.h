//
// Created by User on 11.12.2024.
//
#ifndef JSONFIELDS_H
#define JSONFIELDS_H
#include <crow/http_request.h>
#include <crow/json.h>

struct Task;

namespace JsonF {
    namespace task {
        constexpr auto ID = "taskId";
        constexpr auto TASKBODY = "taskBody";
    }

    namespace list {
        constexpr auto ID = "listId";
        constexpr auto NAME = "listName";
        constexpr auto TASKS = "tasks";
        constexpr auto INITLIST = "TaskDump";
    }

    namespace util {
        /**
         * Method that validates a Task. It checks if all the required fields are present, their types are correct and that the strings are not empty.
         * @param task the task to be checked
         * @return
         */
        bool validateTaskReq(const crow::request &task);
        crow::json::wvalue toJsonTasks(const std::unordered_map<int, Task> &items);
        crow::json::wvalue toJsonLists(const std::unordered_map<int, std::string> &items);
        bool validateListReq(const crow::request &req);
    }
}
#endif //JSONFIELDS_H
