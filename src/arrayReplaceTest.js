let a = ['1', '.', '2', '.'];

a = a.map( (value, index) => { console.log('index: ' + index + ', value:' + value); return value === '.' ? '' : value});

console.log(a);