import { EventEmitter } from './helpers';

class Model extends EventEmitter {
    constructor(date, state = [], stateDate = []) {
        super();

        this.state = state;
        this.stateDate = stateDate; //массив с датами праздников
        // this.day = date.day;
        // this.month = date.month; //выбранный день, месяц и год
        // this.year = date.year;
    }

    getCalendar(date) {
        //метод для сборки календаря
        if (date) {
            // createCalendar(date); создаание календаря
            //календарь - массив объектов
        } else {
            const day = new Date().getDate();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();
        
            const daysInMonth = new Date(year, month+1, 0).getDate();
            const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
            const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
            var firstDay = new Date(year, month, 1).getDay();
            const lastDay = new Date(year, month, daysInMonth).getDay();
        
            var daysInPreMonth = new Date(year, month, 0).getDate();
            const allDaysPre = [];
            var firstDayNext = lastDay;
            if(firstDay == 0) {
                firstDay = 7;
            }
            for (let i = 0; i < firstDay - 1; i++) {
                allDaysPre[i] = daysInPreMonth--;
            }
            allDaysPre.sort();
        
            const allDaysNext = [];
            for (let i = 1; i <= 7 - (lastDay); i++) {
                allDaysNext[i] = i;
            }
        
            const allDaysThis = [];
            for(let i = 1; i <= daysInMonth; i++) {
                allDaysThis[i] = i;
            }
        
            var allDays = [];
            return allDaysPre, allDaysThis, allDaysNext; 
            // return allDays = allDaysPre.concat(allDaysThis).concat(allDaysNext);
    }
}

    getItem(id) {
        return this.items.find(item => item.id == id);
    }

    addItem(item) {
        this.items.push(item);
        this.emit('change', this.items);
        return item;
    }

    updateItem(id, data) {
        const item = this.getItem(id);

        Object.keys(data).forEach(prop => item[prop] = data[prop]);

        this.emit('change', this.items);
        
        return item;
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id == id);
        
        if (index > -1) {
            this.items.splice(index, 1);
            this.emit('change', this.items);
        }
    }
}

export default Model;