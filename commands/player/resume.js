const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class ResumeCommand extends SlashCommand {
	constructor() {
		super("resume");
	}
	async run(client, interation) {
		await interation.deferReply();
		try {
			client.audioPlayer.resumeSong();
			interation.editReply("Resuming");
		} catch (error) {
			console.log("error while trying to resume song:", error.message);
			interation.editReply({
				content: "error while trying to resume song",
				ephemeral: true,
			});
		}
		setTimeout(() => {
			interation.deleteReply();
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("resume command")
			.toJSON();
	}
};
