//
// Created by User on 11.12.2024.
//

#ifndef JSONFIELDS_H
#define JSONFIELDS_H

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
    }

    namespace util {
        /**
         * Method that validates a Task. It checks if all the required fields are present, their types are correct and that the strings are not empty.
         * @param task the task to be checked
         * @return
         */
        static bool validateTaskJson(const crow::json::rvalue &task);
        static crow::json::wvalue toJson(const std::unordered_map<int, std::string> &items);
        static bool validateListJson(const crow::json::rvalue &req);
        static crow::json::wvalue toJson(const std::unordered_map<int, Task> &items);
    }
}
#endif //JSONFIELDS_H
