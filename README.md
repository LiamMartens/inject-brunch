# Brunch Inject
Brunch inject is a small plugin for injecting file contents into JS files as strings and parse them if needed.

## Installation
Install using npm  
`npm install inject-brunch`

## Brunch config
Add plugin to brunch config  
```
module.exports.plugins = {
    inject: {
        // customize the inject function name
        fn: 'inject',
        parse: function(data, filename, extension) {
            // here you can customize the data parser
            // can be omitted
            return yourparser(data);
        }
    }
}
```

## Usage
Using the default config you will have something like this
```
// injected data will be wrapped in single quotes
const data = inject('file',);
```