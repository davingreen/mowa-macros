const googleApis = require("googleapis")
const auth = googleApis.auth.OAuth2

let client,
	hasCredentials,
	sheets = false

export function getAuthUrl(client_id, client_secret, redirect, scope) {
	client = new auth(client_id, client_secret, redirect)
	return client.generateAuthUrl({
		access_type: "offline",
		scope,
		prompt: "consent"
	})
}

export function getToken(client_id, client_secret, redirect, code) {
	client = new auth(client_id, client_secret, redirect)
	return new Promise((resolve, reject) => {
		client.getToken(code, (err, tokens) => {
			if (err) reject(err)
			resolve(tokens)
			return
		})
	})
}

export function authorize(clientInfo) {
	client = new auth(clientInfo.id, clientInfo.secret, clientInfo.redirect)
	client.setCredentials(clientInfo.tokens)
	googleApis.options({ auth: client })
	hasCredentials = true
	return this
}

export function appendToSheet(sheet_id, values) {
	return new Promise((resolve, reject) => {
		if (!hasCredentials) {
			return reject("Not authorized.")
		}
		googleApis.sheets("v4").spreadsheets.values.append({
			spreadsheetId: sheet_id,
			range: "A:C",
			valueInputOption: "USER_ENTERED",
			insertDataOption: "INSERT_ROWS",
			resource: {
				values: [values]
			}
		}, (err, response) => {
			if (err) {
				return reject(err)
			}
			resolve(response)
		})
	})
}
export async function replaceSheet(spreadsheet_id, sheet_id, values) {
	/* await new Promise((resolve, reject) => {
		googleApis.sheets("v4").spreadsheets.batchUpdate({	
			spreadsheetId: spreadsheet_id,
			resource : {
				requests : [{
					updateCells : {
						range: {
							sheetId: 0
						},
						fields: "userEnteredValue"
					}
				}]
			}
		}, (err, res) => {
			if (err) {return reject(err)}
			return resolve(res)
		})
	}) */
	return await updateCells(spreadsheet_id, sheet_id + "!A1:" + values.length, values)
}
export function updateCells(spreadsheetId, range, values) {
	return new Promise((resolve, reject) => {
		googleApis.sheets("v4").spreadsheets.values.update({
			spreadsheetId,
			range,
			valueInputOption: "RAW",
			resource: {
				values
			}
		}, (err, res) => {
			if (err) {
				return reject(err)
			}
			return resolve(res)
		})
	})

}