cmake_minimum_required(VERSION 3.14)
project(API)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include FetchContent
include(FetchContent)

# Add executable
add_executable(API
        main.cpp
        constants/HttpStatus.h
        constants/JsonF.h
        routes/Routes.h
        tasks/Task.h
        tasks/TaskList.h
        tasks/ListManager.cpp
        tasks/TaskList.cpp
        constants/JsonUtils.cpp
        routes/Routes.cpp
)

# Fetch Crow library
FetchContent_Declare(
        crow
        GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
        GIT_TAG master  # Or specify a specific version
)
FetchContent_MakeAvailable(crow)

# Add Crow's include directory
target_include_directories(API PRIVATE ${crow_SOURCE_DIR}/include)

# Link Winsock library (if applicable)
target_link_libraries(API PRIVATE ws2_32 Mswsock)
