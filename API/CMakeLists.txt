cmake_minimum_required(VERSION 3.30)
project(API)

set(CMAKE_CXX_STANDARD 20)

# Add executable
add_executable(API main.cpp
        constants/HttpStatus.h
        constants/JsonF.h
        routes/Routes.h
        tasks/Task.h
        tasks/TaskList.h
        tasks/ListManager.h
        tasks/ListManager.cpp
        tasks/TaskList.cpp
)

# Include Crow headers
include_directories("D:/programming/libraries/C++/Crow/include")

# Include Asio headers
include_directories("D:/programming/libraries/C++/asio-1.30.2/include")

# Link Winsock library
target_link_libraries(API PRIVATE ws2_32 Mswsock)


