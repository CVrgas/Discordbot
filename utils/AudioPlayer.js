const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} = require("@discordjs/voice");
const play = require("play-dl");
const {
	createEmbed,
	setEmbeds,
	getNextEmbed,
	setNextEmbed,
	InfoEmbed,
} = require("./embed");

let player = createAudioPlayer();
let subscribe;

function listen_Iddle(client, interaction, response) {
	//case player stop playing first song, play next if there is one.
	player.on(AudioPlayerStatus.Idle, async () => {
		// close if bot doesnt have a queue
		if (!client.queue) {
			connection = getVoiceConnection(interaction.guild.id);
			connection.destroy();
			response.edit(InfoEmbed("Stop Streaming", "End of playlist"));
			return;
		}

		// close if theres no item in queue
		if (client.queue.lenght <= 0) {
			interaction.editReply({
				embeds: [InfoEmbed("Stop Streaming", "no more music to play")],
				SuppressNotifications: true,
			});
			setTimeout(() => {
				interaction.deleteReply();
			}, 10000);
			return;
		}

		// prepare next song
		setNextEmbed();
		let NextSong = client.queue.pop();

		let source = await play.stream(NextSong.url);
		let resource = createAudioResource(source.stream, {
			inputType: source.type,
		});

		//reply with embeds
		try {
			await response.edit({
				embeds: [getNextEmbed()],
				SuppressNotifications: true,
			});
		} catch (error) {
			await response.edit({
				embeds: [
					InfoEmbed("Error", "error ocurred while trying to play next song"),
				],
				SuppressNotifications: true,
			});
			console.log("Error with interation reply");
		}

		//play song
		AudioPlayer_play(resource);
	});
}
async function playSigle(url) {
	const source = await play.stream(url);
	const resource = createAudioResource(source.stream, {
		inputType: source.type,
	});
	play.video_basic_info(url, { htmldata: false });

	AudioPlayer_play(resource);
}
async function AudioPlayer_play(resource) {
	player.play(resource);
	player.on("error", (error) => {
		console.log("Error reproduciendo");
	});
}

function getPlayer() {
	return player;
}

module.exports = {
	AudioPlayer_play,
	getPlayer,
	listen_Iddle,
	playSigle,
};
