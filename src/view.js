import { EventEmitter, createElement } from './helpers';

class View extends EventEmitter {
    constructor() {
        super();

        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('add-input');
        this.list = document.getElementById('todo-list');

        this.calendar = document.getElementById('calendar');

        this.form.addEventListener('submit', this.handleAdd.bind(this));
    }

    createListItem(todo) {
        const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox', checked: todo.completed ? 'checked' : '' });
        const label = createElement('label', { className: 'title' }, todo.title);
        const editInput = createElement('input', { type: 'text', className: 'textfield' });
        const editButton = createElement('button', { className: 'edit' }, 'Изменить');
        const deleteButton = createElement('button', { className: 'remove' }, 'Удалить');
        const item = createElement('li', { className: `todo-item${todo.completed ? ' completed': ''}`, 'data-id': todo.id }, checkbox, label, editInput, editButton, deleteButton);

        return this.addEventListeners(item);
    }

    addEventListeners(item) {
        const checkbox = item.querySelector('.checkbox');
        const editButton = item.querySelector('button.edit');
        const removeButton = item.querySelector('button.remove');

        checkbox.addEventListener('change', this.handleToggle.bind(this));
        editButton.addEventListener('click', this.handleEdit.bind(this));
        removeButton.addEventListener('click', this.handleRemove.bind(this));

        return item;
    }

    findListItem(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    handleAdd(event) {
        event.preventDefault();

        if (!this.input.value) return alert('Необходимо ввести название задачи.');

        const value = this.input.value;

        this.emit('add', value);
    }

    handleToggle({ target }) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const completed = target.checked;

        this.emit('toggle', { id, completed });
    }

    handleEdit({ target }) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');
        const title = input.value;
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            this.emit('edit', { id, title });
        } else {
            input.value = label.textContent;
            editButton.textContent = 'Сохранить';
            listItem.classList.add('editing');
        }
    }

    handleRemove({ target }) {
        const listItem = target.parentNode;

        this.emit('remove', listItem.getAttribute('data-id'));
    }

    show(todos) {
        todos.forEach(todo => {
            const listItem = this.createListItem(todo);

            this.list.appendChild(listItem);
        });
    }


    update(month) {
        
        const tableBody = createElement('tbody', null,
            month.map(week =>
                createElement('tr', null,
                    week.map(date =>
                        createElement('td', {
                            className: date && date.isToday ? 'has-background-primary has-text-white' : undefined,
                            // onclick: date ? () => this.onDateSelect(date) : undefined
                        }, date ? date.day : '')
                    )
                )
            )
        );

        // this.calendar.removeChild(tableBody);
        this.tableBody = tableBody;
        this.calendar.appendChild(this.tableBody);
        // this.calendar.appendChild(tableBody);
    }

    addCalendar(dates) {
        console.log(dates);
    }

    // addCalendar(dates) {
    //     const table = document.createElement('table');
    //     const tbody = document.createElement('tbody');
    //     var tableDates = '';
    //     // const tr = document.createElement('tr');
    //     // const td = document.createElement('td');
    //     tableDates += '<tr>';
    //     for(let i = 0; i < 6; i++) {
    //         tableDates += '<td>0</td>';
    //         // tbody.appendChild(tr);

    //         for(let j = 0; j < 7; j++) {
    //             // tbody.innerHTML += "<td>0</td>";

    //         }
    //     }
    //     tbody.innerHTML += '</tr>';

    //     table.appendChild(tbody); 

    //     console.log(dates);
    //     // console.log(table);
    //     this.calendar.appendChild(table);

    // }

    addItem(todo) {
        const listItem = this.createListItem(todo);

        this.input.value = '';
        this.list.appendChild(listItem);
    }

    toggleItem(todo) {
        const listItem = this.findListItem(todo.id);
        const checkbox = listItem.querySelector('.checkbox');

        checkbox.checked = todo.completed;

        if (todo.completed) {
            listItem.classList.add('completed');
        } else {
            listItem.classList.remove('completed');
        }
    }

    editItem(todo) {
        const listItem = this.findListItem(todo.id);
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');

        label.textContent = todo.title;
        editButton.textContent = 'Изменить';
        listItem.classList.remove('editing');
    }

    removeItem(id) {
        const listItem = this.findListItem(id);

        this.list.removeChild(listItem);
    }
}

export default View;