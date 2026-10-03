document.modelContext.ontoolchange = e => console.log('Parent toolchange');
iframe.contentDocument.modelContext.ontoolchange = e => console.log('Child toolchange');

// Queues a task to fire `toolchange`, on the `webmcp task source`.
const p = document.modelContext.registerTool({
  name: "tool_name",
  description: "tool_desc",
  execute: async () => {}
});

p.then(() => console.log('Register promise resolved'));

// Queues a task on the `timer task source`.
setTimeout(() => console.log('Post-register task'));

// `Parent toolchange` will always log before `Child toolchange`, and
// `Register promise resolved` will always log after both.
// But `Post-register task` can log before, in between, or after all three.

const oldInputSchema = {...};
const newInputSchema = {...};
const ac = new AbortController();
document.modelContext.registerTool({..., inputSchema: oldInputSchema}, {signal: ac.signal});

// Unregister, and quickly re-register with an updated input schema.
ac.abort();
document.modelContext.registerTool({..., inputSchema: newInputSchema});


// -- Executing document. --
//
// This could target either the "old" tool, or the "new" one above,
// and the execution might encounter any requisite errors due to the mismatch.
const [tool] = await document.modelContext.getTools();
document.modelContext.executeTool(tool, {a: 10});

// global scope
const e = 10;
function sum(a) {
  return function sum2(b) {
    return function sum3(c) {
      // outer functions scope
      return function sum4(d) {
        // local scope
        return a + b + c + d + e;
      };
    };
  };
}

const sum2 = sum(1);
const sum3 = sum2(2);
const sum4 = sum3(3);
const result = sum4(4);
console.log(result); // 20

function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function () {
  return this.name;
};
MyObject.prototype.getMessage = function () {
  return this.message;
};
