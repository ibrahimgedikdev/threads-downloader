var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');


router.get('/', async (req, res) => {
    res.render("views/index");
});

router.post('/fetch', async (req, res) => {
    const url = req.body.url;
    const baseUrl = "https://www.threads.net/t/";
    const content = [];
    var modifiedUrl;

    try {
        const regex = new RegExp(`${baseUrl}([^/?]+)`);
        const match = url.match(regex);

        if (match) {
            const dynamicPart = match[1];
            modifiedUrl = `${baseUrl}${dynamicPart}/embed`;
        } else {
            throw new Error('URL is incompatible !');
        }

        const getHTML = await axios.get(modifiedUrl);
        const html = getHTML.data;

        const $ = cheerio.load(html);

        const $mediaContainer = $('.BodyContainerNoThreadLine');
        const $mediaTitle = $('.BodyTextContainer').text();
        const $mediaUser = $('.NameContainer span').text();
        const $mediaAvatar = $('.AvatarContainer img').attr('src');
        const $videos = $mediaContainer.find('video source');
        const $images = $mediaContainer.find('img');


        if ($videos.length > 0) {
            for (let i = 0; i < $videos.length; i++) {
                let videoSource = $($videos[i]).attr("src");
                content.push({
                    src: videoSource,
                    type: "video",
                });
            }
        }
        if ($images.length > 0) {
            for (let i = 0; i < $images.length; i++) {
                let imageSource = $($images[i]).attr("src");
                content.push({
                    src: imageSource,
                    type: "image"
                });
            }
        }

        res.json({ content: content, title: $mediaTitle, avatar: $mediaAvatar, user: $mediaUser });
    } catch (error) {
        res.status(500).send('An error occurred while processing the URL.');
    }
});

router.get('/download', (req, res) => {
    const filePath = req.query.file;

    if (!filePath) {
        return res.status(400).send('File path not provided.');
    }

    const fileName = path.basename(filePath);

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while downloading the file.');
        }

        fs.unlinkSync(filePath);
    });
});

router.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy');
});


module.exports = router
