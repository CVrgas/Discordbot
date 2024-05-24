const Queue = require("./Queue.js");
const Stream = require("./Stream.js");

class player {
	constructor() {
		this._Queue = new Queue();
		this._Stream = new Stream(this.onPlaybackStateChanged.bind(this));
		this._State = "idle";
		this._error = "";
		this._eventListeners = new Set();
		this._listeners = [];
	}

	onPlaybackStateChanged(newState) {
		// Handle the playback state change
		this._State = newState;

		// Do additional actions based on the state change if needed

		// Notify listeners or perform other actions as necessary
		this.dispatchStateChange();
	}

	async AddToQueue(url, limit = undefined) {
		this.state = "loading";
		try {
			await this._Queue.AddToQueue(url, limit);
		} catch (error) {
			this._error = " failed to load videos";
			this._isError = true;
		}
		this.state = "idle";
	}
	getQueueStatus() {
		return this._Queue.getStatus();
	}
	ClearQueue() {
		this._Queue.ClearQueue();
	}
	async NewQueue(url, limit = undefined) {
		this.ClearQueue();
		this.isLoading = true;
		try {
			await this._Queue.AddToQueue(url, limit);
		} catch (error) {
			this._error = " failed to load videos";
			this._isError = true;
		}
		this.isLoading = false;
	}
	getCurrent() {
		return this._Queue.current();
	}
	getPlaylist(limit = undefined) {
		return this._Queue.playlist(limit);
	}

	Play(interaction) {
		this._Stream.Play(this._Queue.current(), interaction);
	}
	Pause() {
		this._Stream.Pause();
	}
	Resume() {
		this._Stream.Resume();
	}

	PlayNext() {
		if (this._Queue.isNext()) {
			this._Stream.Play(this._Queue.next());
		} else {
			this._Stream.Play(this._Queue.current());
		}
	}

	PlayPrev() {
		if (this._Queue.isPrev()) {
			this._Stream.Play(this._Queue.prev());
		} else {
			this._Stream.Play(this._Queue.current());
		}
	}

	// Event Emitters and listener
	get state() {
		return this._State;
	}
	set state(value) {
		if (this._State !== value) {
			this._State = value;
			this.dispatchStateChange();
		}
	}
	get error() {
		return this._error;
	}
	set error(value) {
		if (this._error !== value) {
			this._error = value;
		}
	}

	addEventListener(callback) {
		this._listeners.push(callback);
	}

	// Remove a listener
	removeEventListener(callback) {
		this._listeners = this._listeners.filter(
			(listener) => listener !== callback
		);
	}

	// Notify all listeners that isPlaying has changed
	dispatchStateChange() {
		this._listeners.forEach((listener) => {
			let response = { state: this.state, message: "" };
			if (this.state === "error") {
				response.message = this.error;
			}
			listener(response);
		});
	}
}
module.exports = player;
