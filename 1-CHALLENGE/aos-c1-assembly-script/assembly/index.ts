import "wasi";
// The entry file of your WebAssembly module.
// import { JSONEncoder } from "assemblyscript-json";

// import { Console } from "as-wasi/assembly";
import { JSON } from "json-as/assembly";

// @ts-ignore
@json
class Response {
  message!: string;
}

// export function add(a: i32, b: i32): i32 {
//   return a + b;
// }

export function hello(): string {
  const resp: Response = { message: "Hello World!" };

  let json: string = JSON.stringify<Response>(resp);

  console.log(json);
  return json;
}

const resp2: Response = { message: "Hello World!" };
let json2: string = JSON.stringify<Response>(resp2);
console.log(json2);
