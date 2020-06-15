const fs = require("fs");
const { Server } = require("./utils/server");
const injectorSettings = JSON.parse(fs.readFileSync(__dirname + "/data/injectorsettings.json"));

let server = new Server();
server.Run().then(async () => {
    let args = process.argv.slice(2) || null;
    if (args.length > 0) {
        let keepAlive = args[args.length - 1] == "keep-alive";
        if (keepAlive)
            args.splice(-1, 1);
        switch (args[0]) {
            case "inject":
                args.splice(0, 1);
                if (args[0] == "default")
                    args = injectorSettings.default.args.join(" ").split(" ");
                for (let i = 0; i < args.length; i += 3)
                    await server.Inject(args[i], args[i + 1], args[i + 2]);
                break;
        }
        if (!keepAlive)
            process.exit(0);
    }
}).catch(console.log);