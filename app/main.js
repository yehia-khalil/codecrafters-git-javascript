const fs = require("fs");
const path = require("path");
const zlib = require("zlib")

// Uncomment this block to pass the first stage
const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    getCatFile();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function getCatFile() {
  const type = process.argv[3];
  switch (type) {
    case "-p":
      let filePath = process.argv[4];
      let dir = filePath.substring(0, 2);
      let file = filePath.substring(2);
      const contents = fs.readFileSync(path.join(__dirname, '.git/objects', dir, file));
      const decompress = zlib.inflateSync(contents);
      const content = decompress.toString('utf-8').split('\0')[1];
      process.stdout.write(content);
      break;
    default:
      throw new Error(`Unknown command ${command}`);
  }
}

function createGitDirectory() {
  fs.mkdirSync(path.join(__dirname, ".git"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(__dirname, ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}
