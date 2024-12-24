//
// Created by User on 11.12.2024.
//

#ifndef ROUTES_H
#define ROUTES_H
#include <crow/app.h>

#include "../tasks/ListManager.h"


class Routes {

public:
    template <typename Middleware>
    static void setUpRoutes(crow::App<Middleware>& app, ListManager& listManager);
};
#endif //ROUTES_H
