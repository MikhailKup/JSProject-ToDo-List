const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const removeDoneTasksBtn = document.querySelector('#removeDoneTasks');
let tasks = [];

const renderTask = (task) => {
	const cssClass = (task.done) ? 'task-title task-title--done' : 'task-title';
	const newTask = `
		<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
			<span class="${cssClass}">${task.text}</span>
			<div class="task-item__buttons">
				<button type="button" data-action="done" class="btn-action">
					<img src="./img/tick.svg" alt="Done" width="18" height="18">
				</button>
				<button type="button" data-action="delete" class="btn-action">
					<img src="./img/cross.svg" alt="Done" width="18" height="18">
				</button>
			</div>
		</li>
	`;
	taskList.insertAdjacentHTML('beforeend', newTask);
};

const saveToLocalStorage = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks));
};

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

const checkEmptyList = () => {
	if (tasks.length === 0) {
		const emptyListElem = `
			<li id="emptyList" class="list-group-item empty-list">
				<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
				<div class="empty-list__title">Список дел пуст</div>
			</li>
		`;
		taskList.insertAdjacentHTML('afterbegin', emptyListElem);
	} else {
		const emptyList = document.querySelector('#emptyList');
		emptyList ? emptyList.remove() : null;
	}
};
checkEmptyList();

const createTask = (event) => {
	event.preventDefault();
	const taskText = taskInput.value;

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	};
	tasks.push(newTask);
	saveToLocalStorage();

	renderTask(newTask);

	taskInput.value = '';
	taskInput.focus();
	checkEmptyList();
};

const removeTask = (event) => {
	if (event.target.dataset.action !== 'delete') return;
	const parentNode = event.target.closest('li');

	const id = Number(parentNode.id);
	tasks = tasks.filter((el) => el.id !== id);

	parentNode.remove();
	checkEmptyList();
	saveToLocalStorage();
};

const removeDoneTasks = () => {
	const doneTasks = taskList.querySelectorAll('.task-title--done');
	doneTasks.forEach((task) => {
		const parentNode = task.closest('li');
		parentNode.remove();
	});
	tasks = tasks.filter((el) => el.done !== true);
	saveToLocalStorage();
	checkEmptyList();
};

const completeTask = (event) => {
	if (event.target.dataset.action !== 'done') return;
	const parentNode = event.target.closest('li');

	const id = Number(parentNode.id);
	const currentTask = tasks.find((el) => el.id === id);
	currentTask.done = !currentTask.done;

	const spanNode = parentNode.querySelector('span');
	spanNode.classList.toggle('task-title--done');
	saveToLocalStorage();
};


// Create task
form.addEventListener('submit', createTask);

// Remove task
taskList.addEventListener('click', removeTask);

// Remove all task
removeDoneTasksBtn.addEventListener('click', () => {
	if (tasks.length !== 0) {
		removeDoneTasks();
	}
});

// Mark the task completed
taskList.addEventListener('click', completeTask);