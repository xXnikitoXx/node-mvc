# Node MVC

## Installation
After cloning type ```npm install``` to download all required packages.

## Commandline arguments
* **inject** - Inserts JSON files in the database.
> Usage: ```npm start inject [default/collection1] [-/pattern1] [-/file1] [collectionN] [patternN] [fileN]```\
> Examples:
> ```npm start inject default``` - this will insert all files mentioned in (data/injectorsettings.json)\
> ```npm start inject languages_home {"lang":"en","content":$content} /data/lang/home/en.json``` - this renders [en.json](data/lang/home/en.json) into the given object and then inserts it in ```languages_home``` collection.

* **keep-alive** - Keeps the process running.
> When giving arguments the process will execute the commands and then kill itself.\
> To prevent this use ```npm start [args, args, args, ...] kepp-alive``` to continue running after the command execution.\
> **This argument must be in the end of the command, otherwise it won't work!**

* **create** - Create element.
> Usage: ```npm run create <type> <name> [description] [args depending on the type]```\
> Types: **controller**, **view**, **service**, **request**\
> Controller syntax: ```npm run create controller <name> "<description>" [request1] [request2]... [requestN]```\
> If you have created requests you can put their names as additional arguments and they will be added to the body of the controller.\
> Request example: ```npm run create request <name> <type(GET/POST/...)> [controller] [view]```\
> If a controller is present the request will be added to it and will render the given view.\
> View example: ```npm run create view <name> [request] [controller]```\
> Create a view and link it to request and/or controller. If the request is **null** it will be created and linked to the controller.\
> Service example: ```npm run create service <name> [controller]```\
> Create a service and import it in controller(if present).

* **remove** - Remove element.
> Usage: ```npm run remove [type] <name>```\
> Remove element by given type. The **type** argument is not necessary unless there are different elements with the same name.