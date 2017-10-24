This is a series of functions designed to work on Google Cloud Functions. The functions are designed to work in three environments: local, staging, and production. Local uses the firebase functions emulator on the local development machine. Staging and production are fully configured Firebase accounts, only different in the name and values in the Firebase database. 



1. In Build directory, run "firebase init" for database and functions with staging project as default
2. Install packages in top dir
3. Run deploy


/* TODO: 
  Get last Podio hook timestamp from Firebase.
  If last hook < 90 seconds ago, then die.
  */

/* TODO: Get the configuration from Firebase
  Config includes
    - Google Sheets OAuth Credentials and Tokens
    - Google Sheet ID
    - Podio OAuth Credentials
    - Podio App IDs
    */

/* TODO:
  Get list of Apps to Export items from.
  For each app 
    Start a 2D values array
        Add item meta headers to row array
    Get the app sheet from Google sheets
      If not exist
        Create a sheet for app
      Else
        Extract the headers from the sheet into row array
    Get the app from Podio
      For each app fields  
        Compare field external-id to sheet headers
        If not found, add to end of row array
    Get the items from the app in Podio
      If more than 500, then repeat until all items are gotten
      For each item
        Extract the item meta
          Add to row array
        Extract the item fields 
          Add to row array
        Parse field values
          Add to row array
    Send the values array to Google sheets 
    */

// TODO: Function that saves Podio hook data with timestamp to Firebase
// TODO: Set delay for ExportPodioData to run in 10 seconds
// TODO-EXTRA: Check for new Podio App based on latest item_ids; add new apps to config
