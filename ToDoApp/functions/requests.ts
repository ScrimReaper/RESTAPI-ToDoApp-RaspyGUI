const BASEURL = "http://localhost:18080/lists";
import {List, Task} from "@/app/types";


//this function returns the lists with their IDs as Key Value Pairs
export async function fetchList(): Promise<List[]> {
    const response = await fetch(BASEURL,{
        method: "GET",
        headers: {
            "API-KEY": "1234"
        }
    });
    const data = await response.json();
    const listArray : List[] = [];
    let tempList : List;
    for (const item of data) {
        tempList = {
            listName: item.listBody,
            listId: item.lisId,
        }
        listArray.push(tempList);
    }
    return listArray;
}


//this function returns the tasks of a specific List in a map with their ids as keys
export async function fetchTasks(listId : number):Promise<Task[]> {
    const response = await fetch(BASEURL +"/" +  listId + "/tasks", {
        method: "GET",
        headers: {
            "API-KEY": "1234"
        }
    });
    const data = await response.json();
    const tasks = data.tasks;
    const taskArray: Task[] = [];
    let tempTask :Task;
    for (const item of tasks) {
        tempTask = {
            taskBody: item.taskBody,
            taskId: item.taskId,
        }
        taskArray.push(tempTask);
    }
    return taskArray;
}



