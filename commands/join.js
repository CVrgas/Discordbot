const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { TOKEN, CHANNEL_ID, GUILD_ID, APP_ID } = process.env;
const SlashCommand = require("../utils/SlashCommand");

module.exports = class JoinCommand extends SlashCommand {
	constructor() {
		super("join");
	}
	run(client, interation) {
		try {
			const connection = joinVoiceChannel({
				channelId: interation.options.get("channel").value,
				guildId: interation.guild.id,
				adapterCreator: interation.guild.voiceAdapterCreator,
			});
		} catch (err) {
			console.log(err);
		}
		return interation.reply({ content: "Joining to voice" });
	}
	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("join command")
			.addChannelOption((option) =>
				option
					.setName("channel")
					.setDescription("channel to join")
					.setRequired(true)
					.addChannelTypes(ChannelType.GuildVoice)
			)
			.toJSON();
	}
};
