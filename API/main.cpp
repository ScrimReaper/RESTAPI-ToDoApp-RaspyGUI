#include <iostream>
#define WIN32_LEAN_AND_MEAN
#include <math.h>

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

constexpr auto NAME_FIELD = "name";
constexpr auto DONE_FIELD = "done";
constexpr auto ID_FIELD = "id";
constexpr auto TASKS_FIELD = "tasks";

std::unordered_map<int, List> lists; //hashing by id
int next_list_id = 0;
int next_task_id = 0;
int BADREQUEST = 400;
int NOTFOUND = 404;
int CREATED = 201;
int NOCONTENT = 204;
int OK = 200;

bool validateTaskJson(const crow::json::rvalue &task) {
    return task.has(NAME_FIELD) && task.has(DONE_FIELD) && task.has(ID_FIELD);
}

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

    CROW_ROUTE(app, "/lists").methods("POST"_method)([](const crow::request &req) {
        auto json = crow::json::load(req.body);
        if (!json || !json.has("name")) {
            return crow::response(400);
        }

        std::string name = json["name"].s();
        //check if the list is empty
        if (name.empty()) {
            return crow::response(400);
        }

        //create a new list
        List list;
        list.id = next_list_id++;
        list.name = name;
        list.tasks = {};
        lists[list.id] = std::move(list);

        //return created
        crow::json::wvalue result;
        result["id"] = list.id;
        result["name"] = list.name;

        return crow::response(201, result);
    });

    CROW_ROUTE(app, "/lists/<int>").methods("DELETE"_method)([](const int id) {
        // Check if the list exists
        if (!lists.contains(id)) {
            return crow::response(404, "List not found.");
        }

        // Delete the list
        lists.erase(id);

        // Return no content response
        return crow::response(204, "Deleted list with id: " + std::to_string(id));
    });


    CROW_ROUTE(app, "/lists/<int>").methods("PUT"_method)([](const crow::request &req, crow::response &res, int id) {
        // Check if the list exists
        if (!lists.contains(id)) {
            res.code = 404;
            res.body = "List not found.";
            res.end();
            return;
        }

        // Load the JSON from the request
        auto json = crow::json::load(req.body);
        if (!json || !json.has("name")) {
            res.code = 400;
            res.body = "Invalid JSON.";
            res.end();
            return;
        }

        // Update the list
        List &list = lists[id];
        list.name = json["name"].s();

        // Return the updated list
        crow::json::wvalue result;
        result["id"] = list.id;
        result["name"] = list.name;
        res.code = 200;
        res.body = result.dump();
        res.end();
    });

    CROW_ROUTE(app, "/lists/<int>/tasks").methods("GET"_method)([](int id) {
        //check if the list exists
        if (!lists.contains(id)) {
            return crow::response(404, "List not found.");
        }
        //else return the tasks

        List &list = lists[id];
        crow::json::wvalue::list result;
        for (Task &task: list.tasks) {
            crow::json::wvalue task_json;
            task_json["id"] = task.id;
            task_json["name"] = task.name;
            task_json["done"] = task.done;
            result.push_back(std::move(task_json));
        }

        crow::json::wvalue out;
        out["list"] = std::move(result);
        return crow::response(200, out);
    });

    CROW_ROUTE(app, "/lists/<int>/tasks").methods("POST"_method)([](const crow::request &req, int id) {
        auto json = crow::json::load(req.body);

        //if there is no id to assign the tasks to they cant be posted
        if (!json || !json.has("tasks")) {
            return crow::response(400);
        }

        //check if the id exists

        if (!lists.contains(id)) {
            return crow::response(404, "List not found.");
        }

        //TODO fix the fore loop, its not compiling
        std::vector<crow::json::rvalue> tasks = json["tasks"].lo();

        //add all the tasks to the list
        List &addTo = lists[id];

        for (auto &task: tasks) {
            Task v;
            v.id = task["id"].i();
            v.name = task["name"].s();
            v.done = task["done"].b();

            addTo.tasks.push_back(std::move(v));
        }

        //return the new results

        crow::json::wvalue result;
        result["id"] = addTo.id;
        result["name"] = addTo.name;
        crow::json::wvalue::list task_list;
        for (Task &task: addTo.tasks) {
            crow::json::wvalue task_json;
            task_json["id"] = task.id;
            task_json["name"] = task.name;
            task_json["done"] = task.done;
            task_list.push_back(std::move(task_json));
        }
        result["tasks"] = std::move(task_list);

        return crow::response(201, result);
    });


    app.port(18080).run();

}
