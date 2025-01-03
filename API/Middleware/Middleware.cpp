//
// Created by mo on 24.12.24.
//

#include "Middleware.h"

#include <crow/http_response.h>

#include "../constants/HttpStatus.h"

void Middleware::before_handle( crow::request &req, crow::response &res,  context &context) const {

    // Handle OPTIONS preflight requests
    if (req.method == crow::HTTPMethod::OPTIONS) {
        return; // Stop further processing for OPTIONS
    }

    const auto apiReq = req.get_header_value("API-KEY");

    if (apiReq != API_KEY) {
        res.code = HttpStatus::BADREQUEST;
        res.body = "Invalid API-KEY";
        res.end();
    }
}
