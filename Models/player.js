const play = require("play-dl");
const {
	getVoiceConnection,
	joinVoiceChannel,
	createAudioResource,
	createAudioPlayer,
	AudioPlayerStatus,
} = require("@discordjs/voice");
const CurrentPlayingEmbed = require("./currrentPlayingEmbed");

module.exports = class CandyPlayer {
	constructor() {
		this.queue = [];
		this.currentSong = 0;
		this.nextSongIndex = this.currentSong + 1;
		this.InternalPlayer = createAudioPlayer();
		this.currentGuild;
		this.embedResponse = new CurrentPlayingEmbed();
		this.status = null;
	}
	async addSong(url) {
		switch (play.yt_validate(url)) {
			case "playlist":
				let dataList = await getListData(url);
				this.queue.push(...dataList);
				break;

			case "video":
				const data = await getVideoData(url);
				this.queue.push(data);
				break;

			default:
				console.log("none");
				break;
		}
	}
	async nextSong() {
		if (this.currentSong >= this.queue.length - 1) {
			return;
		}
		this.currentSong++;
		this.nextSongIndex++;
		this.playSong(this.currentGuild);
		await this.embedResponse.setResponse(this.get_Current_Next());
	}
	async previousSong() {
		if (this.currentSong === 0) {
			return;
		}
		this.currentSong--;
		this.nextSongIndex--;
		this.playSong(this.currentGuild);
		await this.embedResponse.setResponse(this.get_Current_Next());
	}
	pauseSong() {
		this.status = "paused";
		this.InternalPlayer.pause();
	}
	resumeSong() {
		this.status = "playing";
		this.InternalPlayer.unpause();
	}
	async playSong(i) {
		// Creating connection to voice chat
		const connection = getVoiceConnection(i.guild.id);
		if (!connection) {
			joinVoiceChannel({
				channelId: i.member.voice.channel.id,
				guildId: i.guild.id,
				adapterCreator: i.guild.voiceAdapterCreator,
			});
			this.currentGuild = i;
		}

		// Generating streaming resource
		if (this.queue.length === 0) {
			return;
		}

		const source = await play.stream(this.queue[this.currentSong].url);
		const resource = createAudioResource(source.stream, {
			inputType: source.type,
		});
		this.InternalPlayer.play(resource);

		getVoiceConnection(i.guild.id).subscribe(this.InternalPlayer);

		this.embedResponse.setResponse(this.get_Current_Next());
		this.status = "playing";
	}
	get_Current_Next() {
		return {
			current: this.queue[this.currentSong]
				? this.queue[this.currentSong]
				: "null",
			next: this.queue[this.nextSongIndex]
				? this.queue[this.nextSongIndex]
				: null,
		};
	}
	stopSong() {
		this.InternalPlayer.stop();
		this.queue = [];
	}
	async replaceQueue(url) {
		switch (play.yt_validate(url)) {
			case "playlist":
				let dataList = await getListData(url);
				this.queue = [...dataList];
				break;

			case "video":
				const data = await getVideoData(url);
				this.queue = [data];
				break;

			default:
				console.log("none");
				break;
		}
	}
};

async function getVideoData(url) {
	const video_info = await play.video_basic_info(url);
	return {
		url: video_info.video_details.url,
		title: video_info.video_details.title,
		thumbnail:
			video_info.video_details.thumbnails[
				video_info.video_details.thumbnails.length - 1
			].url,
	};
}

async function getListData(url) {
	const playlist_info = await play.playlist_info(url);
	const dataList = playlist_info.videos.map((video) => {
		return {
			url: video.url,
			title: video.title,
			thumbnail: video.thumbnails[video.thumbnails.length - 1].url,
		};
	});
	return dataList;
}
