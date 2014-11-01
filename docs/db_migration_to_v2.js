// MIGRATION FROM OLD SCHEMA
var dbName = "test1";
// Check if the collections exists, if not, I create an empty one on the db
checkExistingCollection("document");
checkExistingCollection("category");
checkExistingCollection("client");
checkExistingCollection("user");

db.users.find().forEach(function(user){
    // Copy all the documents into the new collection
    user.documents.forEach(function(document){
        db.document.insert({
            categoryId  :document.categoryId,
            clientId    :document.clientId,
            isComplete  :document.isComplete,
            title       :document.title,
            body        :document.body,
            creationDate:document.creationDate,
            modificationDate: document.modificationDate,
            userId      :user._id
        });
    });
    // Now it's the client turn
    user.clients.forEach(function(client){
        db.client.insert({
            name: client.name,
            vatNumber: client.vatNumber,
            creationDate: client.creationDate,
            modificationDate: client.modificationDate,
            userId: user._id
        });
    });
    // And categories
    user.categories.forEach(function(category){
        db.category.insert({
            name:    category.name,
            color:  category.color,
            order:  category.order,
            userId: user._id
        });
    });

});

function checkExistingCollection(collectionName){
    var exist = db.system.namespace.find( { name: dbName + collectionName } );
    if(exist == null){
        db.createCollection("collectionName");
    }
}

db.users.update(
    {},
    {$unset: { documents:"", clients:"", categories:""}},
    {multi:true}
)

db.users.find().forEach(function(user){
    if( user.local != null ) {
        db.user.insert({
            email: user.local.email,
            password: user.local.password,
            activationCode: user.local.activationCode,
            active: user.local.active,
            showComplete: user.showComplete,
            _id: user._id
        });
    }
});

db.users.drop();
