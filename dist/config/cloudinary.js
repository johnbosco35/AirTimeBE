"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: "dn3mokfxz",
    api_key: "386857267759241",
    api_secret: "jHH0hQ7vm1j-lCtkuY_qxO91JEU",
    secure: true,
});
exports.default = cloudinary_1.v2;
