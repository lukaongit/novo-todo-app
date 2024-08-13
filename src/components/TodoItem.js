import { debug } from '../utils/debug.js';

class TodoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'completed', 'id', 'category', 'due-date', 'from-api'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    debug(`Attribute changed: ${name}, from ${oldValue} to ${newValue}`);
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const completed = this.getAttribute('completed') === 'true';
    const id = this.getAttribute('id');
    const category = this.getAttribute('category') || '';
    const dueDate = this.getAttribute('due-date') || '';
    const fromApi = this.getAttribute('from-api') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .todo-item {
          display: flex;
          align-items: center;
        }
        .todo-item--completed {
          text-decoration: line-through;
          opacity: 0.6;
        }
        .todo-item--api {
          background-color: #f0f0f0;
        }
        .todo-item__checkbox {
          margin-right: 10px;
        }
        .todo-item__title {
          flex-grow: 1;
        }
        .todo-item__category {
          margin-right: 10px;
          font-style: italic;
        }
        .todo-item__due-date {
          margin-right: 10px;
          font-size: 0.8em;
        }
        .todo-item__remove {
          background-color: #ff4136;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
        }
      </style>
      <div class="todo-item ${completed ? 'todo-item--completed' : ''} ${fromApi ? 'todo-item--api' : ''}">
        <input type="checkbox" class="todo-item__checkbox" ${completed ? 'checked' : ''}>
        <span class="todo-item__title">${title}</span>
        <span class="todo-item__category">${category}</span>
        <span class="todo-item__due-date">${dueDate}</span>
        <button class="todo-item__remove">Remove</button>
      </div>
    `;

    this.shadowRoot.querySelector('.todo-item__checkbox').addEventListener('change', () => {
      debug(`Toggle complete for task: ${id}`);
      this.dispatchEvent(new CustomEvent('toggle-complete', { detail: { id } }));
    });

    this.shadowRoot.querySelector('.todo-item__remove').addEventListener('click', () => {
      debug(`Remove task: ${id}`);
      this.dispatchEvent(new CustomEvent('remove', { detail: { id } }));
    });
  }
}

customElements.define('todo-item', TodoItem);
