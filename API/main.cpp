#include "constants/JsonF.h"
#include "routes/Routes.h"
#include "tasks/ListManager.h"
#include "crow.h"
#include "Middleware/Middleware.h"
#include"crow/middlewares/cors.h"


int main() {
    //creating a simple crow app
    crow::App<Middleware, crow::CORSHandler> app;
    auto &cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
            .origin("*") // Allow all origins for development (replace with your frontend origin in production)
            .methods(crow::HTTPMethod::GET, crow::HTTPMethod::POST, crow::HTTPMethod::PUT, crow::HTTPMethod::Delete,
                     crow::HTTPMethod::OPTIONS)
            .headers("Content-Type, Authorization, API-KEY");
    ListManager listManager;
    listManager.postList(JsonF::list::INITLIST);

    Routes::setUpRoutes(app, listManager);

    app.port(18080).run();
}
