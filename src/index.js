import * as FirebaseFunctions from "firebase-functions"
import * as Auth from "./auth"
import * as Macros from "./macros"

export var ExportPodioData = FirebaseFunctions.https.onRequest((req, res) => {
	Macros.ExportPodioData().then(success => res.send(success))
})
export var TriggerMacros = FirebaseFunctions.https.onRequest((req, res) => {
  if (process.env.NODE_ENV === "development") {
    req.body = {
      hook_id : -1,
      item_id : 670099179,
      item_revision_id : 1,
      code : 123
    }
	}
	// Are we verifying a Podio hook? If so, call the Podio hook verification
	// Otherwise, trigger macros. 
  Macros.TriggerMacros(req.body).then(success => res.sent(success))
})

export var authorize = FirebaseFunctions.https.onRequest((req, res) => {
	Auth.googleOauth().then(url => {
		if (!url) {
			return res.send("No bueno.")
		}
		return res.redirect(url)
	})
})
export var callback = FirebaseFunctions.https.onRequest((req, res) => {
	if (!req.query || !req.query.code) {
		return res.send("What cha doin there?")
	}
	Auth.googleOauthCallback(req.query.code).then(success => {
		res.send(success)
	})
})