// eslint-disable-next-line no-unused-vars
// http://192.168.51.30:8088/pms/hsfund.pms.bp/1.0/listOpIndicator
/* eslint-disable no-unused-vars */
var request = { page_id: 201002, component_id: 1, port_id_list: [1], query_type: 1 }
var res = {
  error_no: 0,
  error_info: 'OK',
  result: [
    {
      port_id: 1,
      op_indicator_list: [
        {
          component_id: 1,
          indicator_type: 6,
          indicator_type_name: '净资产(亿元)',
          format_rule: '###,###.0000|100000000',
          select_flag: '0',
          indicator_order: 1
        },
        {
          component_id: 1,
          indicator_type: 4,
          indicator_type_name: '单位净值(元)',
          format_rule: '#.0000',
          select_flag: '1',
          indicator_order: 2
        },
        {
          component_id: 1,
          indicator_type: 5,
          indicator_type_name: '累计单位净值(元)',
          format_rule: '#.0000',
          select_flag: '1',
          indicator_order: 3
        },
        {
          component_id: 1,
          indicator_type: 7,
          indicator_type_name: '总资产(亿元)',
          format_rule: '###,###.0000|100000000',
          select_flag: '1',
          indicator_order: 4
        },
        {
          component_id: 1,
          indicator_type: 8,
          indicator_type_name: '资产负债率(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 5
        },
        {
          component_id: 1,
          indicator_type: 9,
          indicator_type_name: '杠杆比',
          format_rule: '#.00',
          select_flag: '1',
          indicator_order: 6
        },
        {
          component_id: 1,
          indicator_type: 10,
          indicator_type_name: '风格偏离度(%)',
          format_rule: '#.00|0.01',
          select_flag: '1',
          indicator_order: 7
        },
        {
          component_id: 1,
          indicator_type: 11,
          indicator_type_name: '当日盈亏(元)',
          format_rule: '###,###.00',
          select_flag: '1',
          indicator_order: 8
        },
        {
          component_id: 1,
          indicator_type: 12,
          indicator_type_name: '近1周收益率(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 9
        },
        {
          component_id: 1,
          indicator_type: 13,
          indicator_type_name: '近1月收益率(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 10
        },
        {
          component_id: 1,
          indicator_type: 14,
          indicator_type_name: '今年以来收益率(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 11
        },
        {
          component_id: 1,
          indicator_type: 15,
          indicator_type_name: '累计收益率(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 12
        },
        {
          component_id: 1,
          indicator_type: 16,
          indicator_type_name: '平均久期',
          format_rule: '#.00',
          select_flag: '0',
          indicator_order: 13
        },
        {
          component_id: 1,
          indicator_type: 17,
          indicator_type_name: '平均静态收益率(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 14
        },
        {
          component_id: 1,
          indicator_type: 18,
          indicator_type_name: '基金份额(亿份)',
          format_rule: '###,###.0000|100000000',
          select_flag: '0',
          indicator_order: 15
        },
        {
          component_id: 1,
          indicator_type: 21,
          indicator_type_name: '平均剩余存续期(年)',
          format_rule: '#.00',
          select_flag: '0',
          indicator_order: 16
        },
        {
          component_id: 1,
          indicator_type: 22,
          indicator_type_name: '万份收益(元)',
          format_rule: '#.00',
          select_flag: '0',
          indicator_order: 17
        },
        {
          component_id: 1,
          indicator_type: 23,
          indicator_type_name: '一年最大回撤(%)',
          format_rule: '#.00|0.01',
          select_flag: '0',
          indicator_order: 18
        }
      ]
    }
  ]
}
