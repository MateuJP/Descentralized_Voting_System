import IdentificationModel from "../models/IdentificationModel.js";
import OptionModel from "../models/OptionModel.js";
import VotationModel from "../models/VotationModel.js";

/** 
  Function that allows associating an option in a vote with an ID. This function can only be executed if `is_active` 
  is equal to 1 and `is_closed` is equal to 0, which means that the vote is the current vote but is not yet in progress-
*/
export const insertRegister = async (req, res) => {
  try {
    const { idVotation, is_active, is_closed } = req.body;

    const isAllowed = await VotationModel.findOne({
      where: { idVotation, is_active: 1, is_closed: 0 }
    });

    if (isAllowed) {
      await IdentificationModel.create(req.body);
      res.json("Record created successfully");
    } else {
      res.json("Action is not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** 
 * Function that allows deleting a record in the IDENTIFICATION table. 
 * This action can only be executed if the vote is not in progress; otherwise, it is possible to delete a record.
* @param {number} idVotation - The ID of the vote (votation) to which the record belongs.
* @param {number} idOption - The ID of the option associated with the record.

*/
export const deleteOption = async (req, res) => {
  try {
    const activeVotation = await VotationModel.findOne({
      where: { idVotation: req.body.idVotation, is_active: 1, is_closed: 1 }
    });
    if (activeVotation) {
      res.json("Action not allowed while votation is running")
    } else {
      await IdentificationModel.destroy({
        where: {
          idOption: req.body.idOption,
          idVotation: req.body.idVotation
        }
      })
      res.json("Register deleted Succesfully");
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Function that, given an idVotation, returns all the options that are participating in that vote.
 * @param {number} idVotation - The ID of the vote (votation) to which the record belongs. 
 */
export const getAllOptionsFromVotation = async (req, res) => {
  try {
    const options = await IdentificationModel.findAll({
      attributes: ['option_id'],
      include: [
        {
          model: OptionModel,
          attributes: ['idOption', 'title', 'description'],
        },
      ],
      where: { idVotation: req.params.idVotation }

    });
    const formattedResult = options.map((option) => ({
      idOption: option.OPTION.idOption,
      title: option.OPTION.title,
      description: option.OPTION.description
    }))
    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/** 
 * Function that, given an idVotation return the option that in that votation has de option_id value.
 * @param {number} idVotation - The ID of the vote (votation) to which the record belongs.
 * @param {number} option_id - The ID of the option in the idVotation.
*/
export const getOptionFromOptionId = async (req, res) => {
  try {
    const options = await IdentificationModel.findAll({
      attributes: ['option_id'],
      include: [
        {
          model: OptionModel,
          attributes: ['idOption', 'title', 'description'],
        },
      ],
      where: {
        idVotation: req.params.idVotation,
        option_id: req.params.option_id
      }

    });

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getOptionsFromCurrentVotation = async (req, res) => {
  try {
    const result = await IdentificationModel.findAll({
      attributes: ['option_id'],
      include: [
        {
          model: VotationModel,
          attributes: [],
          where: { is_active: 1, is_closed: 1 },
        },
        {
          model: OptionModel,
          attributes: ['title', 'description'],
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOptionsFromVotation = async (req, res) => {
  try {
    const result = await IdentificationModel.findAll({
      attributes: ['option_id'],
      include: [
        {
          model: VotationModel,
          attributes: [],
          where: { idVotation: req.params.idVotation },
        },
        {
          model: OptionModel,
          attributes: ['title', 'description'],
        },
      ],
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNumOptionsFromCurrentVotation = async (req, res) => {
  try {
    const count = await IdentificationModel.count({
      include: [
        {
          model: VotationModel,
          where: { is_active: 1, is_closed: 1 },
        },
        {
          model: OptionModel,
        },
      ],
    });

    res.json({ count }); // Enviar el conteo como respuesta JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

