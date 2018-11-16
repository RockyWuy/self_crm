import './utils/sync/utils';         //同步 工具类方法

const env = [
    { "ENV" : "formal" , "HOST" : "cms.aircourses.com" , "BASE_URL" : "https://api.aircourses.com" },
    { "ENV" : "pre" , "HOST" : "47.96.231.154:9106", "BASE_URL" : "http://47.96.231.154:7087" },
    { "ENV" : "dev" , "HOST" : "192.168.10.155:9106", "BASE_URL" : "http://192.168.10.155:7087" },
]

//通过url判断接口BASE_URL
let _COMMON_PROPS = {};
for(let i = 0 ; i < env.length ; i++){
    if(env[i].HOST === window.location.host){
        _COMMON_PROPS = env[i];
        break;
    }
}

//通过url配置接口BASE_URL
window.BASE_URL = _COMMON_PROPS.BASE_URL || '/crm';        //当前接口BASE_URL


//根据1920宽的设计稿 将1rem设置为 20px
document.documentElement.style.fontSize = document.documentElement.clientWidth / 96 + 'px';

window._critical_width = '1366px';          //UI临界宽度
window._critical_height = '768px';          //UI临界高度
