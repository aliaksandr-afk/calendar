import { EventEmitter, createElement } from './helpers';
import { getWeather } from './weather.api/weather';

class View extends EventEmitter {
    constructor() {
        super();
        this.calendar = document.getElementById('calendar');

        this.table = null;
        this.tableHead = null;
        this.tableBody = null;

        this.yearSelect = null;
        this.monthSelect = null;
        this.input = null;
        this.list = null;
        this.date = null;

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
        return Number(this.yearSelect.value);
    }

    get month() {
        return Number(this.monthSelect.value);
    }

    createCalendar(currentMonth, currentYear) {
        this.tableBody = createElement('div', { className: 'calendar-body__body' },
            createElement('tbody', null)
        )

        this.tableHead = createElement('thead', null,
            ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(weekday =>
                createElement('th', null, weekday)
            )
        )


        this.table = createElement('table', { className: 'calendar-body__table' },
            this.tableHead,
            this.tableBody
        )

        this.tableWrap = createElement('div', { className: 'calendar-body__wrap' },
            this.table
        )



        this.calendarInfo = createElement('div', { className: 'calendar-info' },
            createElement('div', { className: 'date-info' }),
            createElement('div', { className: 'weather-info' }));

        const prevMonthButton = createElement('button', {
            className: 'calendar-head__button button',
            onclick: this.handlePrevMonthButtonClick.bind(this)
        }, '<');

        const nextMonthButton = createElement('button', {
            className: 'calendar-head__button button',
            onclick: this.handleNextMonthButtonClick.bind(this)
        }, '>');

        this.yearSelect = createElement('select', {
            className: 'calendar-head__select select w-100 h-100',
            onchange: this.handleYearSelectChange.bind(this)
        },
            [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021].map(year =>
                createElement('option', {
                    value: year,
                    selected: year === currentYear
                }, year)
            )
        );

        this.monthSelect = createElement('select', {
            className: 'calendar-head__select select w-100 h-100',
            onchange: this.handleMonthSelectChange.bind(this)
        },
            this.MONTH_NAMES.map((name, index) =>
                createElement('option', {
                    value: index,
                    selected: index === currentMonth
                }, name)
            )
        );

        const calendarWrap = createElement('div', { className: 'calendar-wrap' },
            createElement('div', { className: 'calendar-head' },
                prevMonthButton,
                createElement('div', { className: 'calendar-head__select' }, this.monthSelect),
                createElement('div', { className: 'calendar-head__select' }, this.yearSelect),
                nextMonthButton
            ),
            this.tableWrap,
        );
        return calendarWrap;
    }

    addCalendarHeader(currentMonth, currentYear) {
        const calendarWrap = this.createCalendar(currentMonth, currentYear);

        this.calendar.appendChild(calendarWrap);
        this.calendar.appendChild(this.calendarInfo);
    }

    createDates(month) {
        const tableBody = createElement('tbody', null,
            month.map(week =>
                createElement('tr', null,
                    week.map(date => {
                        if (date && date.thisMonth) {
                            let obj = createElement('td', {
                                className: date && date.isToday ? 'has-background-primary has-text-white' : 'this-month',
                                onclick: (event) => this.handleAddNote(event)
                            }, date ? date.day : '');
                            return obj;
                        }
                        else if (date && date.nextData) {
                            let obj = createElement('td', {
                                className: 'next-month',
                                onclick: () => this.handleNextMonthButtonClick()
                            }, date ? date.nextData : '');
                            return obj;
                        } else if (date && date.preMonth) {
                            let obj = createElement('td', {
                                className: 'pre-month',
                                onclick: () => this.handlePrevMonthButtonClick()
                            }, date ? date.preMonth : '');
                            return obj;
                        }
                    }
                    )
                )
            )
        );

        this.table.removeChild(this.tableBody);
        this.tableBody = tableBody;
        this.table.appendChild(this.tableBody);
    }

    handlePrevMonthButtonClick() {
        let month = this.month - 1;
        let year = this.year;
        if (month === -1) {
            month = 11;
            this.yearSelect.value = this.year - 1;
        }

        this.monthSelect.value = month;
        this.emit('prev', { month, year });
    }

    handleNextMonthButtonClick() {
        let month = this.month + 1;
        let year = this.year;
        if (month === 12) {
            month = 0;
            this.yearSelect.value = this.year + 1;
        }
        this.monthSelect.value = month;

        this.emit('next', { month, year });
    }

    handleMonthSelectChange() {
        let month = this.monthSelect.value;
        this.emit('changeMonth', month);
    }

    handleYearSelectChange() {
        let year = this.yearSelect.value;
        let month = this.monthSelect.value;
        this.emit('changeYear', { month, year });
    }

    createListItem(todo) {
        const checkbox = createElement('input', { type: 'checkbox', className: 'todo-item__checkbox', checked: todo.completed ? 'checked' : '' });
        const label = createElement('label', { className: 'todo-item__title' }, todo.title);
        const editInput = createElement('input', { type: 'text', className: 'todo-item__textfield' });
        const editButton = createElement('button', { className: 'todo-item__edit button' }, 'Изменить');
        const deleteButton = createElement('button', { className: 'todo-item__remove button' }, '-');
        const item = createElement('li', { className: `todo-item${todo.completed ? ' completed' : ''}`, 'data-id': todo.id }, checkbox, label, editInput, editButton, deleteButton);

        return this.addEventListeners(item);
    }

    addEventListeners(item) {
        const checkbox = item.querySelector('.todo-item__checkbox');
        const editButton = item.querySelector('button.todo-item__edit');
        const removeButton = item.querySelector('button.todo-item__remove');

        checkbox.addEventListener('change', this.handleToggle.bind(this));
        editButton.addEventListener('click', this.handleEdit.bind(this));
        removeButton.addEventListener('click', this.handleRemove.bind(this));

        return item;
    }

    findListItem(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    handleAddNote(event) {
        let target = event.target;
        this.date = target.textContent;
        let date = this.date;
        let year = this.year;
        let month = this.month;
        const dateInfo = createElement('div', { className: 'date-info' },
            createElement('ul', { className: 'todo-list' }),
            createElement('form', {
                className: 'date-info__form',
                onsubmit: (event) => this.handleAdd(event, { year, month, date })
            },
                createElement('input', { className: 'todo-item__add-input' }),
                createElement('button', { className: 'todo-item__add-button button', type: 'submit' }, '+'))
        );

        const weatherInfo = createElement('div', { className: 'weather-info' },
            createElement('canvas', { className: 'weather-info__icon', width: '128', height: '128' }), createElement('div', { className: 'weather-info__degree-section' },
                createElement('h2', { className: 'weather-info__temperature-section' }), createElement('span', { textContent: 'C' }))
        );

        this.calendarInfo.removeChild(this.calendarInfo.children[1]);
        this.calendarInfo.removeChild(this.calendarInfo.children[0]);
        this.calendarInfo.appendChild(dateInfo);
        this.calendarInfo.appendChild(weatherInfo);
        this.list = document.querySelector('.todo-list');
        this.emit('check', date);
        getWeather();
    }

    handleAdd(event, { year, month, date }) {
        event.preventDefault();
        this.input = document.querySelector('.todo-item__add-input');
        if (!this.input.value) return alert('Необходимо ввести название задачи.');

        const title = this.input.value;
        this.emit('add', { title, year, month, date });
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
        const label = listItem.querySelector('.todo-item__title');
        const input = listItem.querySelector('.todo-item__textfield');
        const editButton = listItem.querySelector('button.todo-item__editedit');
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
            if (todo.id == String(this.date) + this.month + this.year) {
                const listItem = this.createListItem(todo);
                this.list.appendChild(listItem);
            }
        });
    }

    addItem(todo) {
        const listItem = this.createListItem(todo);

        this.input.value = '';
        this.list.appendChild(listItem);
    }

    toggleItem(todo) {
        const listItem = this.findListItem(todo.id);
        const checkbox = listItem.querySelector('.todo-item__checkbox');

        checkbox.checked = todo.completed;

        if (todo.completed) {
            listItem.classList.add('completed');
        } else {
            listItem.classList.remove('completed');
        }
    }

    editItem(todo) {
        const listItem = this.findListItem(todo.id);
        const label = listItem.querySelector('.todo-item__title');
        const editButton = listItem.querySelector('button.todo-item__edit');

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