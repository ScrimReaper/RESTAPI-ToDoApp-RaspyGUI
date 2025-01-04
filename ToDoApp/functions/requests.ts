const BASEURL = "http://localhost:18080/lists";
import {List, Task} from "@/app/types";


//this function returns the lists with their IDs as Key Value Pairs
export async function fetchList(): Promise<List[]> {
    let data;
    try {
        const response = await fetch(BASEURL, {
            method: "GET",
            headers: {
                "API-KEY": "1234"
            }
        });
        data = await response.json();


    } catch (error) {
        console.error("There was an Error fetching the Lists", error);
        return [];
    }
    const listArray: List[] = [];
    let tempList: List;
    for (const item of data) {
        tempList = {
            listId: item.listId,
            listName: item.listName,
        }
        listArray.push(tempList);
    }
    return listArray;
}


//this function returns the tasks of a specific List in a map with their ids as keys
export async function fetchTasks(listId: number): Promise<Task[]> {
    let data;

    try {
        const response = await fetch(BASEURL + "/" + listId + "/tasks", {
            method: "GET",
            headers: {
                "API-KEY": "1234"
            }
        });
        data = await response.json();
    } catch (error) {
        console.error("There was an Error fetching the tasks ", error);
        return [];
    }

    const tasks = data.tasks;
    if (!tasks) {
        return [];
    }
    const taskArray: Task[] = [];
    let tempTask: Task;
    for (const item of tasks) {
        tempTask = {
            taskBody: item.taskBody,
            taskId: item.taskId,
        }
        taskArray.push(tempTask);
    }
    return taskArray;
}

async function postList(listName: string) {
    try {
        const response = await fetch(BASEURL, {
            method: "POST",
            headers: {
                "API-KEY": "1234"
            },
            body: JSON.stringify({listName: listName}),
        });
        return response.status === 201 //if req was created return true
    } catch (e) {
        console.error("There was an Error posting the list" + e);
        return false;
    }


}

async function postTask(listId: number, taskBody:string) {
    try {
        const response = await fetch(BASEURL + "/" + listId + "/tasks", {
            method: "POST",
            headers: {
                "API-KEY": "1234"
            },
            body: JSON.stringify({taskBody: taskBody}),
        })
        return response.status === 201
    } catch (error) {
        console.error("There was an Error posting the task", error);
        return false;
    }
}

async function deleteTask(listId: number, taskId: number) {
    try {
        const response = await fetch(BASEURL + "/" + listId + "/tasks" + taskId, {
            method: "DELETE",
            headers: {
                "API-KEY": "1234"
            }
        })
        return response.status === 204;
    } catch (error) {
        console.error("There was an Error deleteing the task" + error);
        return false;
    }

}



