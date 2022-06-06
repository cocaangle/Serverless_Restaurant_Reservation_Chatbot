// set the focus to the input box
document.getElementById("message").focus();

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:326d7881-db18-4e28-86d1-d589c175e2a5',
});

var lexruntime = new AWS.LexRuntime();
var lexUserId = 'chatbot-demo' + Date.now();
var sessionAttributes = {};

function sendChat() {
    // if there is text to be sent...
    var userMessage = document.getElementById('message');
    if (userMessage && userMessage.value && userMessage.value.trim().length > 0) {

        // disable input to show we're sending it
        var wisdom = userMessage.value.trim();
        userMessage.value = '...';
        userMessage.locked = true;

        // send it to the Lex runtime
        var params = {
            botAlias: 'RestaurantBot',
            botName: 'restaurantBot',
            inputText: wisdom,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };
        showRequest(wisdom);
        lexruntime.postText(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                showError('Error: ' + err.message + ' (see console for details)')
            }
            if (data) {
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                // show response and/or error/dialog status
                showResponse(data);
            }
            // re-enable input
            userMessage.value = '';
            userMessage.locked = false;
        });
    }
}

function showRequest(userText) {
    let userHtml = '<p class="userText"><span>' + userText + '</span></p>';
    $("#message").val("");
    $("#conversation").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

function showError(errorText) {
    let userHtml = '<p class="errorText"><span>' + errorText + '</span></p>';
    $("#message").val("");
    $("#conversation").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

function showResponse(lexResponse) {
    let message = "Sorry, there is some issue on our bot. Please try again later.";
    if (lexResponse.message) {
        //if we got response from bot, change message to the response. otherwise it will return the error message.
        message = lexResponse.message;
    }
    let botHtml = '<p class="botText"><span>' + message + '</span></p>';
    $("#conversation").append(botHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

// Press enter to send a message
$("#message").keypress(function (e) {
    if (e.which == 13) {
        sendChat();
    }
});