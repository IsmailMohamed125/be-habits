const { clerkClient, getAuth } = require("@clerk/express");
const AppError = require("../utils/errorClass");
const Journal = require("../models/journal");

exports.getJournalEntries = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const journalEntries = await Journal.find({ ...req.query, user: userId });
    res.status(200).json({
      status: "success",
      data: {
        journalEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.postJournalEntry = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const newEntry = await Journal.create({ ...req.body, user: userId });
    res.status(201).json({
      status: "success",
      data: {
        journalEntry: newEntry,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJournalEntryById = async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      const {journal_id} = req.params


      const journalEntry = await Journal.findOne({ _id: journal_id, user: userId });

      if (!journalEntry) {
        return res.status(404).json({
          status: "fail",
          message: "Journal entry not found",
        });
      }


      res.status(200).json({
          status: "success",
          data: {
              journalEntry,
            },
        });
        
    } catch (error) {
        next(error);
    }
};
