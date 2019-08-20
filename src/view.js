import { EventEmitter, createElement } from './helpers';

class View extends EventEmitter {
    constructor() {
        super();

        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('add-input');
        this.list = document.getElementById('todo-list');

        this.calendar = document.getElementById('calendar');

        this.yearSelect = null;
        this.monthSelect = null;

        this.form.addEventListener('submit', this.handleAdd.bind(this));
        this.MONTH_NAMES = [
            'Январь',
            'Феварль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
        ];
    }

    get year() {
        // console.log(this.yearSelect.value);
        return Number(this.yearSelect.value);
    }

    get month() {
        // console.log(this.monthSelect);
        // debugger
        return Number(this.monthSelect.value);
    }

    ////////////////////////////////////////////////////////

    init(currentMonth, currentYear) {
        
        const tableBody = createElement('tbody', null);
        const tableHead = createElement('thead', null,
            ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(weekday =>
                createElement('th', null, weekday)
            )
        );
        const table = createElement('table', { className: 'table is-bordered' },
            tableHead,
            tableBody
        );

        const prevMonthButton = createElement('button', {
            className: 'button',
            onclick: this.handlePrevMonthButtonClick.bind(this)
        }, '<');

        const nextMonthButton = createElement('button', {
            className: 'button',
            onclick: this.handleNextMonthButtonClick.bind(this)
        }, '>');

        this.yearSelect = createElement('select', {
            onchange: this.handleMonthSelectChange.bind(this)
        },
            [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021].map(year =>
                createElement('option', {
                    value: year,
                    selected: year === currentYear
                }, year)
            )
        );

        this.monthSelect = createElement('select', {
            onchange: this.handleMonthSelectChange.bind(this)
        },
            this.MONTH_NAMES.map((name, index) =>
                createElement('option', {
                    value: index,
                    selected: index === currentMonth
                }, name)
            )
        );



        const element = createElement('div', { id: 'calendar' },
            createElement('header', null,
                prevMonthButton,
                createElement('div', { className: 'select' }, this.monthSelect),
                createElement('div', { className: 'select' }, this.yearSelect),
                nextMonthButton
            ),
            table
        );
        return element;
    }

    addCalendarHeader(currentMonth, currentYear) {
        const calendarHeader = this.init(currentMonth, currentYear);

        // this.list.appendChild(listItem);
        document.querySelector('#calendar').appendChild(calendarHeader);
    }

    // render() {
    //     // console.log(this.monthSelect.value);


    //     document.querySelector('#calendar').appendChild(element);
    // }

    // addEventCalendarListeners(tableBody) {



    //     return tableBody;
    // }

    createDates(month) {
        // const month = this.model.getMonthData(this.year, this.month);
        // console.log(this.model);
        const tableBody = createElement('tbody', null,
            month.map(week =>
                createElement('tr', null,
                    week.map(date => {
                        if (date && date.thisMonth) {
                            let obj = createElement('td', {
                                className: date && date.isToday ? 'has-background-primary has-text-white' : undefined
                                // onclick: date ? () => this.onDateSelect(date) : undefined
                            }, date ? date.day : '');
                            return obj;
                        }
                        else if (date && date.nextData) {
                            let obj = createElement('td', {
                                className: 'prev-month'
                                // onclick: date ? () => this.onDateSelect(date) : undefined
                            }, date ? date.nextData : '');
                            return obj;
                        } else if (date && date.preMonth) {
                            let obj = createElement('td', {
                                className: 'prev-month'
                                // onclick: date ? () => this.onDateSelect(date) : undefined
                            }, date ? date.preMonth : '');
                            return obj;
                        }
                    }
                    )
                )
            )
        );

        // this.calendar.removeChild(tableBody);


        // this.tableBody = tableBody;
        // this.calendar.appendChild(this.tableBody);


        this.calendar.appendChild(tableBody);

        // return this.addEventCalendarListeners(tableBody);
    }




    handlePrevMonthButtonClick() {
        // debugger
        let month = this.month - 1;
        let year = this.year;
        // console.log(this.monthSelect.value);
        if (month === -1) {
            month = 11;
            this.yearSelect.value = this.year - 1;
        }

        this.monthSelect.value = month;
        // this.update();
        // console.log(year);
        // console.log(this.month);
        this.emit('prev', { month, year });
    }

    handleNextMonthButtonClick() {
        // console.log(this.monthSelect.value);
        let month = this.month + 1;
        let year = this.year;
        if (month === 12) {
            month = 0;
            this.yearSelect.value = this.year + 1;
        }
        this.monthSelect.value = month;

        this.emit('next', { month, year });
        // this.update();
    }

    handleMonthSelectChange() {
        let month = this.monthSelect.value;
        this.emit('changeMonth', month);
    }

    handleYearSelectChange() {
        let year = this.yearSelect.value;
        this.emit('changeYear', year);
    }


    // console.log(this.monthSelect.value);











    addCalendar(dates) {
        // console.log(dates);
    }

    //////////////////////////////////////////////////////////////////////////
    /////////////////////////   todo-list   //////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    createForm(elem) {
        //создание формы в elem
    }

    createListItem(todo) {
        const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox', checked: todo.completed ? 'checked' : '' });
        const label = createElement('label', { className: 'title' }, todo.title);
        const editInput = createElement('input', { type: 'text', className: 'textfield' });
        const editButton = createElement('button', { className: 'edit' }, 'Изменить');
        const deleteButton = createElement('button', { className: 'remove' }, 'Удалить');
        const item = createElement('li', { className: `todo-item${todo.completed ? ' completed' : ''}`, 'data-id': todo.id }, checkbox, label, editInput, editButton, deleteButton);

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