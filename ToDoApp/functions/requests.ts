const BASEURL = "http://localhost:18080/lists";


//this function returns the lists with their IDs as Key Value Pairs
export async function fetchList(): Promise<Map<number, string>> {
    const response = await fetch(BASEURL,{
        method: "GET",
        headers: {
            "API-KEY": "1234"
        }
    });
    const data = await response.json();
    const listMap = new Map<number, string>;
    for (const item of data) {
        listMap.set(item.listId, item.Name);
    }
    return listMap;
}


//this function returns the tasks of a specific List in a map with their ids as keys
async function fetchTasks(listId : number):Promise<Map<Number, String>> {
    const response = await fetch(BASEURL+ listId + "/tasks", {
        method: "GET",
        headers: {
            "API-KEY": "1234"
        }
    });
    const data = await response.json();
    const tasks = data.tasks;
    const listMap = new Map<Number, String>;
    for (const item of tasks) {
        listMap.set(item.taskId, item.taskBody)
    }
    return listMap;
}



