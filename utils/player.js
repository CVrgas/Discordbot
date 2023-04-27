const { createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection } = require('@discordjs/voice')
const ytdl = require('ytdl-core')

async function songPlayer( client, interaction, url){


    let songData = await ytdl.getInfo(url);
    let song = {
          tittle: songData.videoDetails.title,
            url: songData.videoDetails.video_url
    };
    let connection = getVoiceConnection(interaction.guild.id);
    if(!connection){ return interaction.reply(' Not connection')}

    const stream =  await ytdl(url, {
        filter: 'audioonly',
        quality: 'lowestaudio'
    });
    const resourse = createAudioResource(stream)
    let player = createAudioPlayer();
    let dispatcher = connection.subscribe(player);
    player.play(resourse);
    interaction.reply(`now playing: ${url}`);
       
    player.on('error', error =>{
        console.log(error);
    })
}

async function playlistPlayer(client, interaction){

    let url = interaction.options.get('url').value;
    const playlist_id = await ytpl.getPlaylistID(url);
    let queue = await ytpl(playlist_id, { pages: 1}).items.reverse();
    let next = queue.pop().url;
    songPlayer(client, interaction, next)

    player.on(AudioPlayerStatus.Idle, async () =>{
        if(queue.length >= 0){

            next = queue.pop().url
            songPlayer(client, interaction, url);

        }
    })
}

module.exports ={
    songPlayer,
    playlistPlayer,
}