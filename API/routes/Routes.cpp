//
// Created by User on 16.12.2024.
//

#include "Routes.h"

#include "../constants/HttpStatus.h"
#include "../constants/JsonF.h"

void Routes::setUpRoutes(crow::SimpleApp &app, ListManager &listManager) {
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
            returnVal = std::move(JsonF::util::toJson(lists));
        } catch (const std::exception &e) {
            return crow::response(HttpStatus::NOCONTENT, e.what());
        }

        return crow::response(HttpStatus::OK, returnVal);
    });

    /**
     * This Method adds a new List with a given name to the list manager and returns its name and ID to the caller
     */
    CROW_ROUTE(app, "/lists").methods("POST"_method)([&listManager](const crow::request &req) {
        auto json = crow::json::load(req.body);

        if (!JsonF::util::validatePReqList(json)) {
            return crow::response(HttpStatus::BADREQUEST, "Invalid or missing JSON Body");
        }

        const std::string newName = json[JsonF::list::NAME].s();
        int newId = listManager.postList(std::move(newName));

        //return name and id in a json
        crow::json::wvalue returnVal;
        returnVal["id"] = newId;
        returnVal["name"] = newName;
        return crow::response(HttpStatus::CREATED, returnVal);
    });

    /**
     * This Mehthod deletes a List from the Manager
     */
    CROW_ROUTE(app, "/lists/<int>").methods("DELETE"_method)([&listManager](const int id) {
        const bool successfull = listManager.deleteList(id);

        if (!successfull) {
            return crow::response(HttpStatus::NOTFOUND, "Invalid ID");
        }

        return crow::response(204, "Deleted list with id: " + std::to_string(id));
    });

    /*
     * This Method changes the name of a List and returns the new Listname and its id
     */
    CROW_ROUTE(app, "/lists/<int>").methods("PUT"_method)([&listManager](const crow::request &req, int id) {
        const auto json = crow::json::load(req.body);

        if (!JsonF::util::validatePReqList(json)) {
            return crow::response(HttpStatus::BADREQUEST, "Invalid or missing JSON Body");
        }

        const std::string newName = json[JsonF::list::NAME].s();
        bool successfull = listManager.putList(id, std::move(newName));

        if (!successfull) {
            return crow::response(HttpStatus::NOTFOUND, "Invalid ID");
        }

        crow::json::wvalue returnVal;

        returnVal["id"] = id;
        returnVal["name"] = newName;

        return crow::response(HttpStatus::OK, returnVal);
    });

    CROW_ROUTE(app, "/lists/<int>/tasks").methods("GET"_method)([](int id) {

    });

}
