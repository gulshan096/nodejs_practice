import {User, Booking} from '../models/userModel.js';

export const createBooking = async(req, res)=>{
    try{
        const bookingData =  new Booking(req.body)
        if(!bookingData){
            return res.status(200).json({'status':0,'msg':'empty data'})
        }
        await bookingData.save();
        res.status(200).json({ status: 1, msg: 'Car booked successfully.' });

    }catch(error){
        res.status(500).json({ status: 0, msg: 'something went wrong', error: error });
    }
}

export const getAllBooking = async (req, res) => {

    try {
        const userData = await Booking.find();
        if (!userData) {
            return res.status(404).json({ status: 0, msg: 'No user register.' });
        }

        console.log(userData);
        res.status(200).json({ status: 1, msg: 'booking get successfully.', data: userData });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ status: 0, msg: 'something went wrong.' });
    }
}