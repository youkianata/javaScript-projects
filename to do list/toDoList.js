

const addTaskList = document.getElementById('add-task-section');
const addTaskButton = document.getElementById('add-task-button');
const form = document.getElementById('add-task-form');
const taskListObject = [];
const taskList = document.getElementById('task-list');
const completedTasks = [];
const main = document.querySelector('main');

addTaskList.style.display = 'none';

addTaskButton.addEventListener('click', () => {
    if (addTaskList.style.display === 'none') {
        setTimeout(() => {
            addTaskList.style.display = 'block';
            main.classList.add('blur');
        }, 100);
    }
    else {
        setTimeout(() => {
            addTaskList.style.display = 'none';
            main.classList.remove('blur');
        }, 100);
    }
});

const savedTaskList = sessionStorage.getItem('taskListObject');
const savedCompletedTasks = sessionStorage.getItem('completedTasks');

if (savedTaskList) {
    taskListObject.push(...JSON.parse(savedTaskList));
    renderTaskList();
}
if (savedCompletedTasks) {
    completedTasks.push(...JSON.parse(savedCompletedTasks));
    renderCompletedTasks();
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log("form submitted");
    const formData = new FormData(form);
    const taskInput = formData.get("task-input");
    const taskDescription = formData.get("task-description");
    const taskPriority = formData.get("task-priority");
    const taskStartDate = formData.get("task-start-date");
    const taskEndDate = formData.get("task-end-date");
    if (taskInput && taskDescription && taskPriority && taskStartDate && taskEndDate) {
        if (new Date(taskStartDate) > new Date(taskEndDate)) {
            alert("End date must be after start date.");
            return;
        }
        taskListObject.push({
            task: taskInput,
            description: taskDescription,
            priority: taskPriority,
            startDate: taskStartDate,
            endDate: taskEndDate,
            completed: false // Initialize with completed status
        });
        renderTaskList();
        renderCompletedTasks();
        saveData();
        form.reset(); // Clear the form inputs
    }
    else {
        alert("Please fill in all fields.");
    }

    setTimeout(() => {
        addTaskList.style.display = 'none';
    }, 300);

    // taskListObject.length = 0;
 });


function renderTaskList() {
    if (taskListObject.length === 0) {
        taskList.innerHTML = '';
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('uncompleted-task-list');
        const div1 = document.createElement('div');
        div1.classList.add('task-list-info');
        div1.innerHTML = `
                        <h3>tasks: </h3>
                        <p>you have <span id="task-count">0</span> tasks </p>
                        <p>click on the add task button to add a new task</p>
                    `;
        mainDiv.appendChild(div1);
        taskList.appendChild(mainDiv);
    } else {
         taskList.innerHTML = '';
        taskListObject.forEach((task, index) => {
            const div = document.createElement('div');
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            if (task.priority === "high") {
                div.classList.add("task-list-items-high");
            }
            if (task.priority === "medium") {
                div.classList.add("task-list-items-medium");
            }
            if (task.priority === "low") {
                div.classList.add("task-list-items-low");
            }
        
            const startFormatted = dateConvert(task.startDate);
            const endFormatted = dateConvert(task.endDate);
            div.innerHTML = `
                <h3 class="task-name"><strong>task:</strong> ${task.task}</h3>
                <p class="task-description-data"><strong>description:</strong> ${task.description}</p>
                <p class="task-priority-data"><strong>priority:</strong> ${task.priority}</p>
                <p class="task-start-date-data"><strong>start date:</strong> ${startFormatted}</p>
                <p class="task-end-date-data"><strong>end date:</strong> ${endFormatted}</p>

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
}
function saveData() {
    // Save both taskListObject and completedTasks to sessionStorage
    sessionStorage.setItem('taskListObject', JSON.stringify(taskListObject));
    sessionStorage.setItem('completedTasks', JSON.stringify(completedTasks));
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
    if (completedTasks.length === 0) {
        completedTaskList.innerHTML = '';
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('completed-task-list');
        const div1 = document.createElement('div');
        div1.classList.add('task-list-info');
        div1.innerHTML = `
                        <h3>tasks: </h3>
                        <p>you have <span id="task-count">0</span> tasks </p>
                        <p>click on the add task button to add a new task</p>
                    `;
        mainDiv.appendChild(div1);
        completedTaskList.appendChild(mainDiv);
    }else {
        completedTaskList.innerHTML = '';
        completedTasks.forEach((task) => {
        const div = document.createElement('div');
        if (task.priority === "high") {
            div.classList.add("task-list-items-high");
        }
        if (task.priority === "medium") {
            div.classList.add("task-list-items-medium");
        }
        if (task.priority === "low") {
            div.classList.add("task-list-items-low");
        }
        const startFormatted = dateConvert(task.startDate);
        const endFormatted = dateConvert(task.endDate);
        div.innerHTML = `
            <h3 class="task-name"><strong>task:</strong> ${task.task}</h3>
            <p class="task-description-data"><strong>description:</strong> ${task.description}</p>
            <p class="task-priority-data"><strong>priority:</strong> ${task.priority}</p>
            <p class="task-start-date-data"><strong>start date:</strong> ${startFormatted}</p>
            <p class="task-end-date-data"><strong>end date:</strong> ${endFormatted}</p>

        `;
        completedTaskList.appendChild(div);

    });
    }
    
}
function clearCompleted() {
    completedTasks.length = 0;
    saveData();
    renderCompletedTasks();
}

function removeBlur() {
    main.classList.remove('blur');
}

function dateConvert(datestr1) {
    const dateConverted = new Date(datestr1 + "T00:00:00");
    const dateConvertedFormat = dateConverted.toLocaleDateString("en-GB");
    return dateConvertedFormat;
}
renderTaskList();
renderCompletedTasks();