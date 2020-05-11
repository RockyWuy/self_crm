/*
 * @author yhwu
 * Date at 2018/10/26
 * 常用搜索组件
 */
import React from 'react';
import { message, Form, Button, Icon, Input, Select, DatePicker } from 'antd';
import styles from './CommonSearch.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

class CommonSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ClickToSearch = this.ClickToSearch.bind(this);
    this.OnSearch = this.OnSearch.bind(this);
    this.OnReset = this.OnReset.bind(this);
    this.createInput = this.createInput.bind(this);
    this.createSelect = this.createSelect.bind(this);
    this.createRangePicker = this.createRangePicker.bind(this);
  }

  //搜索
  OnSearch(values) {
    if (!this.props.OnSearch) {
      throw new Error('OnSearch undefined');
    } else {
      this.props.OnSearch(values);
    }
  }

  OnReset() {
    const { resetFields } = this.props.form;
    if (!this.props.OnReset) {
      throw new Error('OnReset undefined');
    } else {
      resetFields();
      this.props.OnReset({});
    }
  }

  //点击搜索
  ClickToSearch() {
    //判断是否 可以搜索
    let { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      if (!!err) {
        return;
      }
      let query = {};
      let isSearch = false;
      for (let [key, value] of Object.entries(values)) {
        if (window._COM_FUNC.isType('String')(value)) {
          value = value.trim();
        }
        if (value !== undefined && value !== '') {
          //去除 为undefined或''的key
          query[key] = value;
          isSearch = true;
        }
      }
      if (isSearch) {
        this.OnSearch(query);
      } else {
        message.warn('搜索项未选中');
      }
    });
  }

  //创建Input控件
  createInput(item) {
    let { getFieldDecorator } = this.props.form;
    return (
      <div key={'search_item_' + item.key} className={styles.common_search_item}>
        {getFieldDecorator(item.key, {
          initialValue: undefined,
        })(<Input placeholder={item.placeholder} style={{ width: item.width || 160 }} />)}
      </div>
    );
  }

  //创建Select控件
  createSelect(item) {
    if (!item.options) {
      //options是否传入
      throw new Error('select options undefined');
    }
    if (!window._COM_FUNC.isType('Array')(item.options)) {
      //options是否为数组
      throw new Error('options is not Array');
    }
    let { getFieldDecorator } = this.props.form;
    let opt_key = item.opt_key || 'key';
    let opt_label = item.opt_label || 'label';
    return (
      <div key={'search_item_' + item.key} className={styles.common_search_item}>
        {getFieldDecorator(item.key, {
          initialValue: undefined,
        })(
          <Select
            allowClear
            optionFilterProp="children"
            notFoundContent="未找到搜索项"
            style={{ width: item.width || 160 }}
            placeholder={item.placeholder || '请输入'}
          >
            {item.options.map((option, index) => {
              return (
                <Option key={item.key + option.key} value={option[opt_key]}>
                  {option[opt_label]}
                </Option>
              );
            })}
          </Select>
        )}
      </div>
    );
  }

  createRangePicker(item) {
    //		if( !!item.key && item.key.search('&') === -1 ){   //key中需包含& 以用来区分
    //			throw new Error('key is Illegal format');
    //		}
    let startPlaceholde = '开始时间';
    let endPlaceholder = '结束时间';
    if (!!item.placeholder && item.placeholder.search('&') !== -1) {
      let arrs = item.placeholder.split('&');
      startPlaceholde = arrs[0];
      endPlaceholder = arrs[1];
    }
    let { getFieldDecorator } = this.props.form;
    return (
      <div key={'search_item_' + item.key} className={styles.common_search_item}>
        {getFieldDecorator(item.key, {
          initialValue: undefined,
        })(
          <RangePicker
            allowClear
            style={{ width: item.width || 230 }}
            placeholder={[startPlaceholde, endPlaceholder]}
          />
        )}
      </div>
    );
  }

  render() {
    //表单控件集合
    let formTypes = {
      input: this.createInput,
      select: this.createSelect,
      rangePicker: this.createRangePicker,
    };

    let { fields } = this.props;

    return (
      <div className={styles.common_search}>
        {fields.length > 0 &&
          fields.map((item, index) => {
            if (!!item.key) {
              return formTypes[item.type](item);
            }
            return null;
          })}
        <Button style={{ marginLeft: 20 }} type="primary" onClick={this.ClickToSearch}>
          <Icon type="search" />
          搜索
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={this.OnReset}>
          <Icon type="reload" />
          重置
        </Button>
      </div>
    );
  }
}

export default Form.create({})(CommonSearch);
