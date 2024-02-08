import express from "express";
import { createVotation, getCurrentVotation, getVotations, removeVotation, setActive, setClosed } from "../controllers/VotationController.js";
import { getAllOptions, insertOption, removeOption } from "../controllers/OptionController.js";
import { deleteOption, getAllOptionsFromVotation, getNumOptionsFromCurrentVotation, getOptionFromOptionId, getOptionsFromCurrentVotation, getOptionsFromVotation, insertRegister } from "../controllers/IdentificationController.js";
import { deleteVotes, getNumVotesFromOptionVotation, getNumVotesFromVotation, getVotesCurrentVotation, getVotesFromVotation, insertVote } from "../controllers/VoteContoller.js";

const router = express.Router();
// Routting votation

router.get('/getAllVotations', getVotations);
router.post('/createVotation', createVotation);
router.post('/closeVotation', setClosed)
router.post('/activeVotation', setActive)
router.get('/getCurrentVotation', getCurrentVotation);
router.delete('/dropVotation/:id', removeVotation)

// Routting option
router.post('/insertOption', insertOption);
router.delete('/dropOption/:id', removeOption);
router.get('/getAllOptions', getAllOptions);

// Routting identification
router.post('/identificationOption', insertRegister);
router.post('/deleteOptionFromVotation', deleteOption);
router.get('/getAllOptionsFromVotation/:idVotation', getAllOptionsFromVotation);
router.get('/getFromOptionId/:idVotation/:option_id', getOptionFromOptionId);
router.get('/getOptionsCurrentVotation', getOptionsFromCurrentVotation);
router.get('/getOptionsFromVotation/:idVotation', getOptionsFromVotation);
router.get('/getNumOptionsFromCurrentVotation', getNumOptionsFromCurrentVotation);


// Routting Voto
router.post('/vote', insertVote);
router.get('/getVotesFromVotation/:idVotation', getVotesFromVotation)
router.get('/getNumVotesFromOptionVotation/:idVotation/:idOption', getNumVotesFromOptionVotation);
router.get('/getcurrentVotes', getVotesCurrentVotation)
router.get('/getNumVotesFromVotation/:idVotation', getNumVotesFromVotation);
router.delete('/deleteVotes/:idVotation', deleteVotes);
export default router;