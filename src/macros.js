import * as Firebase from "./utils/firebase"
import * as Google from "./utils/google"
import * as DataPrep from "./utils/dataPrep"
import PodioAPI from "./utils/podio"
import _ from "lodash"
//let fs = require("fs-extra")

export async function ExportPodioData() {
	try {
		const config = await Firebase.getMacrosConfig()
		let podio = new PodioAPI(config.PODIO_CLIENT)
		let appNames = _.keys(config.PODIO_APPS)

		for (let appName of appNames) {
			console.log(appName)
			await podio.authorize(config.PODIO_APPS[appName])
			let app = await podio.getApp(config.PODIO_APPS[appName].id)
			let meta = [
				"item_id",
				"last_event_on",
				"app_item_id",
				"title",
				"created_via",
				"created_by",
				"created_on",
				"link",
				"revision"
			]

			let appFields = DataPrep.getAppFields(app.fields)
			// Check against the Podio field order in Firebase
			// Add any external_ids of old fields
			// Order by the field order array
			// [{field_id : external_id}]
			// Add any new fields to end of field order

			let headerRow = _.concat(meta, _.map(appFieldLabels, "label"))

			let sheetValues = [headerRow]

			//let items = await fs.readJson("../../testItems.json")
			let items = await podio.getAppItems(config.PODIO_APPS[appName].id)

			for (let item of items) {
				sheetValues = _.concat(sheetValues, [
					DataPrep.itemToArray(item, meta, _.map(appFieldLabels, "external_id"))
				])
			}
			if (!!process.env.NODE_ENV && process.env.NODE_ENV === "local") {
				//fs.writeFile("../../results.json", JSON.stringify(sheetValues), 'utf8', (err) => console.log('done', err)) // Enable if refreshing the data in the local testItems.json
			} else {
				await Google.authorize(config.GOOGLE_CLIENT)
				await Google.replaceSheet(config.SHEET_ID, appName, sheetValues)
			}
		}
		return true
	} catch (e) {
		console.error(e)
		return false
	}
}
/* Takes in the request body from a Podio hook. Body should 
contain hook_id, item_id, and item_revision_id. */
export async function TriggerMacros() {
	// Check if this is a client item. If so, run the LocateClient macro.
}

export async function LocateClient() {
	// Extract the client address information
	// Check that it's complete.
	// Send the address to Google Maps API
	// Extract the client Lng/Lat and county from GMaps
	// Compare to the client field values (if exists)
	// Save to the client item if different
	// If there's an issue, save warning to the client item
}
