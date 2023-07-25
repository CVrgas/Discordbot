const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("Ask");
	}
	async run(client, interation) {
		interation.reply("Recived");
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("Ask AI command")
			.toJSON();
	}
};
