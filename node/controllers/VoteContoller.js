import VotationModel from "../models/VotationModel.js";
import VoteModel from "../models/VoteModel.js";

/**
 * Function that inserts a vote into the VoteModel if is currently active.
 * @param {number} idVotation - The ID of the Votation to which the vote is associated.
 * @param {string} wallet - The wallet address of the voter.
 * @param {number} idOption - The ID of the option chosen in the vote.
 */
export const insertVote = async (req, res) => {
  try {
    const { idVotation, wallet, idOption } = req.body;
    const canVote = await VotationModel.findOne({
      where: { idVotation, is_active: 1, is_closed: 1 },
    });

    if (canVote) {
      await VoteModel.create({ idVotation, wallet, idOption });
      res.json("Vote Inserted Successfully");
    } else {
      res.json("Votation is closed");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}

/**
 * Function that retrieves all votes from a specific Votation.
 * @param {number} idVotation - The ID of the Votation to retrieve votes from.
 */
export const getVotesFromVotation = async (req, res) => {
  try {
    const result = await VoteModel.findAll({
      where: { idVotation: req.params.idVotation },
    });
    res.json(result);
  } catch (error) {
    res.json({ message: error.message });
  }
}

/**
 * Function that retrieves all votes from the current Votation based on 'is_active' and 'is_closed' status.
 */
export const getVotesCurrentVotation = async (req, res) => {
  try {
    const result = await VoteModel.findAll({
      attributes: ['wallet', "idOption"],
      include: {
        model: VotationModel,
        attributes: [],
        where: { is_active: 1, is_closed: 1 },
      },
    });

    if (result) {
      res.json(result);
    } else {
      res.json("No votes found for the active and closed Votation.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Function that retrieves the number of votes for a specific option in a Votation.
 * @param {number} idVotation - The ID of the Votation.
 * @param {number} idOption - The ID of the option.
 */
export const getNumVotesFromOptionVotation = async (req, res) => {
  try {
    const result = await VoteModel.findAll({
      where: {
        idVotation: req.params.idVotation,
        idOption: req.params.idOption,
      },
    });

    if (result && result.length > 0) {
      res.json({ numVotes: result.length });
    } else {
      res.json({ numVotes: 0 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Function that retrieves the total number of votes for a specific Votation.
 * @param {number} idVotation - The ID of the Votation.
 */
export const getNumVotesFromVotation = async (req, res) => {
  try {
    const numVotes = await VoteModel.count({
      where: { idVotation: req.params.idVotation },
    });

    res.json({ numVotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Function that deletes votes for a specific Votation if it is not currently active.
 * @param {number} idVotation - The ID of the Votation for which votes will be deleted.
 */
export const deleteVotes = async (req, res) => {
  try {
    const { idVotation } = req.params;
    const isCurrent = await VotationModel.findOne({
      where: { idVotation, is_active: 1, is_closed: 1 },
    });

    if (isCurrent) {
      res.json("You can't delete votes while a Votation is running");
    } else {
      await VoteModel.destroy({
        where: { idVotation },
      });
      res.json("Votes deleted successfully");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}
