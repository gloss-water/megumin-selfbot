const { Command } = require('discord-akairo');

function exec(message, args){
    if (!args.guild){
        this.client.logger.log(3, 'Must be in a guild to check its icon.');
        return message.delete();
    }

    if (!args.guild.iconURL){
        this.client.logger.log(2, 'Guild does not have an icon.');
        return message.delete();
    }

    const color = this.client.color(message);

    const embed = this.client.util.embed()
    .setColor(color)
    .setImage(args.guild.iconURL)
    .setTitle('Guild Icon')
    .setURL(args.guild.iconURL);

    return message.edit('', { embed });
}

module.exports = new Command('icon', exec, {
    aliases: ['icon'],
    args: [
        {
            id: 'guild',
            type: 'guild',
            default: m => m.guild
        }
    ],
    category: 'info'
});
