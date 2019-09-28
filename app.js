const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// bodyparser middleware to pick data from form 
app.use(bodyParser.urlencoded({extended: true}));

//public assets folder 
app.use(express.static(path.join(__dirname, 'public')));

//signup route 
app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body; 

    //simple validation 
    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    const data = {
        members: [
            {
                email_address: email, 
                status: 'subscribed', 
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };

    const postData = JSON.stringify(data);


    const options = {
        url: "https://us4.api.mailchimp.com/3.0/lists/c91b9ddfc4",
        method: "POST",
        headers: {
            Authorization: 'auth c2270191a9d07f62a16aa0f73c3760c3-us4', 
            Accept: 'application/json', 
        }, 
        body: postData
    }
    //TODO: change datacenter to .env file
    //send data to mailchimp api 
    request(options, (err, response, body ) => {
        if(err){
            console.log(err)
            res.redirect('/fail.html');
        } else {
            console.log(response);
            if(response.statusCode === 200){
                console.log(response);
                res.redirect('/success.html');
            } else {
                res.redirect('/fail.html');
            }
        }
    })
})
const PORT = process.env.PORT || 5000; 

app.listen(PORT, console.log(`Server started on ${PORT}`));