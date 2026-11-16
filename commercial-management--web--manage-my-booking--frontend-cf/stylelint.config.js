 'use strict';
const path = require('path');
const strictMode = true;
const order = require('./config/stylelint/stylelintorder');


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
        'selector-type-no-unknown': null,
        'scss/at-import-partial-extension': null,
        'scss/at-import-no-partial-leading-underscore': null,
        'no-invalid-position-at-import-rule': null,
        'scss/operator-no-unspaced': null,
        // 'at-extend-no-missing-placeholder': null,
        'keyframes-name-pattern': null,
        'selector-id-pattern': '',
        'import-notation': 'string',
        'number-max-precision': 5,
        'unit-allowed-list': [
            ['rem', 'px', 'em', '%', 'vh', 'vw', 'vmin', 'vmax', 'deg','fr'],
            {
                ignoreProperties: {
                    deg: ['/transform/'],
                    s: ['/animation/', '/transition/'],
                    ms: ['/transition/', '/animation/']
                }
            }
        ],
        'scale-unlimited/declaration-strict-value': [
            ['/color/', '/border/', '/margin/', '/padding/', 'font-size', '/width/', '/^(?!line).*height/', '/box-shadow/', 'top', 'left'],
            {
                ignoreVariables: true,
                ignoreFunctions: {
                    'font-family': false
                },
                ignoreValues: [0, '100%', 'inherit', 'auto', 'transparent', 'none', 'solid', 'dashed', 'dotted', 'initial', 'exact', 'medium', 'normal',
                    '/vh/', '/vw/', '/%/', '/max-content/', '/min-content/', '/color-adjust/', '/rem/', '/em/', 'unset', 'inset', '-webkit-fit-content',
                    '-moz-fit-content', 'fit-content', 'collapse', '-webkit-fill-available', '/color()/'],
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
