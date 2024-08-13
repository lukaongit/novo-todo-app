import './TodoItem.js';
import { NAME, getApiUrl, CATEGORIES } from '../config.js';
import { debug } from '../utils/debug.js';

class TodoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.todos = [];
    this.currentCategory = 'All';
  }

  connectedCallback() {
    this.render();
    this.loadTasks();
  }
 
  render() {
   
    
    this.shadowRoot.innerHTML = `
     
    <style>
     .todo-list {
  max-width: 600px;
  margin: 0 auto;
}

.todo-list__header {
  text-align: center;
}

.todo-list__form {
  display: flex;
  margin-bottom: 20px;
}

.todo-list__input {
  flex-grow: 1;
  padding: 5px;
  font-size: 16px;
}

.todo-list__add-button {
  padding: 5px 10px;
  font-size: 16px;
  background-color: #0074D9;
  color: white;
  border: none;
  cursor: pointer;
}

.todo-list__api-form {
  display: flex;
  margin-bottom: 20px;
}

.todo-list__api-input {
  width: 50px;
  padding: 5px;
  font-size: 16px;
}

.todo-list__api-button {
  padding: 5px 10px;
  font-size: 16px;
  background-color: #2ECC40;
  color: white;
  border: none;
  cursor: pointer;
}

.todo-list__message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.todo-list__message--success {
  background-color: #2ECC40;
  color: white;
}

.todo-list__message--error {
  background-color: #FF4136;
  color: white;
}

.todo-list__completed-count {
  margin-bottom: 10px;
  font-weight: bold;
}

.todo-list__actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.todo-list__action-button {
  padding: 5px 10px;
  font-size: 14px;
  background-color: #FF851B;
  color: white;
  border: none;
  cursor: pointer;
}

.todo-list__category-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.todo-list__category-button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #ddd;
  border: none;
  cursor: pointer;
}

.todo-list__category-button--active {
  background-color: #0074D9;
  color: white;
}

      </style>
      <div class="todo-list">
        <h1 class="todo-list__header">Todo App by ${NAME}</h1>
        <div class="category-buttons">
          <button class="category-button active" data-category="All">All</button>
          ${CATEGORIES.map(category => 
            `<button class="category-button" data-category="${category}">${category}</button>`
          ).join('')}
        </div>
        <form class="todo-list__form">
          <input type="text" class="todo-list__input" placeholder="Enter a new task">
          <select class="todo-list__category-select">
            ${CATEGORIES.map(category => `<option value="${category}">${category}</option>`).join('')}
          </select>
          <input type="date" class="todo-list__due-date">
          <button type="submit" class="todo-list__add-button">Add Task</button>
        </form>
        <form class="todo-list__api-form">
          <input type="number" class="todo-list__api-input" min="1" value="1">
          <button type="submit" class="todo-list__api-button">Add Tasks from API</button>
        </form>
        <div class="todo-list__message"></div>
        <div class="todo-list__completed-count"></div>
        <div class="todo-list__actions">
          <button class="todo-list__action-button" data-action="delete-all">Delete All Tasks</button>
          <button class="todo-list__action-button" data-action="delete-manual">Delete Manual Tasks</button>
          <button class="todo-list__action-button" data-action="delete-api">Delete API Tasks</button>
        </div>
        <div class="todo-list__items"></div>
      </div>
    `;
  
    this.shadowRoot.querySelector('.todo-list__form').addEventListener('submit', (e) => this.addTask(e));
    this.shadowRoot.querySelector('.todo-list__api-form').addEventListener('submit', (e) => this.addTasksFromApi(e));
    this.shadowRoot.querySelector('.todo-list__actions').addEventListener('click', (e) => this.handleAction(e));
    this.shadowRoot.querySelector('.category-buttons').addEventListener('click', (e) => this.handleCategoryFilter(e));
    this.updateTodos();
  }
  

  handleCategoryFilter(event) {
    if (event.target.classList.contains('category-button')) {
      this.currentCategory = event.target.dataset.category;
      this.shadowRoot.querySelectorAll('.category-button').forEach(button => {
        button.classList.toggle('active', button.dataset.category === this.currentCategory);
      });
      this.updateTodos();
    }
  }

  updateTodos() {
    debug('Updating todos');
    const container = this.shadowRoot.querySelector('.todo-list__items');
    container.innerHTML = '';
    
    const filteredTodos = this.currentCategory === 'All' 
      ? this.todos 
      : this.todos.filter(todo => todo.category === this.currentCategory);

    filteredTodos.forEach(todo => {
      const todoItem = document.createElement('todo-item');
      todoItem.setAttribute('title', todo.title);
      todoItem.setAttribute('completed', todo.completed);
      todoItem.setAttribute('id', todo.id);
      todoItem.setAttribute('category', todo.category);
      todoItem.setAttribute('due-date', todo.dueDate);
      todoItem.setAttribute('from-api', todo.fromApi);
      todoItem.addEventListener('toggle-complete', (e) => this.toggleComplete(e));
      todoItem.addEventListener('remove', (e) => this.removeTask(e));
      container.appendChild(todoItem);
    });

    const completedCount = filteredTodos.filter(todo => todo.completed).length;
    this.shadowRoot.querySelector('.todo-list__completed-count').textContent = `Completed tasks: ${completedCount}`;
  }

  addTask(event) {
    event.preventDefault();
    debug('Adding new task');
    const input = this.shadowRoot.querySelector('.todo-list__input');
    const categorySelect = this.shadowRoot.querySelector('.todo-list__category-select');
    const dueDateInput = this.shadowRoot.querySelector('.todo-list__due-date');
    const title = input.value.trim();
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;

    if (title) {
      const newTask = {
        id: Date.now().toString(),
        title,
        completed: false,
        category,
        dueDate,
        fromApi: false
      };
      this.todos.push(newTask);
      this.updateTodos();
      this.saveTasks();
      input.value = '';
      dueDateInput.value = '';
    }
  }

  async addTasksFromApi(event) {
    event.preventDefault();
    debug('Fetching tasks from API');
    const input = this.shadowRoot.querySelector('.todo-list__api-input');
    const count = parseInt(input.value, 10);

    if (count > 0) {
      try {
        const response = await fetch(getApiUrl(count));
        const data = await response.json();
        const newTasks = data.todos.map(todo => ({
          id: todo.id.toString(),
          title: todo.todo,
          completed: todo.completed,
          fromApi: true,
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));
        this.todos = [...this.todos, ...newTasks];
        this.updateTodos();
        this.saveTasks();
        this.showMessage(`Successfully added ${count} tasks from API`, 'success');
      } catch (error) {
        console.error('Error fetching tasks from API:', error);
        this.showMessage('Error fetching tasks from API', 'error');
      }
    }
  }

  toggleComplete(event) {
    debug('Toggling task completion');
    const id = event.detail.id;
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.updateTodos();
      this.saveTasks();
    }
  }

  removeTask(event) {
    debug('Removing task');
    const id = event.detail.id;
    this.todos = this.todos.filter(t => t.id !== id);
    this.updateTodos();
    this.saveTasks();
  }

  handleAction(event) {
    const action = event.target.dataset.action;
    debug(`Handling action: ${action}`);
    switch (action) {
      case 'delete-all':
        this.todos = [];
        break;
      case 'delete-manual':
        this.todos = this.todos.filter(t => t.fromApi);
        break;
      case 'delete-api':
        this.todos = this.todos.filter(t => !t.fromApi);
        break;
    }
    this.updateTodos();
    this.saveTasks();
  }

  showMessage(message, type) {
    debug(`Showing message: ${message}`);
    const messageElement = this.shadowRoot.querySelector('.todo-list__message');
    messageElement.textContent = message;
    messageElement.className = `todo-list__message todo-list__message--${type}`;
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'todo-list__message';
    }, 3000);
  }

  saveTasks() {
    debug('Saving tasks to localStorage');
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadTasks() {
    debug('Loading tasks from localStorage');
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
      this.updateTodos();
    }
  }
}

customElements.define('todo-list', TodoList);
