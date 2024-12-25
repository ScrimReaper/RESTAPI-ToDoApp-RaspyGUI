
import tkinter as tk
import requests



def fetchContent():
    response = requests.get(url = "http://localhost:18080/lists/0/tasks", headers={"API-KEY": "1234"})
    data = response.json()
    tasks = data["tasks"]
    task_pairs = [{"taskId": task["taskId"], "taskBody": task["taskBody"]} for task in tasks]
    return task_pairs

def removeItem(list,map):
    for i in list.curselection():
        trueID = map[i]
        reqUrl = "http://localhost:18080/lists/0/tasks/" + str(trueID)
        response = requests.delete(url= reqUrl, headers={"API-KEY": "1234"})
        if (response.status_code == 204):
            list.delete(i)

root = tk.Tk()

root.title("")

root.geometry("300x200")


task_map = {}
label = tk.Label(root, text="Todays To-Dos:")
listbox = tk.Listbox(root)
button = tk.Button(root,text = "Done",command = lambda: removeItem(listbox, task_map))




tasks = fetchContent()
for idx, task in enumerate(tasks):
    listbox.insert(tk.END, f"Task: {task['taskBody']}")
    task_map[idx] = task["taskId"]  # Map the Listbox index to the taskId
    


button.pack()
label.pack()
listbox.pack()
root.mainloop()