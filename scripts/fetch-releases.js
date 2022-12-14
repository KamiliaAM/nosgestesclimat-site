// This script uses the GitHub API which requires an access token.
// https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
// Once you have your access token you can put it in a `.env` file at the root
// of the project to enable it during development. For instance:
//
// GITHUB_API_SECRET=f4336c82cb1e494752d06e610614eab12b65f1d1
//
// If you want to fetch unpublished "draft" release, you should check the
// "public repo" authorization when generating the access token.
require('dotenv').config()
require('isomorphic-fetch')
var { createDataDir, writeInDataDir } = require('./utils.js')

const repository = 'nosgestesclimat',
	organization = 'datagir'

async function main() {
	createDataDir()
	const releases = await fetchReleases()
	// The last release name is fetched on all pages (to display the banner)
	// whereas the full release data is used only in the dedicated page, that why
	// we deduplicate the releases data in two separated files that can be
	// bundled/fetched separately.
	writeInDataDir('releases.json', releases)
	const last = releases[0]
	writeInDataDir(
		'last-release.json',
		last
			? {
					name: last.name,
					date: last.published_at,
			  }
			: {}
	)
}

async function fetchReleases() {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${organization}/${repository}/releases`
		)
		const data = await response.json()
		return data.filter(Boolean)
	} catch (e) {
		console.log(e)
		return []
	}
}

main()
