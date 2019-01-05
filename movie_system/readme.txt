This is the document for the HW1.
Team members are Xuewei Fan(xf2166) and Zirui Tan(zt2219)

Github url of our project is :https://github.com/zazha123/COMS6998



For the front end.
    We use bootstrap and jQuery.And we use jQuery to take POST request and get the data from the api.

For the back end,
    1.
        We use the endpoin which Amazon gives us as https://legcetlrhj.execute-api.us-east-2.amazonaws.com/dev/chatbot.
    2.
        We use the json format which the API document specifies, but some of the elements in it are useless now, so we don't use them now.
    3.
        We use a simple lambda function, the example for the conversation between human and the bot is as follow:
            1.human: hello!
              bot: okok 
            2.human:how are you?
              bot:I'm fine, thank you and you?
            3.human: others except the above two.
              bot:I want to kill fxw. 
    4.
        We implement the api key for the apigateway.
        
	