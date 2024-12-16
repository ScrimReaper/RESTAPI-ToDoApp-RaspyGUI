//
// Created by User on 11.12.2024.
//

#ifndef JSONFIELDS_H
#define JSONFIELDS_H

namespace JsonF {
    namespace task {
        constexpr auto ID = "id";
        constexpr auto TASKBODY = "taskBody";
        constexpr auto DONE = "done";
    }

    namespace list {
        constexpr auto ID = "id";
        constexpr auto NAME = "name";
        constexpr auto TASKS = "tasks";
    }

    namespace util {
        /**
         * Method that validates a Task. It checks if all the required fields are present, their types are correct and that the strings are not empty.
         * @param task the task to be checked
         * @return
         */
        bool validateTaskJson(const crow::json::rvalue &task);
    }
}
#endif //JSONFIELDS_H
