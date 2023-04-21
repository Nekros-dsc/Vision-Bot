const langSchema = require("../../utils/schemas/lang");
const mongoose = require("mongoose")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {
    name: "manage-tickets",
    description: "Permet de modifier le panel des tickets",
    aliases: ["tickets-config", "ticketc", "ctickets"],

    run : async (client, message, args) => {

    }
}