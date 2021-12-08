require('tree-cli')({
  base: '../', // or any path you want to inspect.
  ignore: 'node_modules/,.git/,.history/,dist/,.umi/,mock/,.vscode/',
  noreport: true,
  o: 'tree.md',
  a: true,
  l: 4,
}).then(res => {
  console.log(res.data, res.report);
});
