import { EventEmitter } from './helpers';

class Model extends EventEmitter {
    constructor(items) {
        super();

        this.today = new Date();
        this.items = items;

        this.DAYS_IN_WEEK = 7;
        this.ALL_WEEKS = 6;
        this.WEATHER_KEY = "ab1ea7fd597beb01d76e5f472986c7dd";
    }

    async gettingWeather () {
        const api_url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mahilyow,by&appid=${this.WEATHER_KEY}&units=metric`);
        const data = await api_url.json();
        console.log(data);
    }

    get currentYear() {
        return this.today.getFullYear();
    }

    get currentMonth() {
        return this.today.getMonth();
    }

    get currentDay() {
        return this.today.getDate();
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
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const data = [[], [], [], [], [], []];
        let day = 1;

        this.getPreData(year, month, data);
        for (let i = 0; i < this.ALL_WEEKS; i++) {
            for (let j = 0; j < this.DAYS_IN_WEEK; j++) {
                if (!(data[i][j]) && day <= daysInMonth) {
                    data[i][j] = {
                        year,
                        month,
                        day,
                        thisMonth: true,
                        isToday: this.isToday(year, month, day)
                    };
                    day++;
                }
            }
        }
        this.getNextData(year, month, data);
        return data;
    }

    getPreData(year, month, data) {
        var daysInPreMonth = new Date(year, month, 0).getDate();
        const lastDayPre = this.getDayOfWeek(year, month - 1, daysInPreMonth);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthStartsOn = new Date(year, month, 1).getDay();
        data[0] = [];

        if (((daysInMonth + monthStartsOn) / this.DAYS_IN_WEEK) < 1) {
            for (let j = 6; j > -1; j--) {
                data[0][j] = {
                    year,
                    month,
                    preMonth: daysInPreMonth,
                    isToday: false
                };
                daysInPreMonth--;
            }
        } else {
            for (let j = lastDayPre; j >= 0; j--) {
                data[0][j] = {
                    year,
                    month,
                    preMonth: daysInPreMonth,
                    isToday: false
                };
                daysInPreMonth--;
            }
        }
    }

    getNextData(year, month, data) {
        let day = 1;

        for (let i = 0; i < this.ALL_WEEKS; i++) {
            for (let j = 0; j < this.DAYS_IN_WEEK; j++) {
                if (!(data[i][j])) {
                    data[i][j] = {
                        year,
                        month,
                        nextData: day,
                        isToday: false
                    };
                    day++;
                }
            }
        }
    }

    isToday(year, month, day) {
        if (year != this.currentYear) return false;
        if (month != this.currentMonth) return false;
        if (day != this.currentDay) return false;

        return true;
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