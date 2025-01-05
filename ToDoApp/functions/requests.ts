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
        return [{listName:"TaskDump", listId:0}];
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

export async function postList(listName: string) {
    try {
        const response = await fetch(BASEURL, {
            method: "POST",
            headers: {
                "API-KEY": "1234"
            },
            body: JSON.stringify({listName: listName}),
        });
        const data = await response.json();

        return response.status === 201 ? data.listId : null;
    } catch (e) {
        console.error("There was an Error posting the list" + e);
        return null;
    }


}

export async function postTask(listId: number, taskBody:string) {
    try {
        const response = await fetch(BASEURL + "/" + listId + "/tasks", {
            method: "POST",
            headers: {
                "API-KEY": "1234"
            },
            body: JSON.stringify({taskBody: taskBody}),
        })
        const task = await response.json();
        return response.status === 201 ? task.taskId : null;
    } catch (error) {
        console.error("There was an Error posting the task", error);
        return null
    }
}

export async function deleteTask(listId: number, taskId: number) {
    try {
        const response = await fetch(BASEURL + "/" + listId + "/tasks/" + taskId, {
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

export async function deleteList(listID:number) {
    try {
        const response = await fetch(BASEURL + "/" + listID, {
            method: "DELETE",
            headers: {
                "API-KEY": "1234"
            }
        })
        return response.status === 204;
    }catch (error) {
        console.error("There was an Error deleteing the list" + error);
        return false;
    }
}

export async function putList(listId:number, listName:string) {
    try {
        const response = await fetch(BASEURL + "/" + listId,  {
            method: "PUT",
            headers: {
                "API-KEY": "1234"
            },
            body: JSON.stringify({listName: listName})
        })
        return response.ok;
    } catch (error){
        console.error("There was an Error puting the list" + error);
        return false;
    }
}


export async function putTask(listId:number, taskId:number, taskBody:string) {
    try {
        const response = await fetch(BASEURL + "/" + listId + "/tasks/"+taskId , {
            method: "PUT",
            headers: {
                "API-KEY": "1234"
            },
            body: JSON.stringify({taskBody: taskBody}),
        })
        return response.ok;
    } catch (error){
        console.error("There was an Error puting the task" + error);
        return false;
    }
}


