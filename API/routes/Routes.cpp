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
}
