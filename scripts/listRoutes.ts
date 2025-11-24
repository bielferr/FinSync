import app from '../src/app';

function listAllRoutes() {
  console.log('TODAS AS ROTAS REGISTRADAS:');
  console.log('================================');

  function printRoutes(path: string, layer: any) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map(method => method.toUpperCase()).join(', ');
      console.log(`   ${methods.padEnd(10)} ${path}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach((handler: any) => {
        printRoutes(path + layer.regexp.toString().replace(/^\/\^\\\//, '').replace(/\\\/\?\(\?=\\\/\|\$\)\/\$$/, ''), handler);
      });
    }
  }

  app._router.stack.forEach((layer: any) => {
    printRoutes('', layer);
  });
}

listAllRoutes();