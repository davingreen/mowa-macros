import _ from "lodash"

export function getAppFields(fields) {
	let fieldLabels = []
	for (let field of fields) {
		switch (field.type) {
			case "date": {
				fieldLabels.push({
					external_id: field.external_id,
					label: field.label + " - Start UTC"
				})
				if (
					!!field.config.settings.end &&
					field.config.settings.end !== "disabled"
				)
					fieldLabels.push({
						external_id: field.external_id + "_end",
						label: field.label + " - End UTC"
					})
				break
			}
			case "email":
			case "phone": {
				fieldLabels.push({
					external_id: field.external_id + "_types",
					label: field.label + " - Types"
				})
				fieldLabels.push({
					external_id: field.external_id,
					label: field.label
				})
				break
			}
			default: {
				fieldLabels.push({
					external_id: field.external_id,
					label: field.label
				})
			}
		}
	}
	return fieldLabels
}
export function itemToArray(item, meta, field_ids) {
	let itemMeta = []
	for (let metaLabel of meta) {
		if (typeof item[metaLabel] === "object") itemMeta.push(item[metaLabel].name)
		else itemMeta.push(item[metaLabel])
	}
	let itemFieldValues = []
	let itemValues = getFieldValues(item.fields)
	for (let field_id of field_ids) {
		if (!!itemValues[field_id]) itemFieldValues.push(itemValues[field_id])
		else itemFieldValues.push("")
	}
	return _.concat(itemMeta, itemFieldValues)
}
function getFieldValues(fields) {
	let fieldValues = {}
	for (let field of fields) {
		fieldValues[field.external_id] = ""
		switch (field.type) {
			case "app": {
				fieldValues[field.external_id] = _.map(field.values, "value.item_id").join(",")
				break
			}
			case "category": {
				if (!!field.config.multiple && field.config.multiple)
					fieldValues[field.external_id] = JSON.stringify(_.map(field.values, "value.text"))
				else fieldValues[field.external_id] = field.values[0].value.text
				break
			}
			case "date": {
				fieldValues[field.external_id] = field.values[0].start_utc
				if (
					!!field.config.settings.end &&
					field.config.settings.end !== "disabled"
				)
				fieldValues[field.external_id + '_end'] = field.values[0].end_utc
				break
			}
			case "email":
			case "phone": {
				fieldValues[field.external_id + '_types'] = _.map(field.values, "type").join(",")
				let formattedValues = _.map(field.values, entry => {
					return parseInt(entry.value.replace(/[^0-9\.]/g, ""), 10)
				})
				fieldValues[field.external_id] = formattedValues.join(",")
				break
			}
			default: {
				fieldValues[field.external_id] = field.values[0].value
			}
		}
	}
	return fieldValues
}
