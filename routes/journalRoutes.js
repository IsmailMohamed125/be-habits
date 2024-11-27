const express = require("express");

const { requireAuth } = require("@clerk/express");
const { getJournalEntries, postJournalEntry, getJournalEntryById } = require("../controllers/journal.controller");

const router = express.Router();

router.route("/").get(requireAuth(), getJournalEntries).post(requireAuth(), postJournalEntry);

router.route("/:journal_id").get(requireAuth(), getJournalEntryById)


module.exports = router;