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

std::unordered_map<int, List> lists; //hashing by id
int next_list_id = 0;
int next_task_id = 0;

int main() {
    //creating a simple crow app
    crow::SimpleApp app;


    CROW_ROUTE(app, "/")([]() {
        return "Hello World!";
    });

    CROW_ROUTE(app, "/lists").methods("GET"_method)([]() {
        crow::json::wvalue::list result;

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
                tasks_Json.push_back(std::move(task_json));
                task_json.clear();
            }
            list_json["tasks"] = std::move(tasks_Json);
            //add to result
            result.push_back(std::move(list_json));
            list_json.clear();
        }

        crow::json::wvalue out;
        out["lists"] = std::move(result);
        return crow::response(200, out);
    });



    CROW_ROUTE(app, "/lists/<int>").methods("DELETE"_method)([](const int id){
        // Check if the list exists
        if (!lists.contains(id)) {
            return crow::response(404, "List not found.");
        }

        // Delete the list
        lists.erase(id);

        // Return no content response
        return crow::response(204, "Deleted list with id: " + std::to_string(id));
    });
}
