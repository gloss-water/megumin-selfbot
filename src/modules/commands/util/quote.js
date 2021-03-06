const { Command } = require('discord-akairo');
const { URL } = require('url');
const path = require('path');

function exec(message, args){
    if (!args.id){
        this.client.logger.log(3, 'No message ID provided to quote.');
        return message.delete();
    }

    const color = this.client.color(message);

    return message.channel.fetchMessages({ around: args.id, limit: 3 }).then(messages => {
        const quotee = messages.get(args.id);

        const embed = this.client.util.embed()
        .setDescription(quotee.content || '\u200B')
        .setAuthor(`${quotee.author.username}#${quotee.author.discriminator}`, quotee.author.displayAvatarURL)
        .setFooter(quotee.id)
        .setTimestamp(quotee.createdAt)
        .setColor(color);

        if (quotee.attachments.size){
            try {
                const url = new URL(quotee.attachments.first().url);
                const ext = path.extname(url.pathname);
                if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) embed.setThumbnail(quotee.attachments.first().url);
            } catch (err) {
                if (err.message !== 'Invalid URL') throw err;
            }
        }

        return message.edit(message.content.slice(message.content.search(args.id) + args.id.length + 1), { embed });
    }).catch(err => {
        if (err.response && err.response.badRequest){
            this.client.logger.log(3, 'Your message ID was invalid.');
            return message.delete();
        }
        
        throw err;
    });
}

module.exports = new Command('quote', exec, {
    aliases: ['quote', 'q'],
    args: [
        {
            id: 'id'
        }
    ],
    category: 'util'
});
