# style9-theme.macro

**Experimental**

System UI Theme for style9

Does not support modes, variants, or styles.

## Usage

```javascript
// From
import style9 from 'style9-theme.macro';

const styles = style9.create({
  styles: {
    fontSize: [2, 4],
    backgroundColor: 'red',
    '::before': {
      paddingTop: 2
    }
  }
});

// To
import style9 from 'style9';

const styles = style9.create({
  styles: {
    fontSize: 'var(--fontSizes-4, 4px)',
    '@media (min-width: 40em)': {
      fontSize: 'var(--fontSizes-2, 2px)',
    },
    backgroundColor: 'var(--colors-red, red)',
    '::before': {
      paddingTop: 'var(--spaces-2, 2px)'
    }
  }
});
```

## Providing theme

Pass breakpoints to the babel plugin and add the theme to the page as
custom properties.

### Babel

```javascript
// babel config
{
  plugins: [
    ['macros', {
      style9Theme: {
        // If you don't configure breakpoints Theme UI defaults will be used
        breakpoints: require('./theme.js').breakpoints
      }
    }],
  ]
}
```

### Custom Properties

```javascript
import toCustomProperties from '@theme-ui/custom-properties';
const css = Object.entries(toCustomProperties(theme))
  .map(entries => entries.join(':'))
  .join(';\n');
// This injects the theme into the head. You probably want to add it to your CSS file instead.
document.head.insertAdjacentHTML('beforeend', `<style>:root {${css}}</style>`);
```


## As prop

In combination with [style9-jsx-prop](https://github.com/johanholmerin/style9-jsx-prop)

```javascript
<div css={{
  fontWeight: 'bold',
  fontSize: 4,
  color: 'primary'
}} />
```

```javascript
// babel config
{
  plugins: [
    ['module:style9-jsx-prop', {
      'importPath': 'style9-theme.macro'
    }],
    'macros'
  ]
}
```

## Install

```sh
yarn add -D git+https://github.com/johanholmerin/style9-theme.macro#semver:^0.1.0
```
