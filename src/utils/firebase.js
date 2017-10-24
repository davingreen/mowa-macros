import * as FirebaseFunctions from "firebase-functions"
import * as FirebaseAdmin from "firebase-admin"

FirebaseAdmin.initializeApp(FirebaseFunctions.config().firebase)
const database = FirebaseAdmin.database()
const MACROS_CONFIG_PATH = "MACROS_CONFIG"
const GOOGLE_CLIENT_TOKEN_PATH = MACROS_CONFIG_PATH + "/GOOGLE_CLIENT/tokens"
const PODIO_FIELD_ORDER_PATH = "MACROS_CONFIG/PODIO_FIELD_ORDER_PATH"

export async function getMacrosConfig() {
    try {
        let data = await database.ref(MACROS_CONFIG_PATH).once("value")
        return data.val()
    }
    catch (e) {
        throw new Error('Error getting config from Firebase.')
    }
}
export async function setGoogleClientTokens(tokens) {
    try {
        return await database.ref(GOOGLE_CLIENT_TOKEN_PATH).set(tokens)
    }
    catch (e) {
        throw new Error('Error setting tokens to Firebase.')
    }
}
export async function getPodioFieldOrder() {
    try {
        let data = await database.ref(PODIO_FIELD_ORDER_PATH).once("value")
        return data.val()
    }
    catch (e) {
        throw new Error('Error getting field order from Firebase.')
    }
}
export async function setPodioFieldOrder(fieldOrder) {
    try {
        return await database.ref(PODIO_FIELD_ORDER_PATH).set(fieldOrder)
    }
    catch (e) {
        throw new Error('Error setting field order to Firebase.')
    }
}