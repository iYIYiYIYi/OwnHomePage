# OwnHomePage
---
原生JS和CSS纯手撸的网页导航，支持定制化使用。
---
### 本地存储
本地数据使用Cookie将数据保存在本地，分为多个配置项，其中custom_website项保存的是一个对象，对象属性名就是网页导航组的名字，属性值为两个数组，一个存储网页名称，一个存储网页链接。searchEngine保存用户自定义添加的搜索引擎网址，通过一个js对象保存，对象属性名就是搜索引擎名称，属性值就是搜索引擎链接。
本地存储结构将在未来进行重构修改为更加符合逻辑的结构。
### 在线存储
可以通过修改response_server.js中的url修改服务器地址，服务器传回的JSON对象需要包含userWebsitesGroup数组，该数组中保存WebsiteGroup对象。服务器通过接收user对象进行登录，user对象含有username、password、userWebsitesGroups属性。
