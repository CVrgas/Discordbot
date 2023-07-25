const { EmbedBuilder } = require("discord.js");

let videolist;
let ActualEmbed;

function createEmbed(videoInfo) {
	try {
		const embed = new EmbedBuilder()
			.setColor([207, 25, 25])
			.setTitle(`${videoInfo.title}`)
			.addFields({
				name: "Duration",
				value: `${videoInfo.durationRaw}`,
			});
		// .toJSON();
		return embed;
	} catch (error) {
		console.log(`creating embed Error \n${error}`);
		const ErrorEmbed = new EmbedBuilder().setTitle("error creating box");
		return ErrorEmbed;
	}
}
function getNextEmbed() {
	return ActualEmbed;
}
function setNextEmbed() {
	let actualVideo = videolist[videolist.length - 1];
	let nextVideo = videolist[videolist.length - 2];

	try {
		ActualEmbed = new EmbedBuilder()
			.setColor("Random")
			.setTitle("Now Playing")
			.setDescription(actualVideo.title)
			.setImage(actualVideo.thumbnails[actualVideo.thumbnails.length - 1].url)
			.addFields({
				name: "Next song:",
				value: nextVideo.title,
			});
	} catch (error) {
		console.log("error creating now/next embed");
	}
}
function SetEmbedData(playlist) {
	videolist = playlist;
	setNextEmbed();
}
function InfoEmbed(title, description) {
	const InfoEmbed = new EmbedBuilder()
		.setColor([255, 255, 255])
		.setTitle(title)
		.setDescription(`${description}`);
}
module.exports = {
	createEmbed,
	SetEmbedData,
	setNextEmbed,
	getNextEmbed,
	InfoEmbed,
};
