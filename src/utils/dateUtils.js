export const generateMonthMatrix = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDayOfWeek = (startOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const matrix = [];
    let day = 1 - startDayOfWeek;

    for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
            const thisDate = new Date(date.getFullYear(), date.getMonth(), day);
            week.push({
                date: thisDate,
                isCurrentMonth: thisDate.getMonth() === date.getMonth(),
            });
            day++;
        }
        matrix.push(week);
    }
    return matrix;
};
