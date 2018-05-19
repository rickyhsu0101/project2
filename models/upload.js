const orm = require('./orm.js');
const uploadRule = [
  'fileId INT AUTO_INCREMENT',
  'fileName VARCHAR(255) NOT NULL',
  'uploadTime BIGINT',
  'fileType VARCHAR(255) NOT NULL',
  'public BOOL DEFAULT true',
  'PRIMARY KEY(fileId)'
];
const upload = {
  createGroupUploadTable: function(groupId, cb) {
    orm.createTable('group_' + groupId + '_upload', uploadRule, function(err, result) {
      cb(err, result);
    });
  },
  addFile: function(id, fileName, fileType, modelType, cb) {
    const time = fileName.split('-')[1].split('.')[0];
    const values = {
      fileName: fileName,
      uploadTime: time,
      fileType: fileType
    };
    orm.insertOneWithoutParams(modelType + '_' + id + '_upload', values, function(err, result) {
      cb(err, result);
    });
  },
  createUserUploadTable: function(userId, cb) {
    orm.createTable('user_' + userId + '_upload', uploadRule, function(err, result) {
      cb(err, result);
    });
  },
  getFileByType: function(id, modelType, fileType, cb) {
    const values = {
      fileType: fileType
    };

    orm.selectAllParam(modelType + '_' + id + '_upload', values, function(err, result) {
      cb(err, result);
    });
  },
  updateAvatar: function(id, modelType, fileType, fileName, cb) {
    upload.getFileByType(id, modelType, fileType, function(err, result) {
      if (result.length == 0) {
        upload.addFile(id, fileName, fileType, modelType, function(err, result) {
          cb(err, result);
        });
      } else {
        const where = {
          fileType: fileType
        };
        const values = {
          fileName: fileName
        };
        orm.updateSingleRow(modelType + '_' + id + '_upload', values, where, function(err, result) {
          cb(err, result);
        });
      }
    });
  }
};
module.exports = upload;
