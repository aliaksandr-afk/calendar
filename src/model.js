class Model {
    constructor(date, state = [], stateDate = []) {
        this.state = state;
        this.stateDate = stateDate; //массив с датами праздников
        // this.day = date.day;
        // this.month = date.month; //выбранный день, месяц и год
        // this.year = date.year;
    }

    getCalendar(date) {
        //метод для сборки календаря
        if(date) {
            // createCalendar(date); создаание календаря
            //календарь - массив объектов
        } else {
            // createCalendar();
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();
            const dayInMonth = new Date(year, month + 1, 0).getDate();
            const month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
            console.log(dayInMonth);
        }
    }

    getItem(id) {
        return this.state.find(item => item.id == id);
    }

    addItem(item) {
        this.state.push(item);
    }

    updateItem(id, data) {
        const item = this.getItem(id);
        Object.keys(data).forEach(prop => item[prop] = data[prop]);
    }

    removeItem(id) {
        const index = this.state.findIndex(item => item.id = id);

        if(index > -1) {
            this.state.splice(index, 1);
        }
    }
}

export default Model;