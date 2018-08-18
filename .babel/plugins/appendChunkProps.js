module.exports = ({ types: t, template }) => {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        let source = path.node.source.value;


        // NOTE - custom lines
        const loadableComponent = state.opts.components || 'react-loadable';
        if(Array.isArray(loadableComponent)){
          let found = false;
          for(let i=0; i<loadableComponent.length; i++){
            if(source.includes(loadableComponent[i])){
              found = true;
              break;
            }
          }
          if(!found) return;
        }
        else{
          if(!source.includes(loadableComponent)) return;
        }


        let defaultSpecifier = path.get('specifiers').find(specifier => {
          return specifier.isImportDefaultSpecifier();
        });

        if(!defaultSpecifier) return;

        let bindingName = defaultSpecifier.node.local.name;
        let binding = path.scope.getBinding(bindingName);

        binding.referencePaths.forEach(refPath => {
          let callExpression = refPath.parentPath;

          if(
            callExpression.isMemberExpression() &&
            callExpression.node.computed === false &&
            callExpression.get('property').isIdentifier({ name: 'Map' })
          ) {
            callExpression = callExpression.parentPath;
          }

          if(!callExpression.isCallExpression()) return;

          let args = callExpression.get('arguments');
          if(args.length !== 1) throw callExpression.error;

          let options = args[0];
          if(!options.isObjectExpression()) return;

          let properties = options.get('properties');
          let propertiesMap = {};

          properties.forEach(property => {
            let key = property.get('key');
            propertiesMap[key.node.name] = property;
          });

          if(propertiesMap.webpack) {
            return;
          }


          // NOTE - custom
          const loaderProp = propertiesMap[state.opts.loaderProp] || propertiesMap.loader;


          let loaderMethod = loaderProp.get('value');
          let dynamicImports = [];

          loaderMethod.traverse({
            Import(path) {
              dynamicImports.push(path.parentPath);
            },
          });

          if(!dynamicImports.length) return;

          loaderProp.insertAfter(
            t.objectProperty(
              t.identifier('webpack'),
              t.arrowFunctionExpression(
                [],
                t.arrayExpression(
                  dynamicImports.map(dynamicImport => {
                    return t.callExpression(
                      t.memberExpression(
                        t.identifier('require'),
                        t.identifier('resolveWeak'),
                      ),
                      [dynamicImport.get('arguments')[0].node],
                    );
                  })
                )
              )
            )
          );

          loaderProp.insertAfter(
            t.objectProperty(
              t.identifier('modules'),
              t.arrayExpression(
                dynamicImports.map(dynamicImport => {
                  return dynamicImport.get('arguments')[0].node;
                })
              )
            )
          );
        });
      },
    },
  };
};
