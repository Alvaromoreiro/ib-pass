module.exports = {
    extends: ["@commitlint/config-conventional"],
    parserPreset: {
      parserOpts: {
        headerPattern: /^(main|develop|features|staging)|(feat|fix)\/(([A-Z0-9]{1,10})-?)[A-Z0-9]+-\d+.*|dependabot\/.*$/,
        //headerPattern: /^(main|develop|features|staging)|(feat|fix)\/\D\D\D-\d\d\d/,
        headerCorrespondence: ['type', 'scope', 'subject'],
      },
    },
    rules: {
        'type-empty': [0],
        'subject-empty': [0],
        'type-enum': [0],
      },
}