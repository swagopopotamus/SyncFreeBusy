# Copilot Instructions for SyncFreeBusy

## Project Overview
This project syncs **free/busy status** from a personal Google Calendar to a work Google Calendar using Google Apps Script. It ensures only busy blocks are copied, without exposing event details. The script is intended to run on the work account, which must have free/busy access to the personal calendar.

## Key Files
- `SyncFreeBusy.js`: Main script. Contains all sync logic and configuration points.
- `README.md`: Setup, permissions, and usage instructions. Follow this for onboarding and troubleshooting.

## Architecture & Data Flow
- Reads events from the personal calendar (using its calendar ID).
- Filters events to only those overlapping with business hours (Mon-Fri, 9 AM-5 PM by default).
- Creates/updates/deletes events in the work calendar, marking them as "Busy" and setting description to `Sync - Busy Time`.
- Only events created by the script (with this description) are managed/deleted.

## Critical Workflows
- **Configuration:** Update calendar IDs and business hours in `SyncFreeBusy.js`.
- **Authorization:** Script must be authorized in Google Apps Script with calendar access.
- **Automation:** Use Google Apps Script triggers to run periodically (see README for steps).
- **Manual Run:** Use the Apps Script editor's Run button for ad-hoc sync/testing.

## Project-Specific Patterns
- **Event Identification:** All script-created events have description `Sync - Busy Time`. Manual events are not touched.
- **Business Hours Filtering:** Only syncs events overlapping with work hours. Logic in `isOverlappingWithWorkHours()`.
- **Idempotency:** Script checks for existing busy blocks before creating new events, and only deletes events it created if the corresponding busy block is removed.
- **Logging:** Uses `Logger.log` for status and error reporting. Review logs in Apps Script editor for debugging.

## Integration Points
- **Google Calendar API (via Apps Script):** No external dependencies beyond Google services.
- **Calendar Sharing:** Work account must have free/busy access to personal calendar (see README).

## Conventions
- All configuration is at the top of `SyncFreeBusy.js`.
- Event description is used for script-created event tracking.
- No build/test scripts; all logic is in Apps Script and run via Google UI.

## Example Usage
- To sync for 60 days instead of 30, change `var DAYS_AHEAD = 60;` in `SyncFreeBusy.js`.
- To change work hours, update `WORK_START_HOUR` and `WORK_END_HOUR`.
- To debug, check `Logger.log` output after running the script.

## Troubleshooting
- If events are not syncing, check calendar sharing and authorization.
- If manual events are deleted, ensure their description is not `Sync - Busy Time`.
- For quota errors, reduce trigger frequency.

---

For questions or unclear patterns, review `README.md` or ask for clarification.
