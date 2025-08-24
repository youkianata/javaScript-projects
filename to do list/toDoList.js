

const addTaskList = document.getElementById('add-task-section');
const addTaskButton = document.getElementById('add-task-button');
const form = document.getElementById('add-task-form');
const taskListObject = [];
const taskList = document.getElementById('task-list');
const completedTasks = [];

addTaskList.style.display = 'none';


addTaskButton.addEventListener('click', () => {
    if (addTaskList.style.display === 'none') {
        setTimeout(() => {
            addTaskList.style.display = 'block';
        }, 100);
    }
    else {
        setTimeout(() => {
            addTaskList.style.display = 'none';
        }, 100);
    }
});
const savedTaskList = sessionStorage.getItem('taskListObject');

if (savedTaskList) {
    taskListObject.push(...JSON.parse(savedTaskList));
    renderTaskList();
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log("form submitted");
    const formData = new FormData(form);
    const taskInput = formData.get("task-input");
    const taskDescription = formData.get("task-description");
    if (taskInput && taskDescription) {
        taskListObject.push({
            task: taskInput,
            description: taskDescription,
            completed: false // Initialize with completed status
        });
        renderTaskList();
        renderCompletedTasks();
        saveData();
        form.reset(); // Clear the form inputs
    }

    setTimeout(() => {
        addTaskList.style.display = 'none';
    }, 300);

    // taskListObject.length = 0;
 });
function renderTaskList() {
        taskList.innerHTML = '';
        taskListObject.forEach((task, index) => {
            const div = document.createElement('div');
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            div.classList.add('task-list-items');
            div.innerHTML = `
                <h3 class="task-name"><strong>task:</strong> ${task.task}</h3>
                <p class="task-description-data"><strong>description:</strong> ${task.description}</p>

       `;
            // Use stable index from forEach instead of indexOf which is unstable
            checkBox.name = `task-${index}`;
            checkBox.id = `task-${index}`;
            
            // Set checkbox state based on task.completed
            checkBox.checked = !!task.completed;
            
            // Add event listener directly when creating the checkbox
            checkBox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Mark task as completed
                    task.completed = true;
                    // Only push to completedTasks if not already there
                    if (!completedTasks.includes(task)) {
                        completedTasks.push(task);
                        console.log('Task completed:');
                        console.log(task);
                    }
                    removeCompletedTask(completedTasks);
                }
                // Save changes immediately
                saveData();
                renderTaskList();
                renderCompletedTasks();
            });
            
            div.appendChild(checkBox);
            taskList.appendChild(div);
        });
}
function saveData() {
    sessionStorage.setItem('taskListObject', JSON.stringify(taskListObject));
}
// Initialize with any saved completed tasks from storage
if (savedTaskList) {
    const parsed = JSON.parse(savedTaskList);
    // Find any tasks that were previously marked as completed
    parsed.forEach(task => {
        if (task.completed) {
            completedTasks.push(task);
        }
    });
    
    // Log initial completed tasks if any
    if (completedTasks.length > 0) {
        console.log('Restored completed tasks:');
        console.log(completedTasks);
    }
}

function removeCompletedTask(completedTasks) {
    if (completedTasks.length > 0) {
        completedTasks.forEach(task => {
            const taskListCopy = [...taskListObject];
            taskListObject.length = 0;
            taskListObject.push(...taskListCopy.filter(t => t !== task));
        })
    }
    saveData();
}

function renderCompletedTasks() {
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.innerHTML = '';
    completedTasks.forEach((task) => {
        const div = document.createElement('div');
        div.classList.add('task-list-items');
        div.innerHTML = `
            <h3 class="task-name"><strong>task:</strong> ${task.task}</h3>
            <p class="task-description-data"><strong>description:</strong> ${task.description}</p>
        `;
        completedTaskList.appendChild(div);
    });
}
function clearCompleted() {
    completedTasks.length = 0;
    saveData();
    renderCompletedTasks();
}

