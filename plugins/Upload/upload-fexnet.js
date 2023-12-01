import fetch from "node-fetch";
import crypto from "crypto";
import {
	FormData,
	Blob
} from 'formdata-node';
import {
	fileTypeFromBuffer
} from 'file-type';

let handler = async (m, {
	args,
	usedPrefix,
	command
}) => {
	try {
		let q = m.quoted ? m.quoted : m;
		let mime = (q.msg || q).mimetype || '';
		if (!mime) throw 'No media found';
		let media = await q.download();
		await m.reply(wait);
		const response = await fexnet(media);
		if (response) {
			const pesan = `*Pesan Anda berhasil terkirim! 🚀*\n\n*File Name:* ${response.upload.attachment.file_name}\n*URL:* ${await shortUrl(response.upload.attachment.content_url)}\n*Expired:* ${response.upload.expires_at}\n*Ukuran:* ${formatBytes(response.upload.attachment.size)}`;
			await m.reply(pesan);
		} else {
			await m.reply('Pesan Anda gagal terkirim. 🙁');
		}
	} catch (error) {
		console.error(error);
		await m.reply('Terjadi kesalahan dalam pemrosesan permintaan Anda. 🙁');
	}
};
handler.help = ["fexnet"];
handler.tags = ["tools"];
handler.command = /^(fexnet)$/i;
export default handler;

function formatBytes(bytes) {
	if (bytes === 0) {
		return '0 B';
	}
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
	let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
	return await res.text()
}
async function fexnet(content) {
	const {
		ext,
		mime
	} = await fileTypeFromBuffer(content) || {};
	const blob = new Blob([content.toArrayBuffer()], {
		type: mime
	});
	const formData = new FormData();
	const randomBytes = crypto.randomBytes(5).toString("hex");
	formData.append('filename', randomBytes + '.' + ext);
	formData.append('file', blob, randomBytes + '.' + ext);

	const response = await fetch("https://fexnet.zendesk.com/api/v2/uploads.json", {
		method: "POST",
		body: formData,
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
			Authorization: `Basic ${btoa("as@fexnet.com/token:1RQO68P13pmqFXorJUKp4P")}`
		},
	});

	return await response.json();
};