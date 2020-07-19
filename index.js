const { createMacro } = require('babel-plugin-macros');
const t = require('@babel/types');
const { defaultBreakpoints, scales } = require('@theme-ui/css');
const { UNITLESS_NUMBERS } = require('style9/src/constants.js');
const pluralize = require('pluralize');
const NAME = require('./package.json').name;

const BASE_FONT_SIZE_PX = 16;

function normalizeValue(prop, value) {
  if (typeof value === 'number') {
    if (prop === 'fontSize') return `${value / BASE_FONT_SIZE_PX}rem`;
    if (!UNITLESS_NUMBERS.includes(prop)) return `${value}px`;
  }

  return value;
}

function generateCustomProperty(key, value) {
  if (!(key in scales)) return value;
  const scale = pluralize(scales[key], 1);
  const normalValue = normalizeValue(key, value);
  return `var(--${scale}-${value}, ${normalValue})`;
}

function getCustomPropertyNode(objProp) {
  return t.stringLiteral(
    generateCustomProperty(objProp.node.key.name, objProp.node.value.value)
  );
}

function transformValue(objProp, breakpoints) {
  const val = objProp.get('value');

  if (val.isArrayExpression()) {
    return val
      .get('elements')
      .map((val, index) => {
        const media = `@media (min-width: ${breakpoints[index]})`;

        if (val.isNullLiteral()) return;

        const newObjProp = t.objectProperty(
          t.stringLiteral(objProp.node.key.name),
          t.stringLiteral(
            generateCustomProperty(objProp.node.key.name, val.node.value)
          )
        );

        if (index === 0) return [newObjProp];

        return t.objectProperty(
          t.stringLiteral(media),
          t.objectExpression([newObjProp])
        );
      })
      .filter(Boolean);
  } else {
    val.replaceWith(getCustomPropertyNode(objProp));
    return [objProp.node];
  }
}

function transformStyles(objExpr, breakpoints) {
  for (const prop of objExpr.get('properties')) {
    if (prop.get('value').isObjectExpression()) {
      transformStyles(prop.get('value'), breakpoints);
    } else {
      const values = transformValue(prop, breakpoints);
      for (const value of values) {
        if (t.isObjectExpression(value.value)) {
          const existing = objExpr
            .get('properties')
            .find(prop => prop.node.key.value === value.key.value);
          if (existing) {
            existing
              .get('value')
              .pushContainer('properties', value.value.properties[0]);
          } else {
            prop.insertBefore(value);
          }
        } else {
          prop.insertBefore(value);
        }
      }
      prop.remove();
    }
  }
}

function transformRef(callExpr, breakpoints) {
  for (const arg of callExpr.get('arguments')) {
    transformStyles(arg, breakpoints);
  }
}

function replaceImport(program) {
  for (const node of program.get('body')) {
    if (!node.isImportDeclaration()) continue;
    if (node.get('source.value').node !== NAME) continue;
    node.get('source').replaceWith(t.stringLiteral('style9'));
  }
}

function style9Theme({
  references,
  state,
  config: { breakpoints = defaultBreakpoints } = {}
}) {
  replaceImport(state.file.path);
  if (!references.default) return;

  for (const ref of references.default) {
    if (ref.parentPath.isMemberExpression()) {
      const callExpression = ref.parentPath.parentPath;
      transformRef(callExpression, breakpoints);
    }
  }

  return { keepImports: true };
}

module.exports = createMacro(style9Theme, { configName: 'style9Theme' });
