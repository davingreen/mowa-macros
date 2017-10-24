export function getClientInfo() {
	return new Promise((resolve, reject) => {
		resolve({
			id:
				"293299973327-v9ejmophi9to1lnp3h8utqkrtpu392rm.apps.googleusercontent.com",
			secret: "jytFBny8TaweR9409SfifiOA",
			redirect:
				"http://localhost:5000/mowa-cloud-services-staging/us-central1/callback",
			scope: "https://www.googleapis.com/auth/spreadsheets",
			tokens: {
				access_token:
					"ya29.GlvqBMre0-VohjXT5FEcV--FpV0dPf42skxCR4HNPNVi5gtcKPaaTofo5AydLqRAGPqCai1K5JROjNpq5E9krFmOBqlnvnbldQpRrDpTAkQG71taNlukbkDr-VDz",
				refresh_token: "1/GPefrQ9xJzEHjcKG4P1MZqzRLfrsCE5i8al0WPlPe4M",
				token_type: "Bearer",
				expiry_date: 1506977349031
			}
		})
	})
}
export function setClientTokens(tokens) {
	return new Promise((resolve, reject) => {
		console.log(tokens)
		resolve()
	})
}
export function getSheetId() {
	return new Promise((resolve, reject) => {
		resolve("1XbL116GibEktpMdNZBH963G6Pl0Fhln61UiTto7bEhg")
	})
}
