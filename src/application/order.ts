import { NextFunction, Request, Response } from "express";
import Address from "../infrastructure/db/entities/Address";
import Order from "../infrastructure/db/entities/Order";
import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";
import { populate } from "dotenv";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const { userId } = getAuth(req);

    const address = await Address.create(data.shippingAddress);
    const order = await Order.create({
      addressId: address._id,
      items: data.orderItems,
      userId: userId,
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = "123";

    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId;

    let query = {};
    if (userId) {
      query = { userId };
    }

    const orders = await Order.find(query)
      .populate({
        path: "items.product",
        select: "name image",
      })
      .populate("addressId"); 

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderCounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ordersPerDay = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = ordersPerDay.map((d) => ({
      date: d._id,
      orders: d.orders,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};


export { createOrder, getOrder, getAllOrders, getOrderCounts };

