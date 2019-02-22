module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-native"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "react-native/react-native": true,
        "jest": true
    },
    "rules": {
        "array-bracket-spacing": [ "error", "always" ],
        "comma-dangle": "error",
        "computed-property-spacing": "off",
        "func-names": "error",
        "indent": [ "error", 2 ],
        "max-len": [ "error", 120, 2 ],
        "no-plusplus": "off",
        "no-use-before-define": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": "error",
        "prefer-template": "error",
        "react/jsx-curly-spacing": "off",
        "react/jsx-indent": [ "error", 2 ],
        'react/jsx-indent-props': [ "error", 2 ],
        "react/jsx-filename-extension": "off",
        "react/destructuring-assignment": "off",
        "space-before-function-paren": "off",
        "react/jsx-one-expression-per-line": "off",
        "space-in-parens": "off",
        "vars-on-top": "error",
        "react/prop-types": "off",
        'global-require': 'off',
        "no-underscore-dangle": "off",
        "no-extend-native": "off",
        "prefer-destructuring": "warn",
    }
};