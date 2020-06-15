# Node MVC

## Installation
After cloning type ```npm install``` to download all required packages.

## Commandline arguments
* **inject** - Inserts JSON files in the database.

> Usage: ```npm start inject [default/collection1] [-/pattern1] [-/file1] [collectionN] [patternN] [fileN]```
> Examples:
> ```npm start inject default``` - this will insert all files mentioned in (data/injectorsettings.json)
> ```npm start inject languages_home {"lang":"en","content":$content} /data/lang/home/en.json``` - this renders [en.json](data/lang/home/en.json) into the given object and then inserts it in ```languages_home``` collection.
* **keep-alive** - Keeps the process running.
> When giving arguments the process will execute the commands and then kill itself.
> To prevent this use ```npm start [args, args, args, ...] kepp-alive``` to continue running after the command execution.
> **This argument must be in the end of the command, otherwise it won't work!**
