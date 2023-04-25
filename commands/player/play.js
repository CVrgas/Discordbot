const { createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection } = require('@discordjs/voice')
const SlashCommand = require('../../utils/SlashCommand')
const { SlashCommandBuilder } = require('discord.js')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const ytlist = require('youtube-playlist')

module.exports = class PlayCommand extends SlashCommand{

    constructor(){
        super('play')
    }

    async run(client, interation){
        // necesito desinstalar ytpl

        try{
            let url = interation.options.get('url').value;
            // console.log('is video: ', ytdl.validateURL(url))
            // let list = await ytlist(url, ['id','url'])
            // ytlist(url, 'id').then(res =>{
            //     console.log(res);
            // })

            // ytpl -----------
            const playlist_id = await ytpl.getPlaylistID(url);
            console.log('plalist id: ',playlist_id)
            console.log('validate result : ', ytpl.validateID(playlist_id))
            if(ytpl.validateID(playlist_id)){
            const first = await ytpl(playlist_id, {limit: 1, pages: 1} )
                console.log(first.items)
                const second = await ytpl.continueReq(first.continuation)
                console.log(second.items)
            }
            
        } catch (error){
            console.log(error)
        }


        // let url = interation.options.get('url').value;
        // let validar = await ytdl.validateURL(url);
        // if(!validar) { return interation.reply('no valida')}

        // let songData = await ytdl.getInfo(url);
        // let song = {
        //     tittle: songData.videoDetails.title,
        //     url: songData.videoDetails.video_url
        // };
        // let connection = getVoiceConnection(interation.guild.id);
        // if(!connection){ return interation.reply(' Not connection')}

        // const stream =  await ytdl(url, {
        //     filter: 'audioonly',
        //     quality: 'lowestaudio'
        // });
        // const resourse = createAudioResource(stream)
        // let player = createAudioPlayer();
        // let dispatcher = connection.subscribe(player);
        // player.play(resourse);
        // interation.reply(`now playing: ${url}`);
        
        // player.on('error', error =>{
        //     console.log(error);
        // })
    }

    getSlashCommandJSON(){
        return new SlashCommandBuilder()
        .setName(this.name)
        .setDescription('play command')
        .addStringOption((option) =>
            option.setName('url')
            .setDescription('url of video')
            .setRequired(true)
        )
        .toJSON();
    }
}

