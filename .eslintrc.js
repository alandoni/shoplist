module.exports = {
    "extends": "airbnb",
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
        "react-native/react-native": true
    },
    "rules": {
        "array-bracket-spacing": [ "error", "always" ],
        "comma-dangle": "error",
        "computed-property-spacing": "off",
        "func-names": "error",
        "indent": [ "error", 4 ],
        "max-len": [ "error", 100, 4 ],
        "no-plusplus": "off",
        "no-use-before-define": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": "error",
        "prefer-template": "error",
        "react/jsx-curly-spacing": "off",
        "react/jsx-indent": [ "error", 4 ],
        'react/jsx-indent-props': [ "error", 4 ],
        "space-before-function-paren": "off",
        "space-in-parens": "off",
        "vars-on-top": "error",
        "react/prop-types": "off",
        'global-require': 'off',
    }
};