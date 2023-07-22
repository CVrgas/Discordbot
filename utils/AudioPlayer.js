const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} = require("@discordjs/voice");

let player;
let subscribe;

function initAudioPlayer(interaction) {
	// connection
	if (getVoiceConnection(interaction.guild.id) === undefined) {
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
	}
	//player
	player = createAudioPlayer();
	//subcribe
	subscribe = getVoiceConnection(interaction.guild.id).subscribe(player);
}

function AudioPlayer_play(resource) {
	player.play(resource);

	player.on("error", (error) => {
		console.log("Error reproduciendo", error);
	});
}

function getPlayer() {
	return player;
}

module.exports = {
	initAudioPlayer,
	AudioPlayer_play,
	getPlayer,
};
