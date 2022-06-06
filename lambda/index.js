var DBHandler = require("./DBHandler")

exports.handler = (event, context, callback) => {
    console.log('This event is ' + JSON.stringify(event))
    var intent = event.currentIntent.name;
    var storeloc = event.currentIntent.slots.Location;
    
    DBHandler.getRestaurantDetails(intent, function(err, data) {
        if (err) {
            context.fail(err);
        } else {
            let output = intent;
            if (intent == 'WorkingHours') {
                output = data.Item.message;
            } else if (intent == 'restaurantLocation') {
                output = data.Item.Slot[storeloc]
            } else {
                // var storeloc = event.currentIntent.slots.Location;
                var bookDate = event.currentIntent.slots.Date;
                var bookTime = event.currentIntent.slots.Time.split(':');
                var partySize = parseInt(event.currentIntent.slots.Size);
                
                if (parseInt(bookTime[0])<9 || parseInt(bookTime[0]) >21) {
                    output = 'Sorry, we are closed at that time. Our open hour is 9:00 to 21:00, please make a new reservation.'
                } else{
                    if (data.Item.Slot[storeloc]['capacity']-data.Item.Slot[storeloc]['reserved'] < partySize) {
                        output = 'Sorry, we don\'t have enough seats for this reservation. Please make a new reservation.'
                    } else {
                    
                        output = "Okay, your table for " + partySize +" people will be ready on " + bookTime[0] + ":" + bookTime[1] + " at " + bookDate + ".\nThe address is " + data.Item.Slot[storeloc]['address'] + ". Thank you!"
                    }
                }
            }
        
            var response = {
                "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                        "contentType": "PlainText",
                        "content": output
                    }
                }
            }
            callback(null, response);
        }
    });
    
};