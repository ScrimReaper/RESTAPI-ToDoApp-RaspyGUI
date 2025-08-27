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

    /**
     * @brief Adds tasks to a specific list.
     *
     * This method handles a POST request to add multiple tasks to a list identified
     * by its ID. The tasks are provided as an array in the JSON body. Each task must
     * include the fields 'name' (string), 'done' (boolean), and 'id' (integer).
     *
     * @param req The HTTP request object containing the JSON payload.
     *            The payload must include an array under the key "tasks".
     * @param id The ID of the list to which the tasks should be added.
     * @return A crow::response object with the following:
     *         - 201 CREATED: Returns the updated list, including the added tasks.
     *         - 404 NOT FOUND: If the list with the given ID does not exist.
     *         - 400 BAD REQUEST: If the JSON body is invalid or required fields are missing/incorrect.
     *
     * @throws std::exception if the JSON parsing fails or invalid data types are encountered.
     *
     * @note This method validates each task's fields and type safety. If any task fails validation,
     *       the process stops, and an error is returned.
     */
    CROW_ROUTE(app, "/lists/<int>/tasks").methods("POST"_method)([](const crow::request &req, int id) {
        auto json = crow::json::load(req.body);

        //if there is no id to assign the tasks to they cant be posted
        if (!json || !json.has(TASKS_FIELD)) {
            return crow::response(BADREQUEST, "Invalid or missing JSON Body");
        }

        //check if the id exists
        if (!lists.contains(id)) {
            return crow::response(NOTFOUND, "List not found.");
        }

        //check if the tasks are valid and the type is correct
        std::vector<crow::json::rvalue> tasks;
        try {
            tasks = json[TASKS_FIELD].lo();
        } catch (const std::exception &e) {
            return crow::response(BADREQUEST, "Invalid Type for 'tasks'. Must be an array.");
        }

        //add all the tasks to the list
        List &addTo = lists[id];

        for (auto &task: tasks) {
            Task v;
            //check if the task is valid
            if (!validateTaskJson(task)) {
                return crow::response(BADREQUEST, "Missing required fields: 'name' and/or 'done' and/or 'id'.");
            }

            //cjheck if the fields are of the correct type
            std::string task_name;
            bool done_temp;
            int id_temp;
            try {
                task_name = task[NAME_FIELD].s();
                done_temp = task[DONE_FIELD].b();
                id_temp = task[ID_FIELD].i();
            } catch (const std::exception &e) {
                return crow::response(BADREQUEST, "Invalid type for 'done': must be a boolean or 'name': must be a string.");
            }

            //add the task to the list
            v.done = done_temp;
            v.name = task_name;
            v.id = id_temp;

            addTo.tasks.push_back(std::move(v));
        }

        //return the new results

        crow::json::wvalue result;
        result[ID_FIELD] = addTo.id;
        result[NAME_FIELD] = addTo.name;
        crow::json::wvalue::list task_list;
        for (Task &task: addTo.tasks) {
            crow::json::wvalue task_json;
            task_json[ID_FIELD] = task.id;
            task_json[NAME_FIELD] = task.name;
            task_json[DONE_FIELD] = task.done;
            task_list.push_back(std::move(task_json));
        }
        result[TASKS_FIELD] = std::move(task_list);

        return crow::response(CREATED, result);
    });

    /**
     * @brief Deletes a specific task from a list.
     *
     * This method handles a DELETE request to remove a task from a list identified
     * by its ID. The task is specified by its unique `task_id`.
     *
     * @param list_id The ID of the list containing the task to delete.
     * @param task_id The ID of the task to be removed from the list.
     * @return A crow::response object with the following:
     *         - 204 NO CONTENT: If the task is successfully deleted.
     *         - 404 NOT FOUND: If the list or task does not exist.
     *
     * @note The task is removed from the list in-place. If no task matches the given
     *       `task_id`, the method returns a 404 response.
     */
    CROW_ROUTE(app, "/lists/<int>/tasks/<int>").methods("DELETE"_method)([](int list_id, int task_id) {
        //check if the list exists
        if (!lists.contains(list_id)) {
            return crow::response(NOTFOUND, "List not found.");
        }

        //check if the task exists
        List &list = lists[list_id];
        std::vector<Task> &tasks = list.tasks;
        int c;
        for (auto &task: tasks) {
            if (task.id == task_id) {
                tasks.erase(tasks.begin() + c);
                return crow::response(NOCONTENT);
            }
            c++;
        }
        return crow::response(404, "Task not found.");
    });

    /**
    * @brief Updates a specific task in a list.
    *
     * This method handles a PUT request to update the details of a specific task
     * within a given list. It validates the input JSON, checks for the existence
     * of the list and task, and updates the task's details if all validations pass.
     *
     * @param req The HTTP request object containing the JSON payload.
     *            The payload must include the fields "name" (string) and "done" (boolean).
     * @param list_id The ID of the list containing the task to update.
     * @param task_id The ID of the task to update.
     * @return A crow::response object with the following:
     *         - 200 OK if the task is successfully updated.
     *         - 404 NOT FOUND if the list or task is not found.
     *         - 400 BAD REQUEST if the JSON is invalid or required fields are missing.
     *
     * @throws std::exception if there is an error parsing the JSON payload.
     *
     * @note This method expects the JSON payload to be well-formed. If invalid types
     *       are provided for the fields, an error response is returned.
     */
    CROW_ROUTE(app, "/list<int>/tasks/<int>").methods("PUT"_method)(
        [](const crow::request &req, int list_id, int task_id) {
            //check the input
            //check if the list exists
            if (!lists.contains(list_id)) {
                return crow::response(NOTFOUND, "List not found.");
            }
            //check the request
            auto task_json = crow::json::load(req.body);
            //check if the json is valid
            if (!task_json) {
                return crow::response(BADREQUEST, "Invalid or missing JSON Body");
            }
            //check if the required fields are present
            if (!validateTaskJson(task_json)) {
                return crow::response(BADREQUEST, "Missing required fields: 'name' and/or 'done'.");
            }

            //check if the fields are of the correct type
            bool is_done;
            std::string task_name;
            try {
                is_done = task_json[DONE_FIELD].b();
                task_name = task_json[NAME_FIELD].s();
            } catch (const std::exception &e) {
                return crow::response(
                    BADREQUEST, "Invalid type for 'done': must be a boolean or 'name': must be a string.");
            }


            //check for the task
            List &list = lists[list_id];
            for (Task &task: list.tasks) {
                if (task.id == task_id) {
                    task.done = is_done;
                    task.name = task_name;
                    return crow::response(OK, "Task was successfully updated");
                }
            }

            //task not found
            return crow::response(NOTFOUND, "Task was not found");
        }
    );

    app.port(18080).run();
}
