module.exports = {
    '{src,test}/**/*.ts': (filenames) => filenames.length > 10 ? 'eslint . --rule no-console:[error] --fix' : `eslint ${filenames.join(' ')} --rule no-console:[error] --fix`,
    '*.component.html': [
        'eslint --fix'
    ],
    '*.scss': 'stylelint --config stylelint.config.js --allow-empty-input --fix'
}