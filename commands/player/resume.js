const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");


module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("resume");
	}
	async run(client, interation) {
		const connection = await getVoiceConnection(interation.guild.id);
		connection.state.subscription.player.unpause();
		interation.reply("resuming");
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("resume command")
			.toJSON();
	}
};
