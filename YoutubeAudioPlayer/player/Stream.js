const {
	getVoiceConnection,
	joinVoiceChannel,
	createAudioResource,
	createAudioPlayer,
	AudioPlayerStatus,
} = require("@discordjs/voice");
const play = require("play-dl");

module.exports = class Stream {
	constructor(onPlaybackStateChanged) {
		this._AudioPlayer = createAudioPlayer();
		this._onPlaybackStateChanged = onPlaybackStateChanged;
		this._Subscribed = false;
		this._VoiceConnection = false;
	}

	async Play(AudioStream, interaction) {
		try {
			if (!this._VoiceConnection) {
				this.ConnectToVoice(interaction);
				this._VoiceConnection = true;
			}
			const source = await play.stream(AudioStream._url);

			const resource = createAudioResource(source.stream, {
				inputType: source.type,
			});
			this._AudioPlayer.play(resource);
			this._onPlaybackStateChanged("playing");

			if (!this._Subscribed) {
				getVoiceConnection(interaction.guild.id).subscribe(this._AudioPlayer);
				this._AudioPlayer.on(AudioPlayerStatus.Idle, () => {
					this._onPlaybackStateChanged("idle");
				});
				this._Subscribed = true;
			}
		} catch (error) {
			console.log("Error: ", error.message);
		}
	}

	Pause() {
		this._AudioPlayer.pause();
	}

	Resume() {
		this._AudioPlayer.unpause();
	}

	ConnectToVoice(interaction) {
		const connection = getVoiceConnection(interaction.guild.id);
		if (!connection) {
			joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
			this.currentGuild = interaction;
		}
	}
};
