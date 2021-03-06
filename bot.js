const Discord = require("discord.js");
const b5 = require("./lib.js");
const auth = require("./auth.json");

const bot = new Discord.Client();

bot.on("ready", (e) => {
  console.log("connected");
});

//reply map;
const r = {
  hi: "hello",
  hello: "hi",
  bye: "see ya",
  "what's up": "The sky",
  "ben yuter": "sucks",
};

bot.on("message", async (msg) => {
  if (msg.author.bot) return;

  const message = msg.content;

  if (message.substr(0, 3) === "._.") {
    let input = message.substring(3);
    let args = input.split(" ");
    const cmd = args[0].toLowerCase();
    args.splice(0, 1);

    //if the message is a key in the array;
    if (input in r) {
      msg.channel.send(r[message]);
    } else {
      let users;
      let userNames;

      switch (cmd) {
        case "ping":
          msg.channel.send("pong");
          break;
        case "hi":
          msg.channel.send("hello");
          break;
        case "info":
          users = getVoiceCallUsers(msg);
          userNames = users.map((user) => user.username);
          msg.channel.send(
            `You are currently in a call with ${userNames.join(", ")}`
          );
          break;
        case "flip":
          msg.channel.send(Math.random() < 0.5 ? "Heads" : "Tails");
          break;
        case "disable-tanks":
          msg.channel.send("Tanks Disabled");
          break;
        case "say":
          msg.channel.bulkDelete(1);
          msg.channel.send(args.join(" "));
          break;
        case "creator":
          msg.channel.send("Benjamin M. Lubas");
          break;
        case "fuck-jake":
          let fJake = "";
          let num = parseInt(args[0]) || 1;
          for (let i = 0; i < num; i++) {
            fJake += "Fuck Jake \n";
          }
          msg.channel.send(fJake);
          break;
        case "wheel":
          //Let the wheel decide. Just list the options separated by spaces.
          if (args.length === 0)
            msg.channel.send("There is a noticable lack of options...");
          else msg.channel.send(args[b5.random(0, args.length - 1)]);
          break;
        case "fetus":
          //purge command. Delete's specified number of messages.
          let num2Purge = parseInt(args[0]) || 1;
          num2Purge = num2Purge > 100 ? 100 : num2Purge < 1 ? 1 : num2Purge;
          if (args[1] === "skip" && parseInt(args[2])) {
            let skip = parseInt(args[2]);
            let breakPoint = Array.from(
              await msg.channel.fetchMessages({
                limit: skip + 1,
              })
            );
            breakPoint = breakPoint[breakPoint.length - 1][0];
            let toDel = Array.from(
              await msg.channel.fetchMessages({
                limit: num2Purge,
                before: breakPoint,
              })
            );
            msg.channel.bulkDelete(toDel.map((c) => c[0]));
            msg.channel.bulkDelete(1);
          } else {
            msg.channel.bulkDelete(num2Purge + 1);
          }
          break;
        case "teams":
          userNames = getVoiceCallUsers(msg).map((u) => u.username);
          let numTeams = parseInt(args[0]) || 2;
          let teams = Array(numTeams).map((a) => []);

          userNames = b5.shuffle(userNames);
          let i = 0;
          while (i < userNames.length) {
            Array.isArray(teams[i % numTeams])
              ? teams[i % numTeams].push(userNames[i])
              : (teams[i % numTeams] = [userNames[i]]);
            i++;
          }
          let output = "";
          teams.forEach((team, index) => {
            output += `Team ${index + 1}: \n`;
            team.forEach((member, mIndex) => {
              output += `\t${mIndex + 1}) ${member}\n`;
            });
            output += "--------------------------\n";
          });
          msg.channel.send(
            `The teams are as follows: \n\n\`\`\`${output}\`\`\``
          );
          break;
        case "help":
          output = "";
          output += "Commands are all prefixed by ._.\n";
          output += "```flip - flip a coin\n";
          output +=
            "teams <Number> - assigns people in your call to <Number> teams\n";
          output +=
            "fetus <Number> skip? <SkipNumber?> - Mass deletes messages. Optional skip flag and skip number.";
          output +=
            "wheel <Params> - List the items that should be on the wheel separated by spaces. A random one will be returned";
          output +=
            "fuck-jake <Number?> - The bot says 'fuck jake' as many times as you want it to";
          output += "say <String> - Will say whatever you want it to say";
          output += "info - Tells you who you're in a call with";
          output += "ping - Replies pong";
          output += "```";
          msg.channel.send(output);
          break;
        default:
          msg.channel.send("Try ._.help for help");
      }
    }
  }
});

bot.login(auth.token);

function getVoiceCallUsers(message) {
  return message.member.voiceChannel.members
    .map((m) => m.user)
    .filter((u) => !u.bot);
}
