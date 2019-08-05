function getDates(date) {
    //метод для сборки календаря
    // if(date) {
    // createCalendar(date); создание календаря
    //календарь - массив объектов
    // } elseif {
    // createCalendar();
    const day = new Date().getDate();
    const month = 8;
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
    return allDays = allDaysPre.concat(allDaysThis).concat(allDaysNext);
};

getDates();