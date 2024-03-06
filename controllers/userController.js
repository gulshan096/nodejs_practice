import {User} from '../models/userModel.js';
import crypto from 'crypto';
import axios from 'axios';
// import {redirect} from 'react-router-dom';

export const registerUser = async (req, res) => {
    try {
        const userData = new User(req.body);
        if (!userData) {
            return res.status(404).json({ status: 0, msg: 'empty data' });
        }
    
        const email_exist = await User.findOne({'email': userData.email})
        const mobile_exist = await User.findOne({'mobile': userData.mobile})

        if(email_exist){
            return res.status(200).json({ status: 0, msg: '!Oops '+userData.email+' already exist' });
        }
        else if(mobile_exist){
            return res.status(200).json({ status: 0, msg: '!Oops '+userData.mobile+' already exist' });
        }
        await userData.save();
        res.status(200).json({ status: 1, msg: 'registration successfully.' });
    } catch (error) {
        res.status(500).json({ status: 0, msg: 'something went wrong', error: error });
    }
}

export const getAllUser = async (req, res) => {

    try {
        const userData = await User.find();
        if (!userData) {
            return res.status(404).json({ status: 0, msg: 'No user register.' });
        }
        res.status(200).json({ status: 1, msg: 'user get successfully.', data: userData });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ status: 0, msg: 'something went wrong.' });
    }
}


export const getOneUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById();
        if (!userExist) {
            return res.status(404).json({ msg: 'user not exist' });
        }
        res.status(200).json(userExist);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const updateUser = async (req, res) => {

    try {
        const { _id } = req.body;
        const userExist = await User.findById(_id);

        if (!userExist) {
            return res.status(404).json({ msg: 'user not exist' });
        }
        const updateData = await User.findByIdAndUpdate(_id, req.body, { new: true });

        return res.status(200).json({ status: 1, msg: 'user updated successfully.'});

    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ msg: 'user not exist' });
        }
        const deletedData = await User.findByIdAndDelete(id);
        return res.status(200).json({ status: 1, msg: 'user deleted successfully.'});

    } catch (error) {
        console.log(error);
    }
}

export const phonepePayment = async (req, res) => {

    try {
        const { name, mobile, amount } = req.body
        const merchantId = "PGTESTPAYUAT";
        const merchantTransactionId =  "MT7850590068188104";
        const data = {
            "merchantId": merchantId,
            "merchantTransactionId": merchantTransactionId,
            "merchantUserId": "MUID123",
            "name": name,
            "amount": amount * 100,
            "redirectUrl": 'http://localhost:8000/api/response/',
            "redirectMode": 'POST',
            "callbackUrl": "http://localhost:8000/api/response",
            "mobileNumber": mobile,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + saltKey
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

        const options = {
            method: 'post',
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };
            axios.request(options).then(function (response) {

                const redirectTo = response.data.data.instrumentResponse.redirectInfo.url;
                return res.status(200).send(redirectTo);
            })
            .catch(function (error) {
                console.error(error);
            });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
}

export const response = async (req, res) => {
    
    // const data = res.req.body;
    const merchantTransactionId = res.req.body.transactionId;
    const merchantId = res.req.body.merchantId;
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = crypto.createHash('256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    console.log(checksum);

    const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    const options = {
        method: 'GET',
        url: URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        },
    };
    axios.request(options).then(function (response) {
        if (response.data.success === true) {
            // console.log(response.data)
            return res.redirect('http://localhost:3000/success');
            // return res.status(200).send({success: true, message:"Payment Success"});
            } else {

                return res.redirect('http://localhost:3000/failure');
            // return res.status(400).send({success: false, message:"Payment Failure"});
            }
    })
    .catch(function (error) {
        console.error(error);
    });
}

export const gMap = async(req, res)=> {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Danganiya&types=address&key=AIzaSyAvczQH2_uIOGDXy2pRIpCUiDUnRd_OU60',
      headers: { }
    };
    
    axios.request(config).then((response) => {
    //   console.log(JSON.stringify(response.data));
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    
}
