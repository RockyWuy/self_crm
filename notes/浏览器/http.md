<!--
 * @Author: rockyWu
 * @Date: 2020-05-22 09:48:58
 * @Description: 
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-22 11:17:21
--> 

> 用户输入url按下回车到页面出现 发生了什么？
* 1、用户输入 url 并回车
* 2、浏览器进程检查 url 是否符合规则，符合则组装协议，构成完整的 url；不符合则使用浏览器默认搜索
* 3、浏览器进程通过 ipc 通信将 url 请求发送给网络进程；
* 4、网络进程接受到 url 请求后先查询本地缓存是否缓存了该请求资源，如有缓存直接返回；没有则进入正式的网络请求；
* 5、进行 DNS 查询，获取服务器 ip 地址；利用 ip 地址与服务器建立 tcp 连接；(三次握手)
* 6、构建请求信息之后发送请求，服务器响应后，网络进程接收响应头和响应信息；(完成后四次挥手断开连接)
* 7、网络进程解析响应头；若发现返回状态码为 301 或 302 则从响应头获取 location 字段重新发起 http 请求；
* 8、将数据转发给浏览器进程；按照不同的 content-type 进行不同的处理；若为 http 请求；
* 9、浏览器进程接收响应头数据之后，判断是否有同一站点页面，共用渲染进程或单独构建，发送‘提交导航’消息到渲染进程；(公用渲染进程或单独)
* 10、渲染进程接收到‘提交导航’的消息之后，开始准备接收 html 数据，接收数据的方式是与网络进程建立数据管道；
* 11、渲染进程接收完数据之后，返回‘确认提交’的信息给浏览器进程；
* 12、浏览器进程接收到‘确认信息’的消息后，会更新浏览器界面状态，安全状态，地址栏的 url，前进后退的历史状态；(刷新是可监听 beforeLoad 事件)
* 13、渲染阶段

> 基于tcp握手的长连接connection: keep-alive
* 1、以 chrome 为例，只能对同一个域名发送 6 个 tcp 请求，如果同时发送 10 个请求，则有 4 个请求需要进入等待队列；  
开发中有一种优化是 不同的资源 放在不同的域名之下，这样能省去部分 等待时间
* 2、发送一个 http 请求需要建立 tcp 连接(http1.1 下是 1 对 1)，当这个 http 请求结束之后，tcp 会保持连接；  
下一个 http 请求可以直接复用当前的 tcp 连接而不用重新建立；

> http缓存机制(强缓存，协商缓存)
* 1、强缓存，cache-controll，expries；若符合缓存规则则每次都会走本地缓存（disk或memory）
* 2、协商缓存，if-None-Match Etag 和 if-Modified-Since Modified  
会向服务器发送请求，若符合缓存规则，则服务器返回 304 告诉客户端可以继续使用当前缓存  
if-Modified-Since Modified 只能精确到 s，优先级低于 Etag

> 同源策略 简单请求 复杂请求 预检请求
* 同源策略：相同协议/相同主机名/相同端口，不一样则为跨域
* 简单请求  
1、请求方式：GET、POST、HEAD  
2、HTTP 请求头限制以下字段：Accept、Accept-Language、Content-Language、Content-Type  
3、Content-Type 取值：application/x-www-form-urlencoded、multipart/form-data、text/plain  


> GET 和 POST 的区别
* GET 产生一个 TCP 数据包； POST 产生两个 TCP 数据包；  
对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应200（返回数据）； 而对于 POST，浏览器先发送header，服务器响应 100 continue，浏览器再发送 data，服务器响应200 ok（返回数据）
* GET 请求可以被缓存；POST 不可以
* GET 对数据长度有限制，当发送数据时，GET 方法向 URL 添加数据； URL 的长度是受限制的（最大长度 2048 个字符）。POST 无限制
* GET 只允许 ASCII 字符；POST 无限制
