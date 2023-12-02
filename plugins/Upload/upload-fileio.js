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
		const response = await fileio(media);
		if (response.success === true) {
			const pesan = `*Pesan Anda berhasil terkirim! 🚀*\n\n*File Name:* ${response.name}\n*URL:* ${await shortUrl(response.link)}\n*Expired:* ${response.expires}\n*Ukuran:* ${formatBytes(response.size)}`;
			await m.reply(pesan);
		} else {
			await m.reply('Pesan Anda gagal terkirim. 🙁');
		}
	} catch (error) {
		console.error(error);
		await m.reply('Terjadi kesalahan dalam pemrosesan permintaan Anda. 🙁');
	}
};
handler.help = ["fileio"];
handler.tags = ["tools"];
handler.command = /^(fileio)$/i;
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
async function fileio(content) {
	const {
		ext,
		mime
	} = await fileTypeFromBuffer(content) || {};
	const blob = new Blob([content.toArrayBuffer()], {
		type: mime
	});
	const formData = new FormData();
	const randomBytes = crypto.randomBytes(5).toString("hex");
	formData.append('file', blob, randomBytes + '.' + ext);

	const response = await fetch("https://file.io", {
		method: "POST",
		body: formData,
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
		},
	});

	return await response.json();
};