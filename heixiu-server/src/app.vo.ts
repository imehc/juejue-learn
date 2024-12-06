import { ApiProperty } from '@nestjs/swagger';

export class FileVo {
  @ApiProperty({ description: '文件路径' })
  path: string;
}

export class Location {
  @ApiProperty({ description: '地区/城市名称' })
  name: string;
  @ApiProperty({ description: '地区/城市ID' })
  id: string;
  @ApiProperty({ description: '地区/城市纬度' })
  lat: string;
  @ApiProperty({ description: '地区/城市经度' })
  lon: string;
  @ApiProperty({ description: '地区/城市的上级行政区划名称' })
  adm2: string;
  @ApiProperty({ description: '地区/城市所属一级行政区域' })
  adm1: string;
  @ApiProperty({ description: '地区/城市所属国家名称' })
  country: string;
  @ApiProperty({
    description: '地区/城市所在',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/glossary/#timezone',
    },
  })
  tz: string;
  @ApiProperty({
    description: '地区/城市目前与UTC时间偏移的小时数',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/glossary/#utc-offset',
    },
  })
  utcOffset: string;
  @ApiProperty({
    description:
      '地区/城市是否当前处于夏令时。1 表示当前处于夏令时，0 表示当前不是夏令时',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/glossary/#daylight-saving-time',
    },
  })
  isDst: string;
  @ApiProperty({ description: '地区/城市的属性' })
  type: string;
  @ApiProperty({
    description: '地区评分',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/glossary/#rank',
    },
  })
  rank: string;
  @ApiProperty({
    description: '该地区的天气预报网页链接，便于嵌入你的网站或应用',
  })
  fxLink: string;
}

export class Weather {
  @ApiProperty({ description: '预报时间' })
  fxTime: string;
  @ApiProperty({ description: '温度，默认单位：摄氏度' })
  temp: string;
  @ApiProperty({
    description: '图标代码',
    externalDocs: {
      description: '天气状况的图标代码链接',
      url: 'https://icons.qweather.com/',
    },
  })
  icon: string;
  @ApiProperty({ description: '文字描述' })
  text: string;
  @ApiProperty({
    description: '风向360角度',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/wind-info/#wind-direction',
    },
  })
  wind360: string;
  @ApiProperty({
    description: '风向',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/wind-info/#wind-direction',
    },
  })
  windDir: string;
  @ApiProperty({
    description: '风力等级',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/wind-info/#wind-scale',
    },
  })
  windScale: string;
  @ApiProperty({
    description: '风速，公里/小时',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/wind-info/#wind-speed',
    },
  })
  windSpeed: string;
  @ApiProperty({ description: '相对湿度，百分比数值' })
  humidity: string;
  @ApiProperty({
    description: '逐小时预报降水概率，百分比数值',
    required: false,
  })
  pop: string;
  @ApiProperty({ description: '当前小时累计降水量，默认单位：毫米' })
  precip: string;
  @ApiProperty({ description: '大气压强，默认单位：百帕' })
  pressure: string;
  @ApiProperty({ description: '云量，百分比数值', required: false })
  cloud: string;
  @ApiProperty({ description: '露点温度', required: false })
  dew: string;
}

export class WeatherRefer {
  @ApiProperty({ description: '原始数据来源或数据源说明', required: false })
  sources: string[];
  @ApiProperty({ description: '数据许可或版权声明', required: false })
  license: string[];
}

export class WeatherVo {
  @ApiProperty({ description: '状态码' })
  code: string;
  @ApiProperty({
    description: '最近更新时间',
    externalDocs: {
      url: 'https://dev.qweather.com/docs/resource/glossary/#update-time',
    },
  })
  updateTime: string;
  @ApiProperty({ description: '当前数据的响应式页面，便于嵌入网站或应用' })
  fxLink: string;
  @ApiProperty({ isArray: true })
  daily: Weather[];
  refer: WeatherRefer;
}
