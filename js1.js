// Pobieranie elementów z dokumentu

const taskList = document.getElementById('task-list');

const searchInput = document.getElementById('search');

const newTaskInput = document.getElementById('new-task');

const dueDateInput = document.getElementById('due-date');

const addButton = document.getElementById('add-button');

 

// Funkcja walidacji nowych zadań

function validateTask(taskText, dueDate)

{

    if (taskText.length < 3 || taskText.length > 255)

    {

        return false;

    }

    const now = new Date();

    const selectedDate = new Date(dueDate);

    return selectedDate === "Invalid Date" || selectedDate > now;

}

 

// Funkcja dodawania nowego zadania

function addTask() {

    const taskText = newTaskInput.value;

    const dueDate = dueDateInput.value;

   

    if (validateTask(taskText, dueDate))

    {

        // Utwórz element zadania z checkboxem

 

        const taskItem = document.createElement('li');

        const taskLabel = document.createElement('label');

        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';

 

 

        taskLabel.appendChild(checkbox);

        taskLabel.innerHTML += ` ${taskText} Data: ${dueDate}`;

        taskItem.appendChild(taskLabel);

 

        // Dodaj obsługę usuwania

        const deleteButton = document.createElement('button');

        deleteButton.textContent = 'Usuń';

        deleteButton.addEventListener('click', () => {

            deleteTask(taskItem);

        });

 

        // Dodaj obsługę edycji

        taskLabel.addEventListener('click', () => {

            taskLabel.contentEditable = true;

            taskLabel.focus();

            saveTasks();

        });

 

 

        taskLabel.addEventListener('blur', () => {

            taskLabel.contentEditable = false;

            saveTasks();

        });

 

        taskItem.appendChild(taskLabel);

        taskItem.appendChild(deleteButton);

 

        // Dodaj element zadania z prawej strony

        taskList.appendChild(taskItem);

 

        // Wyczyszczenie pól

        newTaskInput.value = '';

        dueDateInput.value = '';

 

        // Zapisz listę w Local Storage

 

        saveTasks();

    } else

    {

        alert('Błąd walidacji zadania. Pewnie jakiś czas albo nazwa');

    }

}

 

//Funkcja usuwania zadania

function deleteTask(taskItem) {

    taskList.removeChild(taskItem);

    saveTasks();

}

 

// Funkcja zapisywania listy zadań w Local Storage

function saveTasks() {

    const tasks = [];

    for (const taskItem of taskList.children) {

        tasks.push({

            text: taskItem.textContent,

            dueDate: taskItem.dataset.dueDate

        });

    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

}

 

// Funkcja wczytująca listę zadań z Local Storage

function loadTasks() {

    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {

        const tasks = JSON.parse(savedTasks);

        for (const task of tasks) {

            const taskItem = document.createElement('li');

            const taskLabel = document.createElement('label');

            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';

            taskLabel.appendChild(checkbox);

            taskLabel.innerHTML += `${task.text}`.slice(0, -4); // Usuń

 

 

            // Obsługa usuwania

            const deleteButton = document.createElement('button');

            deleteButton.textContent = 'usuń';

            deleteButton.addEventListener('click', () => {

                deleteTask(taskItem);

            });

 

            // Obsługa edycji

            taskLabel.addEventListener('click', () => {

                taskLabel.contentEditable = true;

                taskLabel.focus();

            });

 

            taskLabel.addEventListener('blur', () => {

                taskLabel.contentEditable = false;

                saveTasks();

            });

 

            taskItem.appendChild(taskLabel);

            taskItem.appendChild(deleteButton);

            taskList.appendChild(taskItem);

        }

    }

}

 

 


addButton.addEventListener('click', addTask);



// Funkcja do wyszukiwania i podświetlania fraz
function searchAndHighlight(searchPhrase) {
    const normalizedSearchPhrase = searchPhrase.toLowerCase();

    for (const taskItem of taskList.children) {
        const taskLabel = taskItem.querySelector('label');
        const taskText = taskLabel.textContent.toLowerCase();

        if (taskText.includes(normalizedSearchPhrase)) {
            // Wyróżnij znalezione frazy na żółto
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

searchInput.addEventListener('input', () => {
    const searchPhrase = searchInput.value;
    searchAndHighlight(searchPhrase);
});

 

// Wczytaj listę zadań z Local Storage po załadowaniu strony

window.addEventListener('load', loadTasks);
