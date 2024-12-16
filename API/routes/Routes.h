//
// Created by User on 11.12.2024.
//

#ifndef ROUTES_H
#define ROUTES_H
#include <crow/app.h>

#include "../tasks/ListManager.h"


class Routes {
public:
    static void setUpRoutes(crow::SimpleApp& app, ListManager& listManager);
};
#endif //ROUTES_H
