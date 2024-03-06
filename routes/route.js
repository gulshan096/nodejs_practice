import express from 'express';
import {getAllUser, registerUser,getOneUser, updateUser,phonepePayment, response, gMap ,deleteUser} from '../controllers/userController.js';
import { createBooking, getAllBooking } from '../controllers/bookingController.js';

const route = express.Router();

route.post("/register", registerUser);
route.get("/user_list", getAllUser);
route.get("/getone_user/:id", getOneUser);
route.get("/delete_user/:id", deleteUser);
route.post("/update_user", updateUser);
route.post("/phonepe/payment", phonepePayment);
route.post("/response", response);
route.get("/gmap", gMap);


route.post('/create_booking',createBooking)
route.get('/booking_list',getAllBooking)

export default route;