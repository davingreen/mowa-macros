import * as Firebase from "./utils/firebase"
import * as Google from "./utils/google"

export async function googleOauth() {
	try {
		let config = await Firebase.getMacrosConfig()
		if (
			!!config.GOOGLE_CLIENT.tokens &&
			!!config.GOOGLE_CLIENT.tokens.access_token
		) {
			console.error(
				"Macros are already authorized. Clear database tokens to reauthorize."
			)
			return false
		}
		let authUrl = Google.getAuthUrl(
			config.GOOGLE_CLIENT.id,
			config.GOOGLE_CLIENT.secret,
			config.GOOGLE_CLIENT.redirect,
			config.GOOGLE_CLIENT.scope
		)
		return authUrl
	} catch (e) {
		console.error(e)
		return false
	}
}
export async function googleOauthCallback(code) {
	try {
		let config = await Firebase.getMacrosConfig()
		let tokens = await Google.getToken(
			config.GOOGLE_CLIENT.id,
			config.GOOGLE_CLIENT.secret,
			config.GOOGLE_CLIENT.redirect,
			code
		)
		return await Firebase.setGoogleClientTokens(tokens)
	} catch (e) {
		console.error(e)
		return false
	}
}