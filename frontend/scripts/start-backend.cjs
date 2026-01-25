const { spawn } = require("child_process");

const candidates = process.platform === "win32"
  ? ["py", "python", "python3"]
  : ["python3", "python"];

function trySpawn(cmdIndex = 0) {
  const cmd = candidates[cmdIndex];
  if (!cmd) {
    console.error("Could not find a working Python command. Tried:", candidates.join(", "));
    process.exit(1);
  }

  const child = spawn(cmd, ["../backend/server.py"], {
    stdio: "inherit",
    shell: false,
  });

  child.on("error", (err) => {
    if (err.code === "ENOENT") {
      return trySpawn(cmdIndex + 1);
    }
    console.error(err);
    process.exit(1);
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

trySpawn();
