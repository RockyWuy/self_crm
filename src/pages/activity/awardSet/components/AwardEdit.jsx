/*
 * @author yhwu
 * Date at 2018/10/26
 * 页面组件
 */
import React from 'react';
import { connect } from 'dva';
import { message, Modal, Spin, Form, Button, Input, InputNumber, Select, Upload, Icon } from 'antd';
//import styles from './AwardEdit.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

function AwardSetPage({ dispatch, awardEdit, form }) {
  let {
    namespace,
    awardTypeSels, //奖品类型 下拉

    editInfo, //编辑详情
    visible, //表单显隐
    loading,
  } = awardEdit;

  let { getFieldDecorator, validateFieldsAndScroll, getFieldValue, resetFields } = form;

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div>上传</div>
    </div>
  );

  // 上传图片
  function normFileImage(e, size) {
    if (Array.isArray(e)) {
      return e;
    }
    let fileList = (e && e.fileList) || [];
    let file = fileList[0];
    if (file) {
      let imgTypeList = (!!file.name && file.name.split('.')) || [];
      let imgType = (imgTypeList.length > 1 && imgTypeList[imgTypeList.length - 1]) || ''; // 文件类型
      let supportTypeList = ['jpg', 'jpeg', /*'gif',*/ 'png']; // 支持文件列表
      if (supportTypeList.indexOf(imgType) === -1) {
        message.error('图片格式错误');
        return [];
      }
      if (!!size && file.size > size * 1024 * 1024) {
        // 若文件大小存在上限 且文件大小超过上限则中止
        message.error('图片大小超过上限');
        return [];
      }
      if (!!file.response && file.response.errorCode !== 0) {
        message.error(`${file.name}上传失败`);
        return [];
      }
    }
    return e && e.fileList;
  }

  function Cancel() {
    dispatch({ type: `${namespace}/updateState`, payload: { visible: false } });
  }

  function Submit() {
    validateFieldsAndScroll((err, values) => {
      if (!!err) return;
      if (values.photo.length > 0) {
        // 处理图片
        values.photo =
          !!values.photo[0] && values.photo[0].url
            ? values.photo[0].url
            : values.photo[0].response.data[0];
      }
      values.id = editInfo.id;
      dispatch({ type: `${namespace}/Submit`, payload: values });
    });
  }

  return (
    <Modal
      title="奖品编辑"
      width="450px"
      closable={false}
      className="modal_wrap"
      visible={visible || false}
      afterClose={() => resetFields()}
      footer={[
        <Button key="cancel" onClick={Cancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={Submit} loading={loading} disabled={loading}>
          保存
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form className="modal_form_wrap">
          <FormItem {...formItemLayout} label="奖品名称">
            {getFieldDecorator('name', {
              initialValue: editInfo.name || undefined,
              rules: [{ required: true, message: '请输入奖品名称' }],
            })(<Input placeholder="请输入奖品名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="奖品类型">
            {getFieldDecorator('type', {
              initialValue: '' + editInfo.type || undefined,
              rules: [{ required: true, message: '请选择奖品类型' }],
            })(
              <Select
                allowClear={true}
                showSearch={true}
                optionFilterProp="children"
                notFoundContent="未找到奖品类型"
                placeholder="请选择奖品类型"
              >
                {awardTypeSels.map((item, index) => {
                  return (
                    <Option key={'award_type_' + item.key} value={item.key}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="奖品数量">
            {getFieldDecorator('prizeCnt', {
              initialValue: editInfo.prizeCnt || 0,
              rules: [{ required: true, message: '请输入奖品数量' }],
            })(
              <InputNumber
                min={0}
                max={99999999}
                style={{ width: 140 }}
                placeholder="请输入奖品数量"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="奖品库存">
            {getFieldDecorator('totalCnt', {
              initialValue: editInfo.remainCnt || 0,
              rules: [{ required: true, message: '请输入奖品库存' }],
            })(
              <InputNumber
                min={0}
                max={99999999}
                style={{ width: 140 }}
                placeholder="请输入奖品库存"
              />
            )}
          </FormItem>
          {editInfo.id !== 1 && (
            <FormItem {...formItemLayout} label="配置概率">
              {getFieldDecorator('configureProbability', {
                initialValue: editInfo.configureProbability || 0,
                rules: [{ required: true, message: '请输入中奖概率' }],
              })(
                <InputNumber
                  style={{ width: 140 }}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  placeholder="请输入配置概率"
                />
              )}
            </FormItem>
          )}
          <FormItem
            {...formItemLayout}
            label="奖品图"
            className="common_form_item"
            help="最大500k, 支持jpg、png、jpeg格式"
          >
            {getFieldDecorator('photo', {
              initialValue: editInfo.photo
                ? [{ uid: -1, url: editInfo.photo, status: 'done' }]
                : [],
              valuePropName: 'fileList',
              normalize: e => normFileImage(e, 0.5),
              rules: [{ type: 'array', required: true, message: '请上传奖品图' }],
            })(
              <Upload listType="picture-card" action={`${window.BASE_URL}/file/upload`}>
                {getFieldValue('photo') && getFieldValue('photo').length >= 1 ? null : uploadButton}
              </Upload>
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
}

function mapStateToProps({ awardEdit }) {
  return { awardEdit };
}

export default connect(mapStateToProps)(Form.create()(AwardSetPage));
