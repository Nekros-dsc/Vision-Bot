const querystring = require("querystring");
const { request } = require("undici");
const fs = require("fs/promises");
const path = require("path");

const languages = require("./languages");
const tokenGenerator = require("./token");

const CACHE_FILE = path.join(__dirname, "cache.json");

/**
 * @function translate
 * @param {String} text
 * @param {Object} options
 * @returns {Object}
 */
async function translate(text, options) {
    if (typeof options !== "object") options = {};
    text = String(text);

    let error;
    [options.from, options.to].forEach((lang) => {
        if (lang && !languages.isSupported(lang)) {
            error = new Error();
            error.code = 400;
            error.message = `The language '${lang}' is not supported.`;
        }
    });
    if (error) throw error;
    

    let cacheKey = `${options.from}-${options.to}-${text}`;

    // Charger le fichier de cache et vérifier s'il existe déjà
    let cache;
    try {
        cache = JSON.parse(await fs.readFile(CACHE_FILE, "utf-8"));
    } catch (err) {
        cache = {};
    }

    if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
    }

    if (!Object.prototype.hasOwnProperty.call(options, "from")) options.from = "auto";
    if (!Object.prototype.hasOwnProperty.call(options, "to")) options.to = "fr";
    options.raw = Boolean(options.raw);

    options.from = languages.getISOCode(options.from);
    options.to = languages.getISOCode(options.to);

    let token = await tokenGenerator.generate(text);

    let baseUrl = "https://translate.google.com/translate_a/single";
    let data = {
        client: "gtx",
        sl: options.from,
        tl: options.to,
        hl: options.to,
        dt: ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"],
        ie: "UTF-8",
        oe: "UTF-8",
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text,
        [token.name]: token.value,
    };

    let url = `${baseUrl}?${querystring.stringify(data)}`;

    let requestOptions;
    if (url.length > 2048) {
        delete data.q;
        requestOptions = [
            `${baseUrl}?${querystring.stringify(data)}`,
            {
                method: "POST",
                body: new URLSearchParams({ q: text }).toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
            },
        ];
    } else {
        requestOptions = [url];
    }

    let response = await request(...requestOptions);
    let body = await response.body.json();

    let result = {
        text: "",
        from: {
            language: {
                didYouMean: false,
                iso: "",
            },
            text: {
                autoCorrected: false,
                value: "",
                didYouMean: false,
            },
        },
        raw: "",
    };

    if (options.raw) {
        result.raw = body;
    }

    body[0].forEach((obj) => {
        if (obj[0]) {
            result.text += obj[0];
        }
    });

    if (body[2] === body[8][0][0]) {
        result.from.language.iso = body[2];
    } else {
        result.from.language.didYouMean = true;
        result.from.language.iso = body[8][0][0];
    }

    if (body[7] && body[7][0]) {
        let str = body[7][0];

        str = str.replace(/<b><i>/g, "[");
        str = str.replace(/<\/i><\/b>/g, "]");

        result.from.text.value = str;

        if (body[7][5] === true) {
            result.from.text.autoCorrected = true;
        } else {
            result.from.text.didYouMean = true;
        }
    }

    // Mettre à jour le cache et sauvegarder dans le fichier
    cache[cacheKey] = result;
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));

    return result;
}

module.exports = translate;
module.exports.languages = languages;