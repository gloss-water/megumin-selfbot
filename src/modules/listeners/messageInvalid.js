const { Listener } = require('discord-akairo');
const { RichEmbed } = require('discord.js');

function exec(message){
    if (/^\{.+?\}/.test(message.content)){
        const name = message.content.match(/^\{(.+?)\}/);
        const image = this.client.images[name[1].toLowerCase()];

        if (!image){
            const rep = this.editText(message.content);
            if (message.content !== rep) message.edit(rep);
            return;
        }

        const color = this.client.color(message);
        const embed = new RichEmbed().setImage(image).setColor(color);
        
        return message.edit(this.editText(message.content.replace(name[0], '')), { embed }).catch(err => {
            if (err.response && err.response.badRequest){
                this.client.logger.log(3, 'Your image was invalid. Double check your link!');
                return message.delete();
            }
            
            throw err;
        });
    }
    
    const rep = this.editText(message.content);
    if (message.content !== rep) return message.edit(rep);
}

module.exports = new Listener('messageInvalid', exec, {
    emitter: 'commandHandler',
    eventName: 'messageInvalid',
    type: 'on'
});

module.exports.editText = function(text){
    const matches = [];
    const regex = /\\?\[(.+?)\]/g;
    let temp;

    while ((temp = regex.exec(text)) !== null){
        if (temp[0].startsWith('\\')) continue;
        matches.push(temp);
    }

    if (matches.length) for (const [full, name] of matches){

        const tag = this.client.tags[name.toLowerCase()];
        if (!tag) continue;

        text = text.replace(full, tag);
    }

    if (!this.client.config.grammar) return text;
    if (this.client.config.grammar){
        const corrected = text
        .replace(/(?:^|[.?!]\s)\w/g, m => m.toUpperCase())
        .replace(/\b(i)(m)/gi, '$1\'$2')
        .replace(/\b(i)('m)?\b/gi, (m, i, a) => i.toUpperCase() + (a || ''))
        .replace(/\b(can|don|won|isn|wasn|aren|ain|shouldn|couldn|wouldn|didn|hadn|haven)(t)\b/gi, '$1\'$2')
        .replace(/\b(should|could|would|must|you)(ve)\b/gi, '$1\'$2')
        .replace(/\b(y)(all)\b/gi, '$1\'$2')
        .replace(/\b(that)(s)\b/gi, '$1\'$2');

        return corrected;
    }
};
