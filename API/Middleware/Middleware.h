//
// Created by mo on 24.12.24.
//

#ifndef MIDDLEWARE_H
#define MIDDLEWARE_H
#include <crow/http_request.h>
#include <crow/http_response.h>
#include <crow/json.h>

struct Middleware {
    std::string API_KEY;

    struct context {
    };

    Middleware() {
        const char *env = std::getenv("API_KEY");
        if (!env) {
            throw std::runtime_error("API_KEY not set");
        }
        API_KEY = env;
    }

    void before_handle( crow::request &req, crow::response &res,  context &context) const;

    void after_handle( crow::request &req, crow::response &res,  context &context) {

    }
};
#endif //MIDDLEWARE_H
