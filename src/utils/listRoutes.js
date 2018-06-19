export default (expressInst) => {
  let routes = [];

  expressInst._router.stack.forEach(function (middleware) {
    if(middleware.route) {
      routes.push(`${ Object.keys(middleware.route.methods) } -> ${ middleware.route.path }`);
    }
  });

  console.log(JSON.stringify(routes, null, 2));
};
