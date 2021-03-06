const fs            = require('fs'),
      nameTable     = require('./tableName'),
      postTable     = require('./tablePost'),
      os2Table      = require('./tableOS2');

function ttfInfo(data) {
  try {
    const names = nameTable(data);

    const info = {
      tables: {
        name: names,
        platform: {
          unicode:   names.unicode,
          macintosh: names.macintosh,
          microsoft: names.microsoft
        },
        post: postTable(data),
        'OS/2': os2Table(data)
      }
    };

    return info;
  }
  catch(e) {
    // console.error(String(e));
    throw ("Error reading ttf: " + String(e));
  }
}

module.exports = function() {};

module.exports = {
    get: function(pathOrData, cb) {
        var getData = (pathOrData instanceof Buffer) ?
        function(data, cb) { cb(null, data); } : fs.readFile;

      getData(pathOrData, function(err, data) {
        if (err) return cb(pathOrData + ' not found.');
        try {
          var info = ttfInfo(data);
          cb(null, info);
        } catch(err) {
          cb(err);
        }
      });
    },
    getSync: function(pathOrData) {
        var data;
        if (pathOrData instanceof Buffer) {
            data = pathOrData;
        } else {
            try {
                data = fs.readFileSync(pathOrData);
            } catch(e) {
                throw new Error(e);
            }
        }
        return ttfInfo(data);
    }
};
