import { toString } from 'nlcst-to-string';
import { retext } from 'retext';
import retextPos from 'retext-pos';
import retextKeywords from 'retext-keywords';

export async function keys(text, lang, num = 5) {
    let keys = [];
    switch (lang) {
        case 'zh-hans':
            // let res = await fetch('https://yisuan.net/wp-json/action/Wndt_Extract_Keywords', {
            //     headers: {
            //         "accept": "application/json, text/plain, */*",
            //         "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            //         "content-type": "application/json",
            //         "sec-fetch-dest": "empty",
            //         "sec-fetch-mode": "cors",
            //         "sec-fetch-site": "same-origin",
            //         "x-wp-nonce": "be9463a812"
            //     },
            //     body: JSON.stringify({
            //         text: text,
            //         num: num,
            //         app_id: 158,
            //         _wnd_sign: 'c69d28e6a8'
            //     }),
            //     method: 'POST',
            //     mode: 'cors'
            // });
            // return (await res.json()).msg.split('<br/>').filter(value => (value));
            keys.push('暂不支持中文关键词自动提取');
            break;
        case 'en-US':
            let processor = retext()
                .use(retextPos)
                .use(retextKeywords);
            let file = await processor.process(text);
            file.data.keywords.forEach((keyword) => {
                keys.push(toString(keyword.matches[0].node));
            });
            file.data.keyphrases.forEach((keyphrase) => {
                keys.push(keyphrase.matches[0].nodes.map((d) => toString(d)).join(''));
            });
            break;
    }
    return keys;
}

export function icon(src) {
    return ICONS[src.split('.').pop()] || './src/assets/file-icons/undefined.svg';
}

/* Update icons:
 
```sh
cd <file-icons dir>
py
```
 
import os
icons = os.listdir('./')
ICONS = {}
for icon in icons:
    ICONS[icon.split('.')[0]] = f'./src/assets/file-icons/{icon}'
 
for ICON in ICONS:
    print(f"'{ICON}': '{ICONS[ICON]}',")
 
'ai': './src/assets/file-icons/ai.svg',
'apk': './src/assets/file-icons/apk.svg',
'asc': './src/assets/file-icons/asc.svg',
...
 
*/

const ICONS = {
    // 'ai': './src/assets/file-icons/ai.svg',
    // 'apk': './src/assets/file-icons/apk.svg',
    // 'asc': './src/assets/file-icons/asc.svg',
    // 'bmp': './src/assets/file-icons/bmp.svg',
    // 'cer': './src/assets/file-icons/cer.svg',
    // 'crt': './src/assets/file-icons/crt.svg',
    // 'db': './src/assets/file-icons/db.svg',
    // 'docx': './src/assets/file-icons/docx.svg',
    // 'epub': './src/assets/file-icons/epub.svg',
    // 'exe': './src/assets/file-icons/exe.svg',
    // 'gif': './src/assets/file-icons/gif.svg',
    // 'html': './src/assets/file-icons/html.svg',
    // 'ico': './src/assets/file-icons/ico.svg',
    // 'img': './src/assets/file-icons/img.svg',
    // 'java': './src/assets/file-icons/java.svg',
    // 'jpg': './src/assets/file-icons/jpg.svg',
    // 'js': './src/assets/file-icons/js.svg',
    // 'json': './src/assets/file-icons/json.svg',
    // 'key': './src/assets/file-icons/key.svg',
    // 'less': './src/assets/file-icons/less.svg',
    // 'mdb': './src/assets/file-icons/mdb.svg',
    // 'ogg': './src/assets/file-icons/ogg.svg',
    // 'pdf': './src/assets/file-icons/pdf.svg',
    // 'pem': './src/assets/file-icons/pem.svg',
    // 'php': './src/assets/file-icons/php.svg',
    // 'pptx': './src/assets/file-icons/pptx.svg',
    // 'ps': './src/assets/file-icons/ps.svg',
    // 'psd': './src/assets/file-icons/psd.svg',
    // 'pub': './src/assets/file-icons/pub.svg',
    // 'ruby': './src/assets/file-icons/ruby.svg',
    // 'sass': './src/assets/file-icons/sass.svg',
    // 'scala': './src/assets/file-icons/scala.svg',
    // 'sh': './src/assets/file-icons/sh.svg',
    // 'sql': './src/assets/file-icons/sql.svg',
    // 'tar': './src/assets/file-icons/tar.svg',
    // 'tex': './src/assets/file-icons/tex.svg',
    // 'tga': './src/assets/file-icons/tga.svg',
    // 'tiff': './src/assets/file-icons/tiff.svg',
    // 'torrent': './src/assets/file-icons/torrent.svg',
    // 'ts': './src/assets/file-icons/ts.svg',
    // 'txt': './src/assets/file-icons/txt.svg',
    // 'undefined': './src/assets/file-icons/undefined.svg',
    // 'vala': './src/assets/file-icons/vala.svg',
    // 'xlsx': './src/assets/file-icons/xlsx.svg',
    // 'xml': './src/assets/file-icons/xml.svg',
    // 'zip': './src/assets/file-icons/zip.svg',
};

