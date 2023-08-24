<script setup>
import { icon } from '../copilot/writer';
import { useToast } from 'vue-toastification';
import cdn from '../clients/cdn';
</script>
<template>
    <div class="editor">
        <mavon-editor v-model="content" class="content" :xss-options="xssOptions" :toolbars="toolbars" :box-shadow="false"
            language="en" :subfield="false" toolbars-background="rgba(224, 235, 227, .4)"
            preview-background="rgba(224, 235, 227, .3)" ref="editor" :autofocus="false">
            <template #left-toolbar-before>
                <button type="button" @click="insertHeading" class="op-icon fa fa-mavon-header" aria-hidden="true"></button>
            </template>
            <template #left-toolbar-after>
                <i class="fi fi-rr-picture op-icon" @click="$refs.picturesInput.click"></i>
                <input type="file" name="pictures" id="pictures" multiple accept="image/*" ref="picturesInput"
                    @change="upload">

                <i class="fi fi-rr-film op-icon" @click="$refs.videosInput.click"></i>
                <input type="file" name="videos" id="videos" multiple accept="video/*" ref="videosInput" @change="upload">

                <i class="fi fi-br-waveform op-icon" @click="$refs.audiosInput.click"></i>
                <input type="file" name="audios" id="audios" multiple
                    accept="audio/wav, audio/aiff, audio/mpeg, audio/flac, audio/midi, audio/aac, audio/x-m4a, audio/mpegurl"
                    ref="audiosInput" @change="upload">

                <!-- <i class="fi fi-br-file op-icon" @click="$refs.filesInput.click"></i>
                <input type="file" name="files" id="files" multiple accept="*" ref="filesInput"
                    @click.prevent="() => { console.log('Get premium to upload files like .docx, .pptx, .pdf, etc. '); }"> -->

                <i class="fi fi-br-link op-icon" @click="insertLink"></i>
            </template>
        </mavon-editor>
        <Teleport to="body">
            <div class=" uploading message" v-show="uploading"><img src="../assets/icons/interface/br-spinner.svg"
                    alt="Uploading" class="icon">
                Uploading
                <span class="file-name">{{ uploading }}</span>
            </div>
        </Teleport>
    </div>
</template>
<script>
'../assets/temp/[480x360] Media Tweets by モニカ (@pipimonicaca)  Twitter (3).mp4';
export default {
    data() {
        return {
            content: ``,
            toolbars: {
                bold: true,
                italic: true,
                underline: true,
                quote: true,
                ul: true,
                ol: true,
                fullscreen: true,
                help: true,
                undo: true,
                redo: true,
                save: true,
                subfield: true,
                preview: true,
            },
            xssOptions: {
                whiteList: {
                    video: ['controls', 'width', 'height'],
                    audio: ['controls'],
                    source: ['src', 'type'],
                    style: [],
                    file: ['data-name', 'data-src', 'data-type'],
                    span: ['class'],
                    img: ['src', 'alt']
                },
                onTag: (tag, html, options) => {
                    if (tag != 'file') return undefined;

                    if (options.isClosing) return `</div>`;


                    let [, name, src] = html.match(/<file.*?data-name="(.*?)".*?data-src="(.*?)".*?>/);
                    return `<div class="file"><img src="${icon(src)}" alt="Icon" class="file-icon"><span class="file-name">${name}</span><i class="fi fi-br-arrow-up-right-from-square"></i>`;
                }
            },
            fileRecords: [],
            uploadUrl: 'https://example.com',
            uploading: '',
            toast: useToast()
        };
    },
    expose: ['content'],
    methods: {
        insertAtCursor(text, prefix = '', suffix = '') {
            let textarea = document.querySelector('textarea');
            let cursorPosition = textarea.selectionStart;
            let textareaText = textarea.value;
            let newText = textareaText.substring(0, cursorPosition) + `${prefix}${text}${suffix}` + textareaText.substring(cursorPosition);
            this.$refs.editor.d_value = newText;
        },
        insertHeading() {
            let level = parseInt(prompt(this.$t('editor.headingLevel')));
            if (!level) return false;
            let heading = prompt(this.$t('editor.heading'));
            if (!heading) return false;
            this.insertAtCursor(`${'#'.repeat(level + 1)} ${heading}`, '\n', '\n');
        },
        insertLink() {
            let link = prompt(this.$t('editor.link'));
            if (!link) return false;
            let name = prompt(this.$t('editor.linkName'));
            if (!name) return false;
            this.insertAtCursor(`[${name}](${link})`, '\n', '\n');
        },
        async upload(event) {
            let insertion = '',
                src = '',
                name = '';
            await cdn.upload(event.srcElement.files, (status, res) => {
                switch (status) {
                    case -1:
                        this.uploading = '';
                        this.toast.error(`Failed to upload ${res.name}: ${res.message}`);
                        break;
                    case 0:
                        this.uploading = res.name;
                        break;
                    case 1:
                        const uploadedFile = res.data[0];
                        if (!uploadedFile) {
                            this.toast.error("We currently only support uploading image, audio and videos.");
                            this.uploading = '';
                            return false;
                        }
                        src = uploadedFile.url;
                        name = res.name;
                        break;

                }
            });
            if (!src) return false;
            switch (event.srcElement.id) {
                case 'pictures':
                    insertion = `<span class="file-name">${name}</span><img src="${src}" alt="${name}">`;
                    break;
                case 'videos':
                    insertion = `<span class="file-name">${name}</span><video controls><source src="${src}" type="${file.type}"></video>`;
                    break;
                case 'audios':
                    insertion = `<span class="file-name">${name}</span><audio controls><source src="${src}" type="${file.type}"></audio>`;
                    break;
                default:
                    // insertion = `<file data-name="${name}" data-src="${src}" data-type="${file.type}"></file>`;
                    break;
            }
            this.insertAtCursor(insertion, '\n', '\n');
            this.uploading = '';
        }
    }
};
</script>
<style scoped>
@import url(../assets/css/Editor.css);
</style>
<style>
video,
audio {
    width: 100%;
}

div.file {
    width: 100%;
    margin: 0 auto;
    padding: 5px 10px;

    border-radius: 10px;

    font-family: Franklin, arial, sans-serif;

    display: flex;
    flex-direction: row;
    align-items: center;

    background: rgba(224, 235, 227, 0.5);
    color: #141f17;
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
}

.file-icon {
    height: 40px;
    background: #ffffff00 !important;
}

.file-name {
    flex-grow: 1;
    margin: 0 10px;
    display: block;
}

.file-name {
    font-family: Arial, Helvetica, sans-serif;
}

.editor .content {
    border: 1px solid #e0ebe3 !important;
}

.editor .v-note-op {
    border-bottom: 1px solid #e0ebe3 !important;
}
</style>
