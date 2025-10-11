import { REST, Routes } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const guildId = '1400067556609364038';
const clientId = process.env.CLIENT_ID;

(async () => {
  try {
    console.log(`🔄 Deploying commands for guild ${guildId}...`);
    
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('✅ Successfully deployed guild commands!');
  } catch (err) {
    console.error('❌ Error deploying commands:', err);
  }
})();
