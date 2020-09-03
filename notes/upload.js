/**
 * Author: zhaojian
 * Date: 2019-12-24 15:44:28
 * LastEditors: zhaojian
 * LastEditTime: 2019-12-24 15:44:28
 * Description: 校验方法
 */

import { message } from 'antd';

/*判断上传状态*/
function uploadStatus(info) {
  if (!!info) {
    if (info.status === 'done' && info.response.errorCode === 0) {
      message.success(`${info.name}上传成功`);
    }
    if (info.status !== 'uploading' && info.response && info.response.errorCode !== 0) {
      message.error(
        info && info.response && info.response.errorMessage
          ? info.response.errorMessage
          : `${info.name}上传失败`
      );
      return false;
    }
    if (info.status === 'error') {
      message.error(
        info && info.response && info.response.errorMessage
          ? info.response.errorMessage
          : `${info.name}上传失败`
      );
      return false;
    }
  }
  return true;
}

/*取出不符合文件类型的文件*/
function deleteNotAllow(array, fileTypeArr) {
  for (let i = 0; i < array.length; i++) {
    //判断当前文件是否是允许类型
    if (
      (array[i].url || array[i].name) &&
      !window.checkFileType(array[i].url || array[i].name, fileTypeArr)
    ) {
      array.splice(i, 1);
    }
  }
  return array;
}

/*
 * 校验文件类型
 * @parma {string} fileName 文件名(包含后缀)
 * @parma {array} fileTypeArr 可允许的后缀类型数组(例如["png", "jpg", "jpeg" ,"gif"])
 * @return {boolean}  是否是符合要求的文件类型 是true/否false
 */
window.checkFileType = function(fileName, fileTypeArr) {
  //取到最后一个'.'出现的位置(最后一个'.'后面即是文件类型)
  const lastPointIndex = fileName.lastIndexOf('.');
  const suffix = fileName.substr(lastPointIndex + 1);
  //获取导入文件的文件类型
  if (lastPointIndex > -1 && fileTypeArr.includes(suffix)) {
    return true;
  }
  return false;
};

/*表单提交时处理单个图片上传*/
window.dealPic = function(item) {
  if (window.checkType('Array', item)) {
    if (item[0] && item[0].url) {
      return item[0].url;
    } else if (
      item[0] &&
      item[0].response &&
      item[0].response.errorCode === 0 &&
      item[0].response.data[0]
    ) {
      return item[0].response.data[0];
    }
    return '';
  }
  return '';
};

/*上传状态来操作Upload*/
window.picNormalize = function(e, fileTypeArr) {
  if (Array.isArray(e)) {
    //如果有文件限制则进入文件限制筛选
    if (window.checkType('Array', fileTypeArr) && fileTypeArr.length > 0 && e.length > 0) {
      return deleteNotAllow(e, fileTypeArr);
    }
    return e;
  }
  if (window.checkType('Object', e) && window.checkType('Array', e.fileList)) {
    //如果有上传文件类型的限制
    if (window.checkType('Array', fileTypeArr) && fileTypeArr.length > 0) {
      //如果当前上传文件符合上传文件类型
      if (window.checkFileType(e.file.url || e.file.name, fileTypeArr)) {
        //如果上传多张则每次都应处理数组的最后一个元素 所以这里是e.fileList[e.fileList.length - 1]
        return uploadStatus(e.fileList[e.fileList.length - 1]) ? e.fileList : [];
      } else {
        //当前文件类型不符合指定类型，遍历删除不符合类型的元素
        return deleteNotAllow(e.fileList, fileTypeArr);
      }
    }
    return uploadStatus(e.fileList[e.fileList.length - 1]) ? e.fileList : [];
  }
  return [];
};

/**
 * 上传图片前图片类型解析
 * @param {object} props 各种参数
 * @param {string} props.type 上传文件类型('image', 'xls', 'audio'...)
 * @param {array} props.allowType 自定义允许上传的文件后缀数组(一般用于表单上展示xx,yy文件可上传,仅做文案展示用),如果不传则显示默认
 * @param {number} props.size 最大上传文件的体量,如果不传则显示默认
 * @param {string} props.unit 最大上传文件的体量的单位,如果不传则显示默认
 */
window.UploadFileParams = function(props = {}) {
  const commonProps = {
    allowType: [],
    accept: '',
    size: 2,
    unit: 'M',
  };
  const fileType = {
    image: {
      allowType: ['png', 'jpg', 'jpeg'],
      accept: 'image/jpg, image/jpeg, image/png',
    },
    xls: {
      allowType: ['xls', 'xlsx'],
      //			accept : '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      accept:
        'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    audio: {
      allowType: ['mp3'],
      accept: 'audio/mpeg',
    },
  };
  const type = props.type;
  this.allowType =
    props.allowType || (fileType[type] && fileType[type].allowType) || commonProps.allowType;
  this.accept = props.accept || (fileType[type] && fileType[type].accept) || commonProps.accept;
  this.size = props.size || (fileType[type] && fileType[type].size) || commonProps.size;
  this.unit = props.unit || (fileType[type] && fileType[type].unit) || commonProps.unit;
};
