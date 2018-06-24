import Table from 'cli-table2';
import 'colors';

export default (expressInst) => {
  const table = new Table({
    head: ['Method'.white, 'Path'.white],
    style: {
      'padding-top': 0,
      'padding-bottom': 0,
    },
  });

  expressInst._router.stack.forEach(function (middleware) {
    const { route } = middleware;

    if(route) {
      const method = (''+route.stack[0].method).toUpperCase();
      let methodColor;

      switch(method){
        case 'GET': methodColor = 'green'; break;
        case 'POST': methodColor = 'magenta'; break;
        default: methodColor = 'gray';
      }

      table.push({
        [method[methodColor].bold]: route.path.bold.blue,
      });
    }
  });

  return table.toString();
};
