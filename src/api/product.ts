import express from "express";
import {createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
  uploadProductImage,
} from "../application/product";

import isAuthenticated from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(isAuthenticated, isAdmin, createProduct);

productRouter
  .route("/:id")
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteProductById);

productRouter
  .route("/images")
  .post(uploadProductImage);
  

export default productRouter;
