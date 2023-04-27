const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("pause");
	}
	async run(client, interation) {
		const connection = await getVoiceConnection(interation.guild.id);
		connection.state.subscription.player.pause();
		interation.reply("Paused");
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("pause command")
			.toJSON();
	}
};
