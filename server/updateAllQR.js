require("dotenv").config();

const mongoose = require("mongoose");
const QRCode = require("qrcode");
const Machine = require("./models/machine");

const FRONTEND_URL = "https://blw-project.netlify.app";

async function updateQR() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

        const machines = await Machine.find();

        for (const machine of machines) {

            const qrURL = `${FRONTEND_URL}/machine.html?id=${machine._id}`;

            machine.qrCode = await QRCode.toDataURL(qrURL, {
                errorCorrectionLevel: "H",
                width: 300,
                margin: 2
            });

            await machine.save();

            console.log(`✅ Updated : ${machine.machine_name}`);
        }

        console.log("\n🎉 All QR Codes Updated Successfully");

        process.exit();

    } catch (err) {

        console.log(err);

        process.exit(1);

    }

}

updateQR();