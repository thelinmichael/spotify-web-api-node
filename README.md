## Generating the documentation

Run these commands for generating the documentation

	npm i spotify-web-api-node

	dox-foundation --template template/template.jade < node_modules/spotify-web-api-node/src/spotify-web-api.js > index.html

Then, commit the resulting `index.html` file.
