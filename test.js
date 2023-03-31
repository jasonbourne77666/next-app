function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function task(id) {
  return async (next) => {
    console.log(id, ' begin');
    await wait(1000);
    await next();
    console.log(id, ' end');
  };
}

const list = [task(0), task(1), task(2), task(3)];

async function run() {
  await list[0](async () => {
    await list[1](async () => {
      await list[2](async () => {
        await list[3](() => Promise.resolve());
      });
    });
  });
}
run();
