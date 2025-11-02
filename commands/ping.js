import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency and API response time.'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Pong!', fetchReply: true });
    
    // Calculate latencies
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    // Determine colors
    const latencyColor = latency > 250 ? '🔴' : '🟢';
    const apiColor = apiLatency > 250 ? '🔴' : '🟢';

    // Create embed
    const embed = new EmbedBuilder()
      .setColor(latency > 250 || apiLatency > 250 ? 0xFF0000 : 0x00FF00)
      .setTitle('🏓 Pong!')
      .setDescription(
        `${latencyColor} **Latency:** ${latency} ms\n\n${apiColor} **API Latency:** ${apiLatency} ms`
      )
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
