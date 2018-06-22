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
      table.push({
        [(''+route.stack[0].method).toUpperCase().green]: route.path.bold.blue,
      });
    }
  });

  return table.toString();
};
