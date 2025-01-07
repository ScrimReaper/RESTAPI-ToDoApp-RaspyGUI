import tkinter as tk
import requests


def fetchContent() -> dict:
    try:
        response = requests.get(
        url="http://localhost:18080/lists/0/tasks",
        headers={"API-KEY": "1234"}
        )
    except:
        print(f"Failed to fetch Content. Connection to API couldnt be established")
        return {}


    data = response.json()
    tasks = data["tasks"]

    return {} if tasks is None else [{"taskId": task["taskId"], "taskBody": task["taskBody"]} for task in tasks]


def reloadContent(listboxInstnc: tk.Listbox, map: dict):
    listboxInstnc.delete(0, tk.END)
    map.clear()
    tasks = fetchContent()
    for idx, task in enumerate(tasks):
        listboxInstnc.insert(tk.END, f"{task['taskBody']}")
        map[idx] = task["taskId"]


def removeItem(listboxInstnc: tk.Listbox, map: dict):
    for i in listboxInstnc.curselection():
        trueID = map[i]
        reqUrl = f"http://localhost:18080/lists/0/tasks/{trueID}"
        try:
            response = requests.delete(url=reqUrl, headers={"API-KEY": "1234"})
        except:
            print(f"Failed to delete task with ID: {trueID}. Connection to API couldn't be established")
            return
        if response.status_code == 204:
            print(f"Deleted task with ID: {trueID}")
            listboxInstnc.delete(i)
        else:
            print(f"Failed to delete task with ID: {trueID}. Status code: {response.status_code}")


# Set up the main Tkinter GUI window
root = tk.Tk()
root.title("To-Do List")
root.geometry("500x400")

# Header Section
header_frame = tk.Frame(root, pady=10)
header_frame.pack(fill=tk.X)

header_label = tk.Label(
    header_frame,
    text="Today's To-Do List",
    font=("Arial", 16, "bold"),

)
header_label.pack()

# Main Section with Listbox
main_frame = tk.Frame(root, padx=10, pady=10)
main_frame.pack(fill=tk.BOTH, expand=True)

listbox = tk.Listbox(
    main_frame,
    font=("Arial", 12),
    selectmode=tk.MULTIPLE,

    relief=tk.GROOVE,
    borderwidth=2
)
listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

# Footer Section with Buttons
footer_frame = tk.Frame(root, bg="lightgrey", pady=10)
footer_frame.pack(fill=tk.X)

reload_button = tk.Button(
    footer_frame,
    text="Reload",
    font=("Arial", 12),
    relief=tk.RAISED,
    command=lambda: reloadContent(listboxInstnc=listbox, map=task_map)
)
reload_button.pack(side=tk.LEFT, padx=20)

done_button = tk.Button(
    footer_frame,
    text="Done",
    font=("Arial", 12),
    relief=tk.RAISED,
    command=lambda: removeItem(listboxInstnc=listbox, map=task_map)
)
done_button.pack(side=tk.RIGHT, padx=20)

# Initialize task map and load initial content
task_map = {}
reloadContent(listboxInstnc=listbox, map=task_map)

# Run the Tkinter event loop
root.mainloop()
