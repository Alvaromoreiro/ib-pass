module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "$": "readonly",
        "Cookies":"readonly",
        "dFrontJs": "readonly",
        "datalayer_general": "readonly",
        "datalayer_ecommerce": "readonly",
		"dataLayer": "readonly",
        "localeg": "readonly",
        "marketg": "readonly",
        "quadrigam": "readonly",
        "globalAppToken": "readonly",
        "tokenURL": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "no-plusplus": "off",
		"indent": [
			"error", 4, {
				"SwitchCase": 2
			}
		],
    }
};
