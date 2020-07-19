import { base } from '@theme-ui/presets';
import toCustomProperties from '@theme-ui/custom-properties';

const theme = { ...base };
delete theme.styles;

const css = Object.entries(toCustomProperties(theme))
  .map(entries => entries.join(':'))
  .join(';\n');
console.log(css);
