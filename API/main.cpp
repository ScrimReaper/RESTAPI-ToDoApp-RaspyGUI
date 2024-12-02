#include <iostream>
#define WIN32_LEAN_AND_MEAN
#include "crow.h"
#include "crow/json.h"
#include <unordered_map>


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

std::unordered_map<std::string,List> lists;
int next_list_id = 0;
int next_task_id = 0;

int main() {
    //creating a simple crow app
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]() {
        return "Hello World!";
    });

    CROW_ROUTE(app, "/lists").methods(crow::HTTPMethod::GET)([]() {
        crow::json::wvalue result;
        int pos = 0;

        if (lists.empty()) {
            return crow::response(204);
        }

        crow::json::wvalue list_json;
        for (auto &temp: lists) {
            List list = temp.second;
            list_json["id"] = list.id;
            list_json["name"] = list.name;


            // Create a JSON list for tasks
            crow::json::wvalue::list tasks_Json;
            crow::json::wvalue task_json;
            for (auto &task: list.tasks) {
                task_json["id"] = task.id;
                task_json["name"] = task.name;
                task_json["done"] = task.done;
                tasks_Json.push_back(task_json);
                task_json.clear();
            }
            list_json["tasks"] = {tasks_Json};
            //add to result
            result["lists"][pos++] = {list_json};
            list_json.clear();
        }
        return crow::response(200, result);
    });

    CROW_ROUTE(app, "/lists").methods(crow::HTTPMethod::POST)([](std::string name) {
        //check if the list is empty
        if (name.empty()) {
            return crow::response(400);
        }

        //if the name already exists in the map return bad request
        if (lists.find(name) != lists.end()) {
            return crow::response(400);
        }

        List list;
        list.id = next_list_id++;
        list.name = name;
        list.tasks = {};
    });
}
