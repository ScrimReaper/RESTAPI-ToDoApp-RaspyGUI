#include "constants/JsonF.h"
#include "routes/Routes.h"
#include "tasks/ListManager.h"
#include "crow.h"
#include "Middleware/Middleware.h"


int main() {
    //creating a simple crow app
    crow::App<Middleware> app;
    ListManager listManager;
    listManager.postList(JsonF::list::INITLIST);

    Routes::setUpRoutes(app, listManager);

    app.port(18080).run();
}
