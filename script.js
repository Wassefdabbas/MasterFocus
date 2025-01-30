const sideBar = document.querySelector(".sidebar");
const inputField = document.querySelector("input");
const submitButton = document.querySelector(".submit");
const messageUserName = document.getElementById("messageUserName");

const remainingTasks = document.getElementById("remainingTasks");
const CompletedTask = document.getElementById("CompletedTask");

let numberOfTask = parseInt(localStorage.getItem("numberOfTask")) || 0;
let numberOfCompletedTask = parseInt(localStorage.getItem("numberOfCompletedTask")) || 0;

// Update the initial display
updateCounters();
function updateCounters() {
    remainingTasks.textContent = ` ' ${numberOfTask - numberOfCompletedTask} ' `;
    CompletedTask.textContent = ` ' ${numberOfCompletedTask} ' `;
}

// function open side bar
function openSideBar() {
    sideBar.classList.toggle("open");
}
// function close side bar
function closeSideBar() {
    sideBar.classList.remove("open");
}

// close sidebar in small secreen
submitButton.addEventListener("click", () => {
    if(window.innerWidth < 650 && inputField.value != ""){
        sideBar.classList.remove("open");
    }
});

// Save the value in localStorage
function saveInputValue() {
    const inputValue = inputField.value;
    localStorage.setItem("userName", inputValue);
    messageUserName.textContent = ` ${inputValue}!`;
}

// the input field save the name
function fillInput() {
    const savedName = localStorage.getItem("userName");
    inputField.value = savedName;
    if (savedName == null) {
        messageUserName.textContent = ` there!`;
    } else {
        messageUserName.textContent = ` ${savedName}!`;
    }
}
// When the site loads, fill the input field
fillInput();

// function for input submit 
submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (inputField.value === "") {
        submitButton.classList.add("shake");
        setTimeout(() => {
            submitButton.classList.remove("shake"); // rempve it for use it again
        }, 500);
    } else {
        saveInputValue();
    }
});

// Change the section
function active(sectionId) {
    // remove visible from all section
    const sections = document.querySelectorAll(".visible");
    sections.forEach(section => section.classList.remove("visible"));
    // and add it just for the current section
    document.getElementById(sectionId).classList.add("visible");
}

// Active color button
const controeBtn = document.querySelectorAll(".controeBtn");
controeBtn.forEach(button => {
    button.addEventListener("click", event => {
        // remove toRed class form every button
        controeBtn.forEach(btn => btn.classList.remove("toRed"));
        // and add it just for the target button
        event.target.classList.add("toRed");
    });
});

// To-Do List
const TODO = document.querySelector(".TODO");
const inputBar = document.getElementById("inputBar");
const addButton = document.getElementById("addButton");
const tasks = document.querySelector(".tasks");

// Save tasks to localStorage
function saveTasks() {
    const taskElements = document.querySelectorAll(".TaskItem");
    const taskList = Array.from(taskElements).map(task => ({ // map to convert every element in the arryay and create new array
        // for each element create an object 
        text: task.querySelector(".taskText").textContent,
        completed: task.querySelector(".fa-circle").classList.contains("hide")
    }));
    localStorage.setItem("tasks", JSON.stringify(taskList)); //converts the taskList array (containing task objects) into a JSON string.
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // reconvert the string json to object
    savedTasks.forEach(task => addTaskToDOM(task.text, task.completed));
}


// Add a task to the DOM
function addTaskToDOM(taskText, isCompleted = false) {
    const div_TaskItem = document.createElement("div");
    div_TaskItem.classList.add("TaskItem");

    const div_CheckAndTask = document.createElement("div");
    div_CheckAndTask.classList.add("CheckAndTask");

    const i_circle = document.createElement("i");
    i_circle.classList.add("fa-regular", "fa-circle");
    if (isCompleted) i_circle.classList.add("hide");

    const i_check = document.createElement("i");
    i_check.classList.add("fa-solid", "fa-check", "hide");
    if (isCompleted) i_check.classList.remove("hide");

    const spam_taskText = document.createElement("span");
    spam_taskText.classList.add("taskText");
    if (isCompleted) spam_taskText.classList.add("linethrow");
    spam_taskText.textContent = taskText;

    const i_trash = document.createElement("i");
    i_trash.classList.add("fa-solid", "fa-trash");

    // show in this order
    div_CheckAndTask.append(i_circle, i_check, spam_taskText);
    div_TaskItem.append(div_CheckAndTask, i_trash);
    tasks.appendChild(div_TaskItem);

    // save after check
    i_circle.addEventListener("click", () => {
        i_circle.classList.add("hide");
        i_check.classList.remove("hide");
        spam_taskText.classList.add("linethrow");
        numberOfCompletedTask++;
        localStorage.setItem("numberOfCompletedTask", numberOfCompletedTask);
        updateCounters();
        saveTasks();
    });

    // save after uncheck
    i_check.addEventListener("click", () => {
        i_circle.classList.remove("hide");
        i_check.classList.add("hide");
        spam_taskText.classList.remove("linethrow");
        numberOfCompletedTask--;
        localStorage.setItem("numberOfCompletedTask", numberOfCompletedTask);
        updateCounters();
        saveTasks();
    });

    // save after delete
    i_trash.addEventListener("click", () => {
        if (i_circle.classList.contains("hide")) {
            numberOfCompletedTask--;
            localStorage.setItem("numberOfCompletedTask", numberOfCompletedTask);
        }
        numberOfTask--;
        localStorage.setItem("numberOfTask", numberOfTask);
        updateCounters();
        div_TaskItem.remove();
        saveTasks();
    });

    // Save the task list after adding a new task
    saveTasks();
}

// Add a new task
function addTask() {
    const inputValue = inputBar.value.trim();
    if (inputValue === "") {
        return;
    }
    inputBar.value = "";

    addTaskToDOM(inputValue);
    numberOfTask++;
    localStorage.setItem("numberOfTask", numberOfTask);
    updateCounters();
}

// Event listener for adding a task
addButton.addEventListener("click", addTask);

// Pressing Enter to add
inputBar.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks on page load
loadTasks();


// Notes
 function NoteFuntion() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteContainer = document.getElementById('noteContainer');

    //add funtion
    function addNote() {
        const noteItem = document.createElement('div');
        noteItem.classList.add('noteItem');

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Write your note here...';

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash');

        //delete function
        deleteIcon.addEventListener('click', function () {
            noteContainer.removeChild(noteItem);
            saveNotes(); // Save
        });

        // Save notes when textarea content changes
        textarea.addEventListener('input', saveNotes);

        noteItem.appendChild(textarea);
        noteItem.appendChild(deleteIcon);
        noteContainer.appendChild(noteItem);

        textarea.focus(); // Focus on the new textarea for write
    }

    // save
    function saveNotes() {
        const notes = [];
        document.querySelectorAll('.noteItem textarea').forEach(textarea => {
            notes.push(textarea.value);
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // load
    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        savedNotes.forEach(noteText => {
            addNote();
            const lastTextarea = noteContainer.lastElementChild.querySelector('textarea');
            lastTextarea.value = noteText;
        });
    }

    // Event listener for the "Add Note" button
    addNoteBtn.addEventListener('click', addNote);

    // Load saved notes when the page loads
    loadNotes();
};
NoteFuntion();


// Pomodoro
let timer;
let isRunning = false;
let minutes = 25; // Initial Pomodoro time
let seconds = 0;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');

const setTimeInput = document.getElementById('set-time'); // The ID of the input field
const increaseButton = document.getElementById('increase-time');
const decreaseButton = document.getElementById('decrease-time');
const setTimeButton = document.getElementById('set-time-btn');

// Start and stop the timer
startStopButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timer);
        startStopButton.innerHTML = `<i class = "fa-solid fa-play"></i>`
    } else {
        startTimer();
        startStopButton.textContent = 'Stop';
        startStopButton.innerHTML = `<i class = "fa-solid fa-pause"></i>`
    }
    isRunning = !isRunning;
});

// Reset the timer
resetButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    startStopButton.innerHTML = `<i class = "fa-solid fa-play"></i>`
    minutes = 25; // Reset to the default Pomodoro time
    seconds = 0;
    updateDisplay();
});

// Increase the time
increaseButton.addEventListener('click', () => {
    let newTime = parseInt(setTimeInput.value, 10);
    if (newTime < 90) {
        newTime++;
        setTimeInput.value = newTime; // Update the input value
    }
});

// Decrease the time
decreaseButton.addEventListener('click', () => {
    let newTime = parseInt(setTimeInput.value, 10);
    if (newTime > 1) {
        newTime--;
        setTimeInput.value = newTime; // Update the input value
    }
});

// Set the Pomodoro time from the input field
setTimeButton.addEventListener('click', () => {
    const newTime = parseInt(setTimeInput.value, 10);
    if (newTime >= 1 && newTime <= 90) {
        minutes = newTime;
        seconds = 0;
        updateDisplay();
    }
});

// Start the timer countdown
function startTimer() {
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                alert('Pomodoro is done!');
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

// Update the display of the timer
function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

updateDisplay();
