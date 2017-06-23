var flickrAPI = require('flickrapi');
var flickrTokens = {
    api_key: "5c677838fb2ce00e07d0058cdbf02e11"
};

var recentPhotos = [];
var photosCount = 50;
var searchTag = 'mountain';

function getRecentFlickrPhotos(callback) {
    flickrAPI.tokenOnly(flickrTokens, function (err, flickr) {
        flickr.photos.search({tags: searchTag, page: 1, per_page: photosCount}, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            var photos = result.photos.photo;
            var i = 0;
            photos.forEach(function (photo) {
                var title = photo.title;
                var link = composePhotoURL(photo.owner, photo.id);
                var src = composePhotoSrc(photo);
                populateTags(flickr, photo.id, function(tags) {
                    recentPhotos.push({
                        title: title,
                        link: link,
                        src: src,
                        tags: tags,
                        originalIndex: i++
                    });
                    if (recentPhotos.length == 50) {
                        callback();
                    }
                });
            });
        });
    });
}

function composePhotoURL(userID, photoID) {
    return 'https://www.flickr.com/photos/' + userID + '/' + photoID;
}

function composePhotoSrc(photo) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
}

function populateTags(flickr, photoID, callback) {
    flickr.photos.getInfo({photo_id: photoID}, function (err, result) {
        var rawTags = [];
        result.photo.tags.tag.forEach(function (tag) {
            rawTags.push(tag.raw);
        });
        tags = rawTags.join();
        callback(tags);
    });
}

module.exports = {
    getRecentFlickrPhotos: getRecentFlickrPhotos,
    recentPhotos: recentPhotos
}