const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);

    if (args[0] && args[0].toLowerCase() === 'all') {
        await games_channel.messages
            .fetch({ limit: 100 })
            .then(async collected => {
                const botMsg = await collected.filter(
                    m => m.author.id == client.user.id
                );
                await games_channel.bulkDelete(botMsg, true).then(
                    host_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Clear Messages')
                        .setDescription(`Cleared ${botMsg.size} messages!`)
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())
                    ).catch(console.error)
                ).catch(console.error);
            }).catch(console.error);
    }
    else if (!isNaN(args[0])) {
        await games_channel.messages
            .fetch({ limit: args[0] })
            .then(async collected => {
                const botMsg = collected.filter(
                    m => m.author.id == config.bot_id
                );
                await games_channel.bulkDelete(botMsg, true).then(
                    host_channel.send(new Discord.MessageEmbed()
                        .setColor(0x009900)
                        .setTitle('Clear Messages')
                        .setDescription(`Cleared ${botMsg.size} messages!`)
                        .setTimestamp()
                        .setFooter('', client.user.displayAvatarURL())
                    ).catch(console.error)
                ).catch(console.error);
            }).catch(console.error);
    }
    else
        host_channel.send(new Discord.MessageEmbed()
            .setColor(0x009900)
            .setTitle('Clear Messages')
            .setDescription('Choose the number of messages you want to clear, or `all` to clear all messages')
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
};
