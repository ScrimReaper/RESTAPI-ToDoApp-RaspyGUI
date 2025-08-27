//
// Created by User on 11.12.2024.
//

#ifndef ROUTES_H
#define ROUTES_H
#include <crow/app.h>
#include <crow/middlewares/cors.h>

#include "../tasks/ListManager.h"
#include "../constants/HttpStatus.h"
#include "../constants/JsonF.h"


class Routes {
public:
    template<typename Middleware>
    static void setUpRoutes(crow::App<Middleware, crow::CORSHandler> &app, ListManager &listManager) {
        CROW_ROUTE(app, "/")([]() {
            return "Hello World!";
        });

        /**
         * This Method retrieves the Names and IDs of all the Lists
         */
        CROW_ROUTE(app, "/lists").methods("GET"_method)([&listManager]() {
            const std::unordered_map<int, std::string> &lists = listManager.getLists();
            crow::json::wvalue returnVal;


            try {
                returnVal = std::move(JsonF::util::toJsonLists(lists));
            } catch (const std::exception &e) {
                return crow::response(HttpStatus::NOCONTENT, e.what());
            }

            return crow::response(HttpStatus::OK, returnVal);
        });

        /**
         * This Method adds a new List with a given name to the list manager and returns its name and ID to the caller
         */
        CROW_ROUTE(app, "/lists").methods("POST"_method)([&listManager](const crow::request &req) {
            if (!JsonF::util::validateListReq(req)) {
                return crow::response(HttpStatus::BADREQUEST, "Invalid or missing JSON Body");
            }
            auto json = crow::json::load(req.body);
            std::string newName = json[JsonF::list::NAME].s();
            int newId;
            try {
                newId = listManager.postList(newName);
            } catch (const std::invalid_argument &e) {
                return crow::response(HttpStatus::BADREQUEST, e.what());
            }


            //return name and id in a json
            crow::json::wvalue returnVal;
            returnVal["id"] = newId;
            returnVal["name"] = std::move(newName);
            return crow::response(HttpStatus::CREATED, returnVal);
        });

        /**
         * This Mehthod deletes a List from the Manager
         */
        CROW_ROUTE(app, "/lists/<int>").methods("DELETE"_method)([&listManager](const int id) {
            const bool successfull = listManager.deleteList(id);

            if (!successfull) {
                return crow::response(HttpStatus::NOTFOUND, "Invalid ID or trying to delete the TaskDump");
            }

            return crow::response(HttpStatus::NOCONTENT, "Deleted list with id: " + std::to_string(id));
        });

        /*
         * This Method changes the name of a List and returns the new Listname and its id
         */
        CROW_ROUTE(app, "/lists/<int>").methods("PUT"_method)([&listManager](const crow::request &req, int id) {
            if (!JsonF::util::validateListReq(req)) {
                return crow::response(HttpStatus::BADREQUEST, "Invalid or missing JSON Body");
            }

            const auto json = crow::json::load(req.body);

            std::string newName = json[JsonF::list::NAME].s();
            bool successfull = listManager.putList(id, newName);

            if (!successfull) {
                return crow::response(HttpStatus::NOTFOUND, "Invalid ID");
            }

            crow::json::wvalue returnVal;

            returnVal[JsonF::list::ID] = id;
            returnVal[JsonF::list::NAME] = std::move(newName);

            return crow::response(HttpStatus::OK, returnVal);
        });


        //returns a list with its tasks
        CROW_ROUTE(app, "/lists/<int>/tasks").methods("GET"_method)([&listManager](int listId) {
            std::unordered_map<int, Task> tasks;
            crow::json::wvalue returnVal;
            returnVal[JsonF::list::ID] = listId;
            returnVal[JsonF::list::TASKS];
            try {
                tasks = listManager.getTasks(listId);
            } catch (const std::exception &e) {
                return crow::response(HttpStatus::BADREQUEST, e.what());
            }


            if (tasks.empty()) {
                return crow::response(HttpStatus::OK, returnVal);
            }
            returnVal[JsonF::list::ID] = listId;
            returnVal[JsonF::list::TASKS] = JsonF::util::toJsonTasks(tasks);
            return crow::response(HttpStatus::OK, returnVal);
        });

        //adds a task to a list
        CROW_ROUTE(app, "/lists/<int>/tasks").methods("POST"_method)(
            [&listManager](const crow::request &req, int listId) {
                if (!JsonF::util::validateTaskReq(req)) {
                    return crow::response(HttpStatus::BADREQUEST, "Invalid or missing JSON Body");
                }

                auto json = crow::json::load(req.body);
                std::string newTaskBody = json[JsonF::task::TASKBODY].s();
                int newTaskId;

                try {
                    newTaskId = listManager.postTask(newTaskBody, listId);
                } catch (const std::invalid_argument &e) {
                    return crow::response(HttpStatus::BADREQUEST, e.what());
                }

                crow::json::wvalue returnVal;
                returnVal[JsonF::task::ID] = newTaskId;
                returnVal[JsonF::task::TASKBODY] = newTaskBody;

                return crow::response(HttpStatus::CREATED, returnVal);
            });

        //this method deletes a distinct task from a list
        CROW_ROUTE(app, "/lists/<int>/tasks/<int>").methods("DELETE"_method)([&listManager](int listId, int taskId) {
            bool successfull = listManager.deleteTask(listId, taskId);

            if (!successfull) {
                return crow::response(HttpStatus::NOTFOUND, "Invalid ID");
            }

            return crow::response(HttpStatus::NOCONTENT,
                                  "Deleted task with id: " + std::to_string(taskId) + " from list wit id: " +
                                  std::to_string(listId));
        });

        CROW_ROUTE(app, "/lists/<int>/tasks/<int>").methods("PUT"_method)(
            [&listManager](const crow::request &req, int listId, int taskId) {
                if (!JsonF::util::validateTaskReq(req)) {
                    return crow::response(HttpStatus::BADREQUEST, "Invalid or missing JSON Body");
                }


                auto json = crow::json::load(req.body);


                std::string newTaskBody = json[JsonF::task::TASKBODY].s();
                bool successfull = listManager.putTask(listId, taskId, newTaskBody);


                if (!successfull) {
                    return crow::response(HttpStatus::NOTFOUND, "Invalid ID, Task does not exist");
                }

                crow::json::wvalue returnVal;
                returnVal[JsonF::task::ID] = taskId;
                returnVal[JsonF::task::TASKBODY] = newTaskBody;

                return crow::response(HttpStatus::OK, returnVal);
            });
    }
};
#endif //ROUTES_H
