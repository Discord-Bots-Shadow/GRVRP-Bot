import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const commands = [];
const foldersPath = path.join(process.cwd(), "commands");
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(".js"));

// ✅ Load all commands dynamically
for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = (await import(`file://${filePath}`)).default;
  if (command?.data) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// ⚙️ Register commands to ONE SERVER (not global)
try {
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID; // <-- Make sure to set this in Render env vars or .env

  console.log(`🔄 Refreshing ${commands.length} commands for guild ${guildId}...`);

  const data = await rest.put(
    Routes.applicationGuildCommands(clientId, guildid),
    { body: commands },
  );

  console.log(`✅ Successfully reloaded ${data.length} guild commands!`);
} catch (error) {
  console.error("❌ Error while deploying commands:", error);
}
