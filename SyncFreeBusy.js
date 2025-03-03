function syncFreeBusyFromPersonalToWork() {
    var personalCalendarId = "your_personal_email@gmail.com"; // Replace with your personal email
    var workCalendarId = "your_work_calendar_id@yourcompany.com"; // Replace with your work calendar ID
    var DAYS_AHEAD = 30; // Set the number of days ahead you want to check for events (e.g., 30 days)

    var workCalendar = CalendarApp.getCalendarById(workCalendarId);
    if (!workCalendar) {
        Logger.log("ERROR: Cannot access work calendar. Check the Calendar ID.");
        return;
    }

    var now = new Date();
    var startTime = toUTC(now);
    var endTime = toUTC(new Date(now.getTime() + (DAYS_AHEAD * 24 * 60 * 60 * 1000)));

    var personalCalendar = CalendarApp.getCalendarById(personalCalendarId);
    if (!personalCalendar) {
        Logger.log("ERROR: Cannot access personal calendar. Ensure it is shared with your work email.");
        return;
    }

    // Get personal calendar events
    var personalEvents = personalCalendar.getEvents(startTime, endTime);
    Logger.log("Found " + personalEvents.length + " personal events in the next " + DAYS_AHEAD + " days.");

    // Get all work calendar events created by the script
    var workEvents = workCalendar.getEvents(startTime, endTime).filter(event => event.getDescription() === "Sync - Busy Time");

    // Track existing busy start times in personal calendar
    var busyTimes = personalEvents
        .filter(event => isWithinBusinessHours(event.getStartTime()))
        .map(event => ({
            start: toUTC(event.getStartTime()).getTime(),
            end: toUTC(event.getEndTime()).getTime()
        }));

    // Add missing busy time blocks to work calendar
    busyTimes.forEach(timeBlock => {
        var eventExists = workEvents.some(e => toUTC(e.getStartTime()).getTime() === timeBlock.start && toUTC(e.getEndTime()).getTime() === timeBlock.end);

        if (!eventExists) {
            try {
                workCalendar.createEvent("Busy", new Date(timeBlock.start), new Date(timeBlock.end), {
                    visibility: CalendarApp.Visibility.PRIVATE,
                    description: "Sync - Busy Time"
                });
                Logger.log("✅ Added busy time: " + new Date(timeBlock.start).toISOString() + " to " + new Date(timeBlock.end).toISOString());
            } catch (e) {
                Logger.log("❌ Error creating event: " + e.message);
            }
        } else {
            Logger.log("⏩ Busy time already exists: " + new Date(timeBlock.start).toISOString() + " to " + new Date(timeBlock.end).toISOString());
        }
    });

    // Remove work calendar events that no longer have a corresponding start time in personal calendar
    workEvents.forEach(workEvent => {
        var stillBusy = busyTimes.some(timeBlock =>
            toUTC(workEvent.getStartTime()).getTime() === timeBlock.start &&
            toUTC(workEvent.getEndTime()).getTime() === timeBlock.end
        );

        if (!stillBusy) {
            try {
                workEvent.deleteEvent();
                Logger.log("❌ Removed busy time: " + workEvent.getStartTime().toISOString() + " to " + workEvent.getEndTime().toISOString());
            } catch (e) {
                Logger.log("❌ Error deleting event: " + e.message);
            }
        } else {
            Logger.log("⏩ Keeping busy time: " + workEvent.getStartTime().toISOString() + " to " + workEvent.getEndTime().toISOString());
        }
    });
}

// Helper function to check if an event's **start time** is within business hours (Monday-Friday, 9 AM-5 PM)
function isWithinBusinessHours(start) {
    var utcStart = toUTC(start);
    var hours = utcStart.getUTCHours();
    var day = utcStart.getUTCDay();

    if (hours < 9 || hours >= 17) {
        Logger.log("Skipping event outside business hours: " + utcStart.toISOString());
        return false;
    }

    if (day === 0 || day === 6) {
        Logger.log("Skipping weekend event: " + utcStart.toISOString());
        return false;
    }

    return true;
}

// Helper function to convert date/time to UTC
function toUTC(date) {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ));
}
