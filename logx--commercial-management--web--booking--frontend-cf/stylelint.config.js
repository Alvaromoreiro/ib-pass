'use strict';
const path = require('path');
const strictMode = true;
const order = require('./config/stylelint/stylelintorder.js');

module.exports = {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss'],
    cache: true,
    cacheLocation: path.resolve(__dirname, 'cache'),
    defaultSeverity: strictMode ? 'error' : 'warning',
    plugins: [
        'stylelint-declaration-strict-value',
        'stylelint-scss',
        'stylelint-order'
    ],
    rules: {
        'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['/ng-deep/'] }],
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
        'no-descending-specificity': null,
        'max-empty-lines': null,
        'selector-class-pattern': null,
        'scss/at-import-partial-extension': null,
        'scss/at-import-no-partial-leading-underscore': null,
        'import-notation': 'string',
        'unit-allowed-list': [
            ['rem', 'px', 'em', '%', 'vh', 'dvh', 'vw', 'dvi', 'vmin', 'vmax','deg','fr', 'dvw'],
            {
                ignoreProperties: {
                    deg: ['/transform/'],
                    s: ['/animation/', '/transition/'],
                    ms: ['/transition/', '/animation/']
                }
            }
        ],
        'scale-unlimited/declaration-strict-value': [
            ['/color/', '/border/', '/box-shadow/', '/border-top/', '/border-right/', '/border-bottom/', '/border-left/', '/margin/', '/margin-top/', '/margin-right/', '/margin-bottom/', '/margin-left/', '/padding/', '/padding-top/', '/padding-right/', '/padding-bottom/', '/padding-left/', 'font-family', 'font-size', '/width/', '/^(?!line).*height/', '/top/', '/right/', '/bottom/', '/left/'],
            {
                ignoreVariables: true,
                ignoreFunctions: {
                    'font-family': false,
                    'box-shadow': true,
                },
                ignoreValues: [0, '100%', 'inherit', 'inset', 'auto', 'transparent', 'none', 'solid', 'dashed', 'dotted', 'initial', 'exact', '/vh/', '/vw/', '/%/', '/max-content/', '/min-content/', '/fit-content/', '/color-adjust/', '/rem/', '/em/', '/unset/', '/color/', '/collapse/', '/medium/'],
                disableFix: true
            }
        ],
        'order/order': [
            'custom-properties',
            'dollar-variables',
            'at-variables',
            //'at-rules',
            'declarations',
            'rules'
        ],
        'order/properties-order': [
            [{
                groupName: 'position',
                noEmptyLineBetween: true,
                properties: order.position
            },
            {
                groupName: 'display',
                noEmptyLineBetween: false,
                properties: order.display
            },
            {
                groupName: 'text',
                noEmptyLineBetween: true,
                properties: order.text
            },
            {
                groupName: 'colors',
                noEmptyLineBetween: true,
                properties: order.colors
            }],
            {
                unspecified: 'bottomAlphabetical'
            }
        ]
    },
    ignoreFiles: ['**/*.js', '**/*.ts', '**/*.json', '**/*.ejs', 'node_modules',
        'config', 'test', 'bin', 'build', 'version.txt', 'README.md', '.gitignore', '.eslintrc', '.eslintignore', '.npmrc']
};
