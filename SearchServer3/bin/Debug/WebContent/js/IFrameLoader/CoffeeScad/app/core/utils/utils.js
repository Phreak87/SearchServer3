(function() {
  define(function(require) {
    var extend, getBlobBuilder, getWindowURL, merge, revokeBlobUrl, textToBlobUrl;
    getBlobBuilder = function() {
      bb;
      var bb;
      if (window.BlobBuilder) {
        bb = new window.BlobBuilder();
      } else if (window.WebKitBlobBuilder) {
        bb = new window.WebKitBlobBuilder();
      } else if (window.MozBlobBuilder) {
        bb = new window.MozBlobBuilder();
      } else {
        throw new Error("Your browser doesn't support BlobBuilder");
      }
      return bb;
    };
    getWindowURL = function() {
      if (window.URL) {
        return window.URL;
      } else if (window.webkitURL) {
        return window.webkitURL;
      } else {
        throw new Error("Your browser doesn't support window.URL");
      }
    };
    textToBlobUrl = function(txt) {
      var blob, blobURL, windowURL;
      windowURL = getWindowURL();
      blob = new Blob([txt]);
      blobURL = windowURL.createObjectURL(blob);
      if (!blobURL) {
        throw new Error("createObjectURL() failed");
      }
      return blobURL;
    };
    revokeBlobUrl = function(url) {
      if (window.URL) {
        return window.URL.revokeObjectURL(url);
      } else if (window.webkitURL) {
        return window.webkitURL.revokeObjectURL(url);
      } else {
        throw new Error("Your browser doesn't support window.URL");
      }
    };
    merge = function(options, overrides) {
      return extend(extend({}, options), overrides);
    };
    extend = function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    };
    return {
      "getBlobBuilder": getBlobBuilder,
      "getWindowURL": getWindowURL,
      "textToBlobUrl": textToBlobUrl,
      "revokeBlobUrl": revokeBlobUrl,
      "merge": merge,
      "extend": extend
    };
  });

}).call(this);
