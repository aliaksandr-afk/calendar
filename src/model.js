import { EventEmitter } from './helpers';

class Model extends EventEmitter {
    constructor(items) {
        super();

        this.today = new Date();
        // this.year = year;
        // this.month = month;
        // this.day = day;

        this.items = items;
        // this.date = date;
        // this.stateDate = stateDate; //массив с датами праздников

        this.DAYS_IN_WEEK = 7;
        this.ALL_WEEKS = 6;
        // this.DAYS_IN_PRE_MONTH = new Date(year, month, 0).getDate();
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
        // this.day = date.day;
        // this.month = date.month; //выбранный день, месяц и год
        // this.year = date.year;
    }

    getDayOfWeek(year, month, day) {
        switch (new Date(year, month, day).getDay()) {
            case 0: return 6;
            case 1: return 0;
            case 2: return 1;
            case 3: return 2;
            case 4: return 3;
            case 5: return 4;
            case 6: return 5;
        }
    }

    getMonthData(year, month) {
        // const daysInMonth = Calendar.getDaysInMonth(year, month);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // const monthStartsOn = Calendar.getDayOfWeek(year, month, 1);
        const monthStartsOn = new Date(year, month, 1).getDay();

        // const daysInPreMonth = new Date(year, month, 0).getDate();
        // var daysInPreMonth = getDayOfWeek(year, month, 0);
        var daysInPreMonth = new Date(year, month, 0).getDate();
        const firstDayOfMonth = this.getDayOfWeek(year, month, 1);

        var a = new Date(year, month);

        const data = [];
        let day = 1;

        // for (let i = 0; i < (daysInMonth + monthStartsOn) / this.DAYS_IN_WEEK; i++) {
        for (let i = 0; i < this.ALL_WEEKS; i++) {

            data[i] = [];

            for (let j = 0; j < this.DAYS_IN_WEEK; j++) {
                // debugger
                console.log(a);
                if ((i === 0 && j < monthStartsOn)) {
                    if ((daysInMonth + monthStartsOn) / this.DAYS_IN_WEEK <= 4) {
                        for (let i = 0; i < firstDayOfMonth; i++) {
                            data[i][j] = daysInPreMonth--;
                        }
                    }
                    //
                }



                // if ((i === 0 && j < monthStartsOn) || day > daysInMonth) {
                //     // data[i][j] = undefined;

                // } else {
                //     data[i][j] = {
                //         year,
                //         month,
                //         day,
                //         isToday: this.isToday(year, month, day)
                //     };

                //     day++;
                // }
            }
        }
        // console.log(data);
        return data;
    }

    isToday(year, month, day) {
        if (year != this.currentYear) return false;
        if (month != this.currentMonth) return false;
        if (day != this.currentDay) return false;

        return true;
    }
    // //метод для сборки календаря
    // if (date) {
    //     // createCalendar(date); создаание календаря
    //     //календарь - массив объектов
    // } else {
    //     const day = new Date().getDate();
    //     const month = new Date().getMonth();
    //     const year = new Date().getFullYear();

    //     const daysInMonth = new Date(year, month + 1, 0).getDate();

    //     const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    //     const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    //     var firstDay = new Date(year, month, 1).getDay();
    //     const lastDay = new Date(year, month, daysInMonth).getDay();

    //     var daysInPreMonth = new Date(year, month, 0).getDate();

    //     const allDaysPre = [];
    //     var firstDayNext = lastDay;
    //     if (firstDay == 0) {
    //         firstDay = 7;
    //     }

    //     for (let i = 0; i < firstDay - 1; i++) {
    //         allDaysPre[i] = daysInPreMonth--;
    //     }
    //     allDaysPre.sort();

    //     const allDaysThis = [];
    //     for (let i = 1; i <= daysInMonth; i++) {
    //         allDaysThis[i] = i;
    //     }




    // if((allDaysPre + allDaysThis) <= 35 ) {
    //     let lastEl = allDaysNext.length;
    //     let 
    //     for(let i = allDaysNext[lastEl]; i < )
    // }

    //     const allDaysNext = [];
    //     let daysWithoutNext = 42 - (allDaysPre + allDaysThis);

    //     if (daysWithoutNext >= 7) {
    //         let lastEl = allDaysNext.length;

    //         for (let i = allDaysNext[lastEl]; i < daysWithoutNext; i++) {
    //             allDaysNext[i] = i;
    //         }
    //     } else {
    //         for (let i = 1; i <= 7 - (lastDay); i++) {
    //             allDaysNext[i] = i;
    //         }
    //     }

    //     var allDays = { allDaysPre, allDaysThis, allDaysNext };
    //     return allDays;
    //     // return allDaysPre, allDaysThis, allDaysNext; 
    //     // return allDays = allDaysPre.concat(allDaysThis).concat(allDaysNext);
    // }
    // }

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