# Eve Net-Worth Calculator   

## This Application is an entry for the Eve Online API competition   

## Description - The goal for this application is to calculate a player's net-worth, by adding up the characters wallet balance plus assets.  All assets are valued based on crest-public api call by using average price or adjusted price.  The value is then shown to the user.     

### Future Vision - We would like to show the EVE map and highlight where the player's value is located.  The map would be interactive so you could see which system has the most value.  Anoter future goal would be to share net-worth between player's contact list.    

#### Project Details - We started the entire project from scratch, including the writing a library to communicate with crest and old xml api calls.  We implemeneted oauth and a few end-points for crest and xml api.  I would like to extract this api library for other node developers to use.  The application's backend is writen using nodejs with Express framework.  It is using SequalizeJS and MariaDB as a simple datastore.  

#### Demo Server - 

#### Vargrant Server - Included in the project is a VagrantFile.  It bascially setup a simple development environment for you.  However, you still need to install a DB server and create an inital database.  


