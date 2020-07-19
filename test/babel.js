const babel = require('@babel/core');
const path = require('path');
const plugin = require('style9/babel');

const output = babel.transformFileSync(path.resolve(__dirname, './input.js'), {
  plugins: [
    '@babel/plugin-syntax-jsx',
    // ['module:style9-jsx-prop', {
    //   'importPath': 'style9-theme.macro'
    // }],
    ['macros', {
      style9Theme: {
        // breakpoints: ['38em', '59em', '60em', '80em']
      }
    }],
    // plugin
  ],
});
console.log(output.code)
console.log(output.metadata.style9)
