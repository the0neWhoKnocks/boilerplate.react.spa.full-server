const syntax = require('babel-plugin-syntax-dynamic-import');

module.exports = ({ types: t }) => ({
  inherits: syntax,
  visitor: {
    ImportDeclaration(path, state) {
      const source = path.node.source.value;

      // NOTE - these are the only two lines that needed changing from the
      // loadable-components/babel plugin, along with the addition of `state` to
      // the above arguments.
      const loadableComponent = state.opts.component || 'loadable-components';
      if( !source.includes(loadableComponent) ) return;

      const defaultSpecifier = path
        .get('specifiers')
        .find(specifier => specifier.isImportDefaultSpecifier());

      if(!defaultSpecifier) return;

      const bindingName = defaultSpecifier.node.local.name;
      const binding = path.scope.getBinding(bindingName);

      binding.referencePaths.forEach(refPath => {
        let callExpression = refPath.parentPath;

        if(
          callExpression.isMemberExpression()
          && callExpression.node.computed === false
          && callExpression.get('property').isIdentifier({ name: 'Map' })
        ) {
          callExpression = callExpression.parentPath;
        }

        if(!callExpression.isCallExpression()) return;

        const args = callExpression.get('arguments');
        const loaderMethod = args[0];

        if(!loaderMethod) return;

        const dynamicImports = [];

        loaderMethod.traverse({
          Import({ parentPath }) {
            dynamicImports.push(parentPath);
          },
        });

        if(!dynamicImports.length) return;

        let options = args[1];

        if(args[1]) {
          options = options.node;
        }
        else{
          options = t.objectExpression([]);
          callExpression.node.arguments.push(options);
        }

        options.properties.push(
          t.objectProperty(
            t.identifier('modules'),
            t.arrayExpression(
              dynamicImports.map(
                dynamicImport => dynamicImport.get('arguments')[0].node,
              ),
            ),
          ),
        );
      });
    },
  },
});
