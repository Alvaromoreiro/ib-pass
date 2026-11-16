function trbl (prefix) {
    const rules = [];

    if (prefix) {
        rules.push(prefix);
        prefix = prefix + '-';
    } else {
        prefix = '';
    }

    return rules.concat([
        prefix + 'top',
        prefix + 'right',
        prefix + 'bottom',
        prefix + 'left'
    ]);
}

function minMax (suffix) {
    return [suffix, 'min-' + suffix, 'max-' + suffix];
}

function border (infix) {
    if (infix) {
        infix = '-' + infix;
    } else {
        infix = '';
    }

    return [
        'border' + infix,
        'border' + infix + '-width',
        'border' + infix + '-style',
        'border' + infix + '-color',
        'border' + infix + '-radius'
    ];
}



module.exports = {
    position: ['content', 'position', 'z-index']
        .concat(trbl()),
    display: ['display', 'overflow']
        .concat(minMax('width'))
        .concat(minMax('height'))
        .concat([
            'box-sizing',
            'flex',
            'flex-basis',
            'flex-direction',
            'flex-flow',
            'flex-grow',
            'flex-shrink',
            'flex-wrap',
            'align-content',
            'align-items',
            'align-self',
            'justify-content',
            'order'
        ])
        .concat(trbl('padding'))
        .concat(trbl('margin'))
        .concat([]
            .concat(border())
            .concat(border('top'))
            .concat(border('right'))
            .concat(border('bottom'))
            .concat(border('left'))
        ),
    text: [
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'font-variant',
        'font-stretch',
        'text-justify',
        'text-overflow',
        'text-shadow',
        'text-align',
        'text-decoration',
        'text-decoration-color',
        'text-decoration-line',
        'text-decoration-style',
        'text-indent',
        'line-height'
    ],
    colors: [
        'color',
        'background-color'
    ]
};
