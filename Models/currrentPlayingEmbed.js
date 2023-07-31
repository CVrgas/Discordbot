const { EmbedBuilder, ButtonBuilder } = require("discord.js");

module.exports = class CurrentPlayingEmbed  {
	constructor() {
		this._embed;
	}
	setResponse(data) {
		if (data.next === null) {
			const embed = new EmbedBuilder()
				.setColor("Random")
				.setTitle("Now Playing")
				.setDescription(data.current.title)
				.setImage(data.current.thumbnail);
			this._embed = embed;
			return;
		}
		const embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle("Now Playing")
			.setDescription(data.current.title)
			.setImage(data.current.thumbnail)
			.addFields({
				name: "Next song:",
				value: data.next.title,
			});
		this._embed = embed;
	}
	getResponse() {
		return this._embed;
	}
};
