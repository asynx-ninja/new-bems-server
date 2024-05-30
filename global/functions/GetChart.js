const GetChart = (timeRange, specificDate, week, month, year) => {
    const today = new Date();
    let query = { isApproved: "Approved" };

    switch (timeRange) {
        case "today":
            query.createdAt = {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999)),
            };
            break;
        case "weekly":
            if (week) {
                const weekDate = new Date(week);
                // Set to the start of the week (e.g., Monday)
                const weekStart = new Date(weekDate);
                weekStart.setDate(weekDate.getDate() - weekDate.getDay() + 1); // Adjust depending on how your week is defined (Sunday or Monday as start)
                weekStart.setUTCHours(0, 0, 0, 0);

                // Set to the end of the week
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6); // 6 days later
                weekEnd.setUTCHours(23, 59, 59, 999);

                query.createdAt = {
                    $gte: weekStart,
                    $lt: weekEnd,
                };
            }
            break;
        case "monthly":
            if (year && month) {
                const startOfMonth = new Date(year, month - 1, 1); // Month is 0-indexed
                const endOfMonth = new Date(year, month, 0); // Get the last day of the month

                query.createdAt = {
                    $gte: startOfMonth,
                    $lt: endOfMonth,
                };
            }
            break;
        case "annual":
            if (year) {
                const startYear = new Date(year, 0, 1); // January 1st
                const endYear = new Date(year, 11, 31); // December 31st
                query.createdAt = {
                    $gte: startYear,
                    $lt: endYear,
                };
            }
            break;

        case "specific":
            if (specificDate) {
                const setted_date = new Date(specificDate);
                // Ensure the date is set to the beginning of the day in UTC
                setted_date.setUTCHours(0, 0, 0, 0);
                const nextDay = new Date(setted_date);
                nextDay.setUTCDate(setted_date.getUTCDate() + 1);

                query.createdAt = {
                    $gte: setted_date,
                    $lt: nextDay,
                };
            }
            break;
        default:
            break;
    }

    return query;
}

module.exports = GetChart;