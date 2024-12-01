#include <iostream>
#define WIN32_LEAN_AND_MEAN
#include "crow.h"
#include "crow/json.h"


struct Task {
    int id;
    std::string name;
    bool done;
};

struct List {
    int id;
    std::string name;
    std::vector<Task> tasks;
};

std::vector<List> lists;
int next_list_id = 0;
int next_task_id = 0;

int main() {
    //creating a simple crow app
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]() {
        return "Hello World!";
    });

    CROW_ROUTE(app, "/lists").methods(crow::HTTPMethod::Get)([]() {
        crow::json::wvalue result;

        int taskindex = 0;
        for (auto &list: lists) {
            crow::json::wvalue list_json;
            list_json["id"] = list.id;
            list_json["name"] = list.name;


            // Create a JSON list for tasks
            crow::json::wvalue tasksJson = crow::json::wvalue::list();
            int pos = 0;
            for (auto &task: list.tasks) {
                crow::json::wvalue taskjson;
                taskjson["id"] = task.id;
                taskjson["name"] = task.name;
                taskjson["done"] = task.done;
                tasksJson["tasks"][pos++] = {taskjson};
            }#
            tasksJson.clear();
            list_json["tasks"] = {tasksJson};
            //add the list to the result and so oon

        }
    });
}
