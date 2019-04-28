module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb'
    ],
    rules: {
        'prefer-template': 0,
        'func-names': 0,
        'object-shorthand': 0,
        'arrow-body-style': 0,
        'space-in-parens': 0,
        'vue/no-unused-components': 0,
        'no-restricted-properties': 0,
        'operator-linebreak': 0,
        'object-curly-newline': 0,
        'semi': 0,
        'no-trailing-spaces': 0,
        'prefer-promise-reject-errors': 0,
        'arrow-parens': 'off',
        'no-nested-ternary': 'off',
        'consistent-return': 'off',
        'no-param-reassign': 'off',
        'no-unused-vars': 'off',
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'max-len': [2, 200, 4, { ignoreUrls: true }],
        'indent': 0,
        'comma-dangle': ['error', 'never'],
        'default-case': 'error',
        'quote-props': ['error', 'consistent-as-needed', {
            unnecessary: false
        }],
        'arrow-body-style': ['error', 'always'],
        'prefer-destructuring': ['error',
            { array: false, object: true },
            {
                enforceForRenamedProperties: false
            }],
        'arrow-body-style': ['error', 'as-needed'],
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: false, optionalDependencies: false, peerDependencies: false }
        ]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
