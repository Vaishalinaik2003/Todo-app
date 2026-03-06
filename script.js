document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("#taskInput");
    const addBtn = document.querySelector("#addBtn");
    const taskList = document.querySelector("#taskList");
    const taskCount = document.querySelector("#taskCount");
    const clearBtn = document.querySelector("#clearBtn");
    const prioritySelect = document.querySelector("#taskPriority");

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Update counter of incomplete tasks
    function updateCounter() {
        const leftTasks = tasks.filter(t => !t.completed).length;
        taskCount.textContent = "Tasks left: " + leftTasks;
    }

    // Function to create task in UI
    function createTask(task) {
        const li = document.createElement("li");

        // Span for task text
        const span = document.createElement("span");
        span.textContent = task.text;
        li.appendChild(span);

        // Priority class (safe check)
        const priority = task.priority ? task.priority.toLowerCase() : "medium";
        li.classList.add(priority);

        // Completed
        if(task.completed) li.classList.add("completed");

        // Tick complete
        li.addEventListener("click", () => {
            li.classList.toggle("completed");
            task.completed = !task.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            updateCounter();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", e => {
            e.stopPropagation(); // prevent li click
            li.remove();
            tasks = tasks.filter(t => t.text !== task.text);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            updateCounter();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Load existing tasks
    tasks.forEach(task => createTask(task));
    updateCounter();

    // Add new task
    addBtn.addEventListener("click", () => {
        const taskText = input.value.trim();
        const priority = prioritySelect ? prioritySelect.value : "Medium"; // fallback

        if(!taskText) {
            alert("Please enter a task");
            return;
        }

        const taskObj = { text: taskText, completed: false, priority };
        tasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        createTask(taskObj);
        updateCounter();
        input.value = "";
    });

    // Enter key add
    input.addEventListener("keypress", e => {
        if(e.key === "Enter") addBtn.click();
    });

    // Clear All
    clearBtn.addEventListener("click", () => {
        if(confirm("Are you sure you want to delete all tasks?")) {
            tasks = [];
            localStorage.setItem("tasks", JSON.stringify(tasks));
            taskList.innerHTML = "";
            updateCounter();
        }
    });
});