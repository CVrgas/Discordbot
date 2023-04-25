require('dotenv/config');
const { Client, IntentsBitField, Message, SlashCommandBuilder, Routes, Collection, ChannelType} = require('discord.js');
const { createAudioResource,NoSubscriberBehavior,VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const { TOKEN, CHANNEL_ID, GUILD_ID, APP_ID } = process.env
const {registerCommands} = require('./utils/registry');


const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
})


bot.rest.setToken(TOKEN)

async function main(){
    try{
        bot.slashCommand = new Collection();
        await registerCommands(bot, '../commands')
        // console.log(bot.slashCommand);
        const slashCommandsJson = bot.slashCommand.map(
            (cmd) => cmd.getSlashCommandJSON()
        );
        await bot.rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
            body: slashCommandsJson,
        });
        const registeredSlashCommands = await bot.rest.get(
            Routes.applicationGuildCommands(APP_ID, GUILD_ID)
        );
        // console.log (registeredSlashCommands)
        await bot.login(TOKEN);
    }   catch (err){
        console.log(err);
    }
}

bot.on('interactionCreate', (interaction)=>{
    if (interaction.isChatInputCommand()){
        const {commandName}= interaction;
        const cmd = bot.slashCommand.get(commandName);
        if(cmd){
            cmd.run(bot, interaction);
        }else {
            interaction.reply('command has no run method');
        }
    }
})
// bot.on('interactionCreate', (interation) => {
//     if(interation.isChatInputCommand()){
//         if(interation.commandName == 'join'){     
//         }
//         switch(interation.commandName){
//             case 'join':
//                 const connection = joinVoiceChannel({
//                     channelId: CHANNEL_ID,
//                     guildId: interation.guild.id,
//                     adapterCreator: interation.guild.voiceAdapterCreator,
//                 })
//                 break;
//             case 'leave':
//                 const breakConnection = getVoiceConnection(interation.guild.id);
//                 breakConnection.destroy();
//                 break;
//                 // const subscription = connection.subscribe(audioPlayer);
//             default:
//                 break;
//         }
//     }
// })

// log "ready" when bot is ready
bot.on('ready', () =>{
    console.log("bot ready")
})


bot.on('messageCreate', (message) =>{
    if(message.author.bot) return;
    message.reply(`Eco: `, message)
})




// function attachRecorder() {
// 	player.play(
// 		createAudioResource(
// 			new prism.FFmpeg({
// 				args: [
// 					'-analyzeduration',
// 					'0',
// 					'-loglevel',
// 					'0',
// 					'-f',
// 					type,
// 					'-i',
// 					type === 'dshow' ? `audio=${device}` : device,
// 					'-acodec',
// 					'libopus',
// 					'-f',
// 					'opus',
// 					'-ar',
// 					'48000',
// 					'-ac',
// 					'2',
// 				],
// 			}),
// 			{
// 				inputType: StreamType.OggOpus,
// 			},
// 		),
// 	);
// 	console.log('Attached recorder - ready to go!');
// }
// async function ConnectVoice(interation){
//     try{
//         const connection = getVoiceConnection(interation.guild.id);
//     connection.subscribe(player);
//     await interation.reply('playing')
//     } catch (err){
//         console.log(err)
//     }
// }
main()
