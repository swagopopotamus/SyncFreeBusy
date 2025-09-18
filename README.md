# Sync Free/Busy Status Between Google Calendars

## Overview
This script syncs the **busy time blocks** from a personal Google Calendar to a work Google Calendar. It ensures that only the **free/busy status** is copied, without exposing any event details. The script runs on the work Google account, which must have access to view the free/busy status of the personal calendar.

### Features:
* Copies **only busy time** from the personal calendar to the work calendar.
* Syncs only events **starting within business hours** (Monday-Friday, 9 AM-5 PM).
* Deletes only the events it created if the corresponding busy block is removed from the personal calendar.
* Configurable number of days to check in advance.

---

## Setup Instructions
### PropertiesService Tracking

The script now uses Google Apps Script's PropertiesService to track which calendar events it creates. No manual setup is required—this is handled automatically.

#### Viewing Tracked Events
To view all tracked event IDs and their metadata, add this helper function to your script:

```javascript
function logAllScriptProperties() {
   var props = PropertiesService.getScriptProperties().getProperties();
   Logger.log(props);
}
```
Run this function in the Apps Script editor and check the "Logs" panel.

#### Clearing All Tracked Events
If you want to reset the script's tracking (for troubleshooting or a fresh start), add and run:

```javascript
function clearAllScriptProperties() {
   PropertiesService.getScriptProperties().deleteAllProperties();
}
```
This will remove all event tracking from PropertiesService.


### 1. Share Free/Busy Access
To allow your **work Google account** to see the **free/busy status** of your **personal Google Calendar**, follow these steps:

1. Open [Google Calendar](https://calendar.google.com/).
2. In the left panel, find your **personal calendar** under "My Calendars."
3. Click the **three dots** next to it and select **Settings and sharing**.
4. Scroll to the **Share with specific people** section.
5. Click **Add people** and enter your **work email address**.
6. Under **Permissions**, select **See only free/busy (hide details)**.
7. Click **Send**.

---

### 2. Set Up the Script in Google Apps Script

1. Sign in to your **work Google account**.
2. Open [Google Apps Script](https://script.google.com/).
3. Click **New Project**.
4. Copy and paste the script into the editor.
5. Replace the placeholders in the script with your actual calendar IDs:
   - `your_personal_email@gmail.com` → Your **personal calendar ID** (usually your email address).
   - `your_work_calendar_id@yourcompany.com` → Your **work calendar ID**.
6. Click **Save**.

---

### 3. Grant Necessary Permissions

1. Click the **Run** button.
2. You’ll be prompted to **authorize** the script.
3. Click **Review permissions** and sign in with your **work account**.
4. Click **Allow** to grant permissions to access your calendars.

---

### 4. Set Up an Automatic Trigger (Optional)
To have the script run automatically:

1. In Google Apps Script, click **Triggers** (clock icon in the left sidebar).
2. Click **+ Add Trigger**.
3. Select the function `syncFreeBusyFromPersonalToWork`.
4. Choose **Time-driven** > **Day timer** > Select a frequency (e.g., **Every 6 hours**).
5. Click **Save**.

---

## Troubleshooting
- If the script is **not copying events**, ensure your **work account** has access to your personal calendar's free/busy status.
- If you see a **quota limit error**, reduce the script execution frequency.
- If manually created work calendar events are being deleted, ensure their event IDs are not tracked in PropertiesService. Only events created by the script are managed and deleted.
- To audit or reset tracked events, use the helper functions above.

---

## License
MIT License. Feel free to modify and improve!

