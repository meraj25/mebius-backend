import Color from "../infrastructure/db/entities/Color";
import ValidationError from "../domain/errors/validation-error";
import { Request, Response, NextFunction } from "express";

const getAllColors = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    next(error);
  }
};

const createColor = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
  try {
    const  newColor  = req.body;
    if (!newColor.name) {
      throw new ValidationError("Name is required");
    }
    await Color.create(newColor);
    res.status(201).json(newColor);
  } catch (error) {
    next(error);
  }
};

export  {
  getAllColors,
  createColor
};