let timer;
let isRunning = false;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let currentTime = workDuration;
let isWorkSession = true; // Add this flag

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const skipButton = document.getElementById('skip'); // Add skip button
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const tasksContainer = document.getElementById('tasks');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');

function updateTimerDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTaskStatus() {
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
                if (isWorkSession) {
                        task.classList.remove('break');
                } else {
                        task.classList.add('break');
                }
        });
}

function checkTasks() {
        const tasks = document.querySelectorAll('.task');
        if (tasks.length === 0) {
                alert('No tasks available. Please add a task.');
                return false;
        }
        if (allTasksCompleted()) {
                alert('All tasks are already completed.');
                return false;
        }
        return true;
}

function completeFirstUncheckedTask() {
        const tasks = document.querySelectorAll('.task');
        for (let i = 0; i < tasks.length; i++) {
                if (!tasks[i].classList.contains('completed')) {
                        tasks[i].classList.add('completed');
                        break;
                }
        }
}

function allTasksCompleted() {
        const tasks = document.querySelectorAll('.task');
        return Array.from(tasks).every(task => task.classList.contains('completed'));
}

function startTimer() {
        if (!isRunning && checkTasks()) { // Check for tasks before starting the timer
                isRunning = true;
                timer = setInterval(() => {
                        if (currentTime > 0) {
                                currentTime--;
                                updateTimerDisplay();
                        } else {
                                if (isWorkSession) {
                                        completeFirstUncheckedTask(); // Complete the first unchecked task
                                        currentTime = breakDuration;
                                        alert('Work session ended! Break time starts now.');
                                } else {
                                        if (allTasksCompleted()) {
                                                clearInterval(timer);
                                                isRunning = false;
                                                alert('All tasks completed! Timer stopped.');
                                                return;
                                        }
                                        currentTime = workDuration;
                                        alert('Break time is up! Work session starts now.');
                                }
                                isWorkSession = !isWorkSession; // Toggle the session type
                                updateTaskStatus(); // Update task status
                        }
                }, 1000);
        }
}

function skipSession() {
        if (isRunning) {
                clearInterval(timer);
                isRunning = false;
        }
        if (isWorkSession) {
                completeFirstUncheckedTask(); // Complete the first unchecked task
                currentTime = breakDuration;
                alert('Work session skipped! Break time starts now.');
        } else {
                currentTime = workDuration;
                alert('Break session skipped! Work session starts now.');
        }
        isWorkSession = !isWorkSession; // Toggle the session type
        updateTaskStatus(); // Update task status
        updateTimerDisplay();
}

function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        currentTime = workDuration;
        updateTimerDisplay();
}

function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.textContent = taskText;
                taskElement.addEventListener('click', () => {
                        taskElement.classList.toggle('completed');
                });
                tasksContainer.appendChild(taskElement);
                taskInput.value = '';
                updateTaskStatus(); // Update task status when a new task is added
        }
}

taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
                addTask();
        }
});

startButton.addEventListener('click', startTimer);
skipButton.addEventListener('click', skipSession); // Add event listener for skip button
addTaskButton.addEventListener('click', addTask);

workDurationInput.addEventListener('change', () => {
        workDuration = workDurationInput.value * 60;
        resetTimer();
});

breakDurationInput.addEventListener('change', () => {
        breakDuration = breakDurationInput.value * 60;
});

function applyThemeToSettings() {
        const settings = document.querySelector('.settings');
        settings.style.background = 'rgba(255, 255, 255, 0.03)';
        settings.style.padding = '15px';
        settings.style.borderRadius = '15px';
        settings.style.marginTop = '20px';
        settings.style.animation = 'fadeIn 1s ease-in-out';
}

document.addEventListener('DOMContentLoaded', () => {
        applyThemeToSettings();
});
