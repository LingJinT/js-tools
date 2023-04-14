// export default function curry(fn, args: any[] = []) {
//   if(fn.length === args.length) {
//     return fn.apply(args)
//   }
//   return function(...args2: any[]) {
//     return curry.apply(this, args.concat(args2))
//   }
// }