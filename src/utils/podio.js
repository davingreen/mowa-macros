import _ from "lodash"

import request from "request-promise"
//require('request-debug')(request) // Uncomment for full network console outputs.

export default class PodioAPI {
	constructor(clientInfo) {
		//this.config = config
		this.apiUrl = "https://api.podio.com"
		this.tokenUrl = "https://podio.com/oauth/token"
		this.headers = {
			Authorization: ""
		}
		this.clientInfo = clientInfo
	}
	async authorize(credentials, type, scope = "global") {
		try {
			switch (type) {
				case "user": {
					let tokens = await request.post(this.tokenUrl, {
						form: {
							grant_type: "password",
							username: credentials.username,
							password: credentials.password,
							client_id: this.clientInfo.id,
							client_secret: this.clientInfo.secret
						}
					})
					this.headers["Authorization"] =
						"Bearer " + JSON.parse(tokens).access_token
					return this
				}
				default: {
					let tokens = await request.post(this.tokenUrl, {
						form: {
							grant_type: "app",
							app_id: credentials.id,
							app_token: credentials.token,
							client_id: this.clientInfo.id,
							client_secret: this.clientInfo.secret
						}
					})
					this.headers["Authorization"] =
						"Bearer " + JSON.parse(tokens).access_token
					return this
				}
			}
		} catch (e) {
      console.error(e)
			throw new Error("Error authenticating Podio.")
		}
  }
  async getApp(app_id) {
    try {
      let response = await request({
				headers: this.headers,
        uri: this.apiUrl + "/app/" + app_id,
      })
      return JSON.parse(response)
    }
    catch (e) {
      console.error(e)
      throw new Error('Error getting app.')
    }
  }
	async getAppItems(app_id, options = {limit: 500, offset: 0}, all = true) {
		try {
			let response = await request.post({
				headers: this.headers,
        uri: this.apiUrl + "/item/app/" + app_id + "/filter",
        body: JSON.stringify(
          options
        )
      }) 
      response = JSON.parse(response)
      let items = response.items

      if (all && (options.offset + response.items.length) < response.total) {
        options.offset += 500
        items = _.concat(items,await this.getAppItems(app_id, options))
      }
      return items
		} catch (e) {
      console.error(e)
			throw new Error("Error getting app items.")
		}
	}

	auth(type, scope) {
		switch (type) {
			case "user": {
				return new Promise((resolve, reject) => {
					request
						.post("https://podio.com/oauth/token", {
							form: {
								grant_type: "password",
								username: this.config.users[scope].username,
								password: this.config.users[scope].password,
								client_id: this.config.client_id,
								client_secret: this.config.client_secret
							}
						})
						.then(token => {
							this.headers["Authorization"] =
								"Bearer " + JSON.parse(token).access_token
							resolve()
						})
						.catch(err => {
							reject(err)
						})
				})
				return
			}
			case "app": {
				return new Promise((resolve, reject) => {
					request
						.post("https://podio.com/oauth/token", {
							form: {
								grant_type: "app",
								app_id: this.config.apps[scope].id,
								app_token: this.config.apps[scope].token,
								client_id: this.config.client_id,
								client_secret: this.config.client_secret
							}
						})
						.then(token => {
							this.headers["Authorization"] =
								"Bearer " + JSON.parse(token).access_token
							resolve()
						})
						.catch(err => {
							reject(err)
						})
				})
			}
		}
	}
	verifyHook(hook_id, code) {
		return new Promise((resolve, reject) => {
			request
				.post({
					uri: this.apiUrl + "/hook/" + hook_id + "/verify/validate",
					headers: this.headers,
					body: JSON.stringify({
						code: code
					})
				})
				.then(resolve())
		})
	}
	filterItems(app, options) {
		console.log("Filtering...")
		return new Promise((resolve, reject) => {
			request
				.post({
					uri:
						this.apiUrl + "/item/app/" + this.config.apps[app].id + "/filter",
					headers: this.headers
				})
				.then(result => {
					let items = JSON.parse(result).items
					resolve(items)
				})
		})
	}
	getItem(id) {
		return new Promise((resolve, reject) => {
			request
				.get({
					uri: this.apiUrl + "/item/" + id + "?mark_as_viewed=false",
					headers: this.headers
				})
				.then(item => {
					item = JSON.parse(item)
					item.fields = getFieldValues(item.fields)
					resolve(item)
				})
		})
	}
	getItemReferences(item) {
		let refs =
			!!item.refs && item.refs.length != 0
				? _.keyBy(item.refs, "app.name")
				: false
		return refs
	}
	newItem(app, options) {
		return new Promise((resolve, reject) => {
			request
				.post({
					uri: this.apiUrl + "/item/app/" + this.config.apps[app].id,
					headers: this.headers,
					body: JSON.stringify({
						fields: options.fields
					})
				})
				.then(item => {
					resolve(JSON.parse(item))
				})
		})
	}
	updateItem(id, options) {
		return new Promise((resolve, reject) => {
			request
				.put({
					uri: this.apiUrl + "/item/" + id + "?hook=false",
					headers: this.headers,
					body: JSON.stringify({
						fields: options.fields
					})
				})
				.then(item => {
					if (item == "") resolve()
					else resolve(JSON.parse(item))
				})
		})
	}
	comment(id, msg = "", options = {}) {
		return new Promise((resolve, reject) => {
			request
				.post({
					uri: this.apiUrl + "/comment/" + "item" + "/" + id + "?hook=false",
					headers: this.headers,
					body: JSON.stringify({
						value: msg
					})
				})
				.then(comment => {
					resolve(JSON.parse(comment))
				})
		})
	}
	deleteComment(id) {
		return new Promise((resolve, reject) => {
			request
				.delete({
					uri: this.apiUrl + "/comment/" + id + "?hook=false",
					headers: this.headers
				})
				.then(() => {
					resolve()
				})
		})
	}
	getRevisedFieldIds(id, from, to) {
		return new Promise((resolve, reject) => {
			request
				.get({
					uri: this.apiUrl + "/item/" + id + "/revision/" + from + "/" + to,
					headers: this.headers
				})
				.then(fieldRevisions => {
					resolve(_.map(JSON.parse(fieldRevisions), "external_id"))
				})
		})
	}
}
function getFieldValues(fields) {
	if (!fields || !fields.length) {
		return fields
	}
	var fields = _.map(fields, function(field) {
		if (!field.values) {
			return field
		}
		switch (field.type) {
			case "app": {
				if (field.values.length > 1) {
					field.value = _.join(_.map(field.values, "value.item_id"), ",")
					break
				}
				field.value = field.values[0].value.item_id
				break
			}
			case "category": {
				field.value = _.join(_.map(field.values, "value.text"), ",")
				break
			}
			case "date": {
				field.value = { start_date: "", end_date: "" }
				field.value.start_date = field.values[0].start_date
				if (!!field.values[0].end_date) {
					field.value.end_date = field.values[0].end_date
				} else {
					field.value.end_date = field.value.start_date
				}
				break
			}
			case "location": {
				if (field.values.length > 0) {
					field.value = field.values[0]
					field.value.city = !!field.value.city ? field.value.city : ""
					field.value.map_in_sync = !!field.value.map_in_sync
						? field.value.map_in_sync
						: false
					field.value.country = !!field.value.country ? field.value.country : ""
					field.value.state = !!field.value.state ? field.value.state : ""
					field.value.postal_code = !!field.value.postal_code
						? field.value.postal_code
						: ""
					field.value.lat = !!field.value.lat ? field.value.lat : ""
					field.value.lng = !!field.value.lng ? field.value.lng : ""
					field.value.street_address = !!field.value.street_address
						? field.value.street_address
						: ""
					field.value.full_address = !!field.value.formatted
						? field.value.formatted
						: ""
				}
				break
			}
			case "email":
			case "phone": {
				if (field.values.length > 0) {
					field.value = _.join(_.map(field.values, "value"), ",")
					field.type = _.join(_.map(field.values, "type"), ",")
					break
				}
				field.type = field.values[0].type
				field.value = field.values[0].value
				break
			}
			case "calculation":
			case "number":
			case "text": {
				field.value = field.values[0].value
				break
			}
		}
		return field
	})
	return _.keyBy(fields, "external_id")
}
