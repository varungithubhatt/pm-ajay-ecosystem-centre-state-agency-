import Scheme from "../models/scheme.model.js";


export const createScheme=async(req,res)=>{

    try{

        const{ name,stateUT,village,description,category,launchDate,guidelines,eligibilityCriteria,deadline}=req.body
        if(!name||!description||!category){
            return res.status(400).json({message:"all fields are required"})
        }
    //    if(req.user.role=="CENTRE"){
    //     return res.status(403).json({message:"Only Centre officials can create schemes"})
    //    }
        const newScheme=new Scheme({ 
            
            name,stateUT,village,description,category,launchDate,guidelines,eligibilityCriteria,deadline,
            createdBy:req.user.userId
        })

       
        await newScheme.save()
        return res.status(201).json({message:"Scheme created successfully",data:newScheme})

    }catch(err){
return res.status(500).json({message:err.message})
    }

}

export const getAllSchemes=async(req,res)=>{
    try{
        const schemes=await Scheme.find().populate("createdBy","name email role designation") .sort({ createdAt: -1 });
        return res.status(200).json({data:schemes})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getSchemeById=async(req,res)=>{
    try{
        const {id}=req.params
        const scheme=await Scheme.findById(id).populate("createdBy","name email role designation")
        if(!scheme){
            return res.status(404).json({message:"Scheme not found"})
        }
        return res.status(200).json({data:scheme})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const updateScheme=async(req,res)=>{
    try{
       const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid scheme ID" });
    }

    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    // Role-based access control
    if (req.user.role !== "CENTRE" && scheme.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not allowed to update this scheme" });
    }

    // Update the scheme
    Object.assign(scheme, req.body);
    await scheme.save();

    return res.status(200).json({ message: "Scheme updated successfully", data: scheme });

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const deleteScheme=async(req,res)=>{
    try{
        const {id}=req.params
        const scheme=await Scheme.findById(id)
        if(!scheme){
            return res.status(404).json({message:"Scheme not found"})
        }
        if(req.user.role!=="CENTRE" && scheme.createdBy.toString()!==req.user.userId){
            return res.status(403).json({message:"You are not allowed to delete this scheme"})
        }
        await scheme.deleteOne()
        return res.status(200).json({message:"Scheme deleted successfully"})


    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

