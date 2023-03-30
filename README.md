# eServices Admin Bot
The admin discord bot for eServices, available for only certain nations to access. Used to interact with documents!

## Setting it up
1. Clone this repo
2. `cd` into the folder
3. Type `npm install`
4. Create a file named `config.json` in the same folder
5. Here's an example for that file:
```json
{
    "token": "DISCORD BOT TOKEN",
    "clientid": "DISCORD BOT ID",
    "apitoken": "ESERVICES API TOKEN",
    "approvedguildid": ["ID OF AN APPROVED DISCORD SERVER"],
    "country": "COUNTRY NAME",
    "apiurl": "URL TO THE ESERVICES API"
}
```
6. Run `node deployCommands.js`
7. Finally, start the bot: `node main.js`