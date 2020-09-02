const db = require( '../models' );

module.exports = {
    findAll: function( req, res ) {
        db.User
            .find( req.query )
            .select( [ '-password','-email' ] )
            .populate( 'likesCount' )
            .populate( 'commentsCount' )
            .populate( 'artworksCount' )
            .sort( { email: 1 } )
                .then( dbModel => res.json( dbModel ) )
                .catch( err => res.status( 422 ).json( err ) );
    },
    findById: function( req, res ) {
        let lSelectField = [ '-password', '-email'];
        if ( req.user && req.user._id === req.params.id ){
            lSelectFields = [ '-password' ];
        }
        db.User
            .findById( req.params.id )
            .select( lSelectFields )
            .populate( 'likesCount' )
            .populate( 'commentsCount' )
            .populate( 'artworksCount' )
                .then( dbModel => res.json( dbModel ) )
                .catch( err => res.status( 422).json( err ) );
    },
    create: function( req, res ) {
        let lRequestBody = { ...req.body };
        if ( lRequestBody.type !== 'user') {
            if ( !req.user || !req.user.type === 'admin'){
                lRequestBody.type = 'user';
            }
        }
        db.User
            .create( lRequestBody )
                .then( dbModel => res.json( dbModel ) )
                .catch( err => res.status( 422 ).json( err ) );
    },
    update: function( req, res ) {
        let lRequestBody = { ...req.body };
        if ( lRequestBody. type !== 'user' ) {
            if ( !req.user || !req.user.type === 'admin' ){
                lRequestBody.TYPE = 'user';
            }
        }
        if ( req.user ){
            if ( req.user._id === req.params.id || req.user.type === 'admin' ){
        db.User
            .findOne( { _id: req.params.id } )
                .then( dbModel => {
                    dbModel.set( lRequestBody );
                    console.log( dbModel );
                    return dbModel.save ();
                } )
                .then( dbModel => res.json( dbModel ) )
                .catch( err => res.status( 422 ).json( err ) );
            } else {
                return res.status( 403 ).json( {
                    error: 'Forbidden'
                } );
            }
        } else {
            return res.status( 401 ).json( {
                error: 'Unauthorized'
            } );
        }
    },
    remove: function( req, res ) {
        if ( req.user ) {
            if ( req.user._id === req.params.id || req.user.type === 'admin' ){
        
                db.User
                    .findById( { _id: req.params.id } )
                    .then( dbModel => dbModel.remove() )
                        .then( dbModel => res.json( dbModel ) )
                        .catch( err => res.status( 422 ).json( err ) );
            } else {
                return res.status( 403 ).json( {
                    error: 'Forbidden'
                } );
            }
        } else {
            return res.status( 401 ).json( {
                error: 'Unauthorized'
            } );
        } 
    }
};
