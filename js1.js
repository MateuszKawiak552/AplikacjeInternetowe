class ToDoList {
    constructor() {
      this.taskList = document.getElementById('task-list');
      this.searchInput = document.getElementById('search');
      this.newTaskInput = document.getElementById('new-task');
      this.dueDateInput = document.getElementById('due-date');
      this.addButton = document.getElementById('add-button');
      this.loadTasks();
  
      this.addButton.addEventListener('click', this.addTask.bind(this));
      this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
    }
  
    validateTask(taskText, dueDate) {
      if (taskText.length < 3 || taskText.length > 255) {
        return false;
      }
      const now = new Date();
      const selectedDate = new Date(dueDate);
      return selectedDate.toString() !== 'Invalid Date' && selectedDate > now;
    }
  
    addTask() {
      const taskText = this.newTaskInput.value;
      const dueDate = this.dueDateInput.value;
  
      if (this.validateTask(taskText, dueDate)) {
        // Tworzenie elementu zadania z checkboxem
        const taskItem = document.createElement('li');
        const taskLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
  
        taskLabel.appendChild(checkbox);
        taskLabel.innerHTML += ` ${taskText} Data: ${dueDate}`;
        taskItem.appendChild(taskLabel);
  
        // Dodawanie obsługi usuwania
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => this.deleteTask(taskItem));
        taskLabel.addEventListener('click', () => {
          taskLabel.contentEditable = true;
          taskLabel.focus();
          this.saveTasks();
        });
        taskLabel.addEventListener('blur', () => {
          taskLabel.contentEditable = false;
          this.saveTasks();
        });
        taskItem.appendChild(deleteButton);
        this.taskList.appendChild(taskItem);
        this.saveTasks();
        this.newTaskInput.value = '';
        this.dueDateInput.value = '';
      } else {
        alert('Błąd walidacji zadania. Sprawdź długość lub datę.');
      }
    }
  
    deleteTask(taskItem) {
      this.taskList.removeChild(taskItem);
      this.saveTasks();
    }
  
    saveTasks() {
      const tasks = [];
      for (const taskItem of this.taskList.children) {
        tasks.push({
          text: taskItem.textContent,
          dueDate: taskItem.dataset.dueDate,
        });
      }
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    loadTasks() {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        for (const task of tasks) {
          const taskItem = document.createElement('li');
          const taskLabel = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          taskLabel.appendChild(checkbox);
          taskLabel.innerHTML += `${task.text}`.slice(0, -4); // Usuń " Data: ..."
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Usuń';
          deleteButton.addEventListener('click', () => this.deleteTask(taskItem));
          taskLabel.addEventListener('click', () => {
            taskLabel.contentEditable = true;
            taskLabel.focus();
          });
          taskLabel.addEventListener('blur', () => {
            taskLabel.contentEditable = false;
            this.saveTasks();
          });
          taskItem.appendChild(taskLabel);
          taskItem.appendChild(deleteButton);
          this.taskList.appendChild(taskItem);
        }
      }
    }
  
    handleSearchInput() {
      const searchPhrase = this.searchInput.value;
      this.searchAndHighlight(searchPhrase);
    }
  
    searchAndHighlight(searchPhrase) {
      const normalizedSearchPhrase = searchPhrase.toLowerCase();
      for (const taskItem of this.taskList.children) {
        const taskLabel = taskItem.querySelector('label');
        const taskText = taskLabel.textContent.toLowerCase();
        if (taskText.includes(normalizedSearchPhrase)) {
          taskLabel.innerHTML = taskText.replace(new RegExp(normalizedSearchPhrase, 'g'), match => {
            return `<span class="highlight">${match}</span>`;
          });
          taskItem.style.display = 'list-item';
        } else {
          taskLabel.innerHTML = taskLabel.textContent;
          taskItem.style.display = 'none';
        }
      }
    }
  }
  
  // Inicjalizacja klasy
  const taskListManager = new ToDoList();
  
