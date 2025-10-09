import { REST, Routes } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

try {
  console.log(`🔄 Refreshing ${commands.length} commands for guild ${guildId}...`);
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );
  console.log("✅ Successfully deployed guild commands!");
} catch (error) {
  console.error("❌ Error while deploying commands:", error);
}
