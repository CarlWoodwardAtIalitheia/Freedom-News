import { keys } from './writer';


export default {
    createEvent(title, hashtags) {
        return {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['t', title.replace(' ', '-').replace("'", '').replace('"', ''), ...hashtags]
            ],
            content: `${title}`,
        };
    },
    async createPost(category, event, title, content, recommendRelay, lang) {
        let e = {
            kind: 30023,
            created_at: Math.floor(Date.now() / 1000),
            content: `# ${title}\n${content}`,
            tags: [
                ['t'],
                ['title', title],
                ['category', category],
                ['e', event, recommendRelay, 'mention']
            ]
        };
        e.tags[0].push(...(await keys(e.content.replace(/<[^>]+>/g, ''), lang)));

        return e;
    }
};
