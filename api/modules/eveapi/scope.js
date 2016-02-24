/* The first scope released. It allows access to live market orders data for any region.
   CCP FoxFour has said that this data will probably moved to Public CREST soon, so this
  scope may well become deprecated. */
CREST_SCOPEPUBLICDATA = 'publicData';

//Allows access to reading your character's contacts.
CREST_SCOPE_CHARCONTRACTREAD = 'characterContactsRead';

//Allows access to create and update your character's contacts.
CREST_SCOPE_CHARCONTRACTWRITE = 'characterContactsWrite';

//Allows an application to read all of the saved fits for a character.
CREST_SCOPE_CHARFITTINGSREAD = 'characterFittingsRead';

//Allows an application to create new saved fits as well as delete existing ones.
CREST_SCOPE_CHARFITTINGSWRITE = 'characterFittingsWrite';

//Allows an application to read your character's current location.
CREST_SCOPE_CHARLOCATIONREAD = 'characterLocationRead';

//Allows an application to set your auto-pilot waypoints on your client.
CREST_SCOPE_CHARNAVWRITE = 'characterNavigationWrite';
