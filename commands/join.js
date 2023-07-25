const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
// const { TOKEN, CHANNEL_ID, GUILD_ID, APP_ID } = process.env;
const SlashCommand = require("../utils/SlashCommand");

function connect(interation) {
	const connection = joinVoiceChannel({
		channelId: interation.member.voice.channel.id,
		guildId: interation.guild.id,
		adapterCreator: interation.guild.voiceAdapterCreator,
	});
}

module.exports = class JoinCommand extends SlashCommand {
	constructor() {
		super("join");
	}
	run(client, interation) {
		try {
			connect(interation);
		} catch (err) {
			console.log(err);
		}
		return interation.reply({ content: "Joining to voice" });
	}
	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("join command")
			.toJSON();
	}
};
