import "dotenv/config";
import connectDB from ".";
import Category from "./entities/Category";
import Product from "./entities/Product";
import stripe from "../stripe";



const seed = async () => {
  await connectDB();
  await Category.deleteMany({});
  await Product.deleteMany({});
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 