export default {
    async upload(files, callback) {
        for (let file of files) {
            let reader = new FileReader();
            reader.readAsBinaryString(file);
            let formData = new FormData();
            formData.append('fileToUpload', file);
            callback(0, { name: file.name });
            await fetch('https://nostr.build/api/v2/upload/files', {
                method: 'POST',
                mode: 'cors',
                body: formData
            })
                .then(res => res.json()).then(res => callback(1, { ...res, name: file.name }))
                .catch(reason => callback(-1, { name: file.name, message: reason }));
        }
    }
};
