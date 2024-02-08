import OptionModel from "../models/OptionModel.js";

/**
 * Function that alows to insert a option
 * @param {*String} Title-> Title of the option  
 * @param {*String} description-> description of the option
 */

export const insertOption=async(req,res)=>{
    try{
        await OptionModel.create(req.body);
        res.json("Option created Succesfully");
    }catch(error){
        res.json({message : error.message});
    }
}

/**
 * Function that given an idOption remove that record
 * @param {*number} idOption -> identification of the option 
 */
export const removeOption=async(req,res)=>{
    try{
        await OptionModel.destroy({
            where : {idOption : req.params.id}
        });
        res.json("Option deleted succesfully");

    }catch(error){
        res.json({message : error.message});

    }
}
/**
 * Function that,given an idOption return that record
 * @param {*number} idOption -> identification of the option 
 */
export const getOption = async(req,res)=>{
    try{
        const result=OptionModel.findAll({
            where : {idOption : req.params.idOption}
        });
        res.json(result[0]);
    }catch(error){
        res.json({message : error.message});
    }
}

export const getAllOptions=async(req,res)=>{
    try{
        const result= await OptionModel.findAll({
            attributes : ['idOption','title']
        }
        );
        res.json(result);
    }catch(error){
        res.json({message : error.message});
    }
}