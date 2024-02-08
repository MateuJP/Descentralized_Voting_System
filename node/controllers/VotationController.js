import VotationModel from "../models/VotationModel.js";
import { Sequelize } from "sequelize";



export const getVotations = async (req, res) => {
  try {
    const result = await VotationModel.findAll({
      attributes: ['idVotation', 'name_votation']
    })
    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}

/**
 * Function that creates a new Votation, first need to put all others votations as no active.
 * @param {String} name_votation - The name of the Votation
 * @param {Date} date_creation - The creation date of the Votation.
 * @param {number} is_active - Whether the Votation is active (1 by default).
 * @param {number} is_closed - Whether the Votation is closed (0 by default).
 */
export const createVotation = async (req, res) => {
  try {
    await VotationModel.update(
      { is_active: 0 },
      { where: { is_active: 1 } }
    )
    await VotationModel.create(req.body);
    res.json("Votation Created Successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Function that removes a Votation.
 * @param {number} idVotation - The ID of the Votation to be removed.
 */
export const removeVotation = async (req, res) => {
  try {
    await VotationModel.destroy({
      where: { idVotation: req.params.id }
    });
    res.json("Votation deleted Successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Function that sets the 'is_closed' status of a Votation.
 * @param {number} idVotation - The ID of the Votation to update.
 * @param {number} is_closed - The new 'is_closed' status (0 or 1).
 */
export const setClosed = async (req, res) => {
  try {
    const votationId = req.body.idVotation;
    const isClosed = req.body.is_closed;

    const [updatedRowCount] = await VotationModel.update(
      { is_closed: isClosed },
      {
        where: { idVotation: votationId },
      }
    );

    if (updatedRowCount > 0) {
      res.json(`The vote has been marked as ${isClosed ? 'closed' : 'not closed'}`);
    } else {
      res.status(404).json({ message: 'Votation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Function that sets the 'is_active' status of a Votation.
 * @param {number} idVotation - The ID of the Votation to update.
 * @param {number} is_active - The new 'is_active' status (0 or 1).
 */
export const setActive = async (req, res) => {
  try {
    const votationId = req.body.idVotation;
    const isActive = req.body.is_active;

    const [updatedRowCount] = await VotationModel.update(
      { is_active: isActive },
      {
        where: { idVotation: votationId },
      }
    );

    if (updatedRowCount > 0) {
      res.json({ message: `The vote has been marked as ${isActive ? 'active' : 'not active'}` });
    } else {
      res.status(404).json({ message: 'Votation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Function that retrieves the current Votation based on 'is_active' and 'is_closed' status.
 */
export const getCurrentVotation = async (req, res) => {
  try {
    const resultado = await VotationModel.findOne({
      where: {
        is_active: 1,
        [Sequelize.Op.or]: [{ is_closed: 0 }, { is_closed: 1 }],
      },
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};