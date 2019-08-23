class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        // debugger
        // this.yearSelect = null;
        // this.monthSelect = null;
        // console.log(view.monthSelect.value);
        this.prevMonthButton = null;
        this.nextMonthButton = null;
        this.table = null;
        this.tableHead = null;
        this.tableBody = null;
        
        view.on('add', this.addTodo.bind(this));
        view.on('toggle', this.toggleTodo.bind(this));
        view.on('edit', this.editTodo.bind(this));
        view.on('remove', this.removeTodo.bind(this));
        view.on('prev', this.prevMonth.bind(this));
        view.on('next', this.nextMonth.bind(this));
        view.on('changeMonth', this.changeMonth.bind(this));
        view.on('changeYear', this.changeYear.bind(this));

        view.show(model.items);
        // view.on('add', this.addCalendar.bind(this));

        view.addCalendarHeader(model.currentMonth, model.currentYear);
        this.addCalendar(model.currentMonth, model.currentYear);
        // view.update();
    }

    prevMonth({month, year}) {
        console.log(month, year);
        this.addCalendar(month, year);
    }

    nextMonth({month, year}) {
        console.log(month, year);
        this.addCalendar(month, year);
    }

    changeMonth(month) {
        this.addCalendar(month, this.model.currentYear);
    }

    changeYear({month, year}) {
        this.addCalendar(month, year);
    }

    addCalendar(currentMonth, currentYear) {
        const month = this.model.getMonthData(currentYear, currentMonth);
        this.view.createDates(month);
    }

    addTodo(title) {
        const item = this.model.addItem({
            id: Date.now(),
            title,
            completed: false
        });

        this.view.addItem(item);
    }

    toggleTodo({ id, completed }) {
        const item = this.model.updateItem(id, { completed });

        this.view.toggleItem(item);
    }

    editTodo({ id, title }) {
        const item = this.model.updateItem(id, { title });
        
        this.view.editItem(item);
    }

    removeTodo(id) {
        this.model.removeItem(id);
        this.view.removeItem(id);
    }
}

export default Controller;