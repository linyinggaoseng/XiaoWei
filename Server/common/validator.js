
var ValidatorRegex = {
    Email :/^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/,//邮件
    Telephone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,//电话或传真
    Mobile : /^(13|14|15|17|18)[0-9]{9}$/,//手机
    Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/, //网址
    Decimal : /^[-\+]?\d+(\.\d+)?$/,//小数
    Integer : /^[-\+]?\d+$/,     //整数
    PositiveDecimal : /^\d+(\.\d+)?$/, //正小数
    PositiveInteger : /^\d+$/, //正整数
    Zip : /^[1-9]\d{5}$/, //邮政编码
    QQ : /^[1-9]\d{4,8}$/,//ＱＱ
    Letter : /^[A-Za-z]+$/,     //英文字母
    Uppercase : /^[A-Z]+$/, //大写英文字母
    ContainUppercase : /[A-Z]/, //包含大写英文字母
    Chinese : /^[\u0391-\uFFE5]+$/ //中文
};

//是否邮件
exports.isEmail = function(obj) {
    var re = new RegExp(ValidatorRegex.Email);
    return re.test(obj);
};

//是否电话,电话号码格式为国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)
exports.isTelephone = function(obj) {
    var re = new RegExp(ValidatorRegex.Telephone);
    return re.test(obj);
};

//是否手机号码
exports.isMobile = function(obj) {
    var re = new RegExp(ValidatorRegex.Mobile);
    return re.test(obj);
};

//是否网址
exports.isUrl = function(obj) {
    var re = new RegExp(ValidatorRegex.Url);
    return re.test(obj);
};

//是否身份证
exports.isIdCard = function(obj) {
    var num = obj.toLowerCase().match(/./g);
    if (obj.match(/^\d{17}[\dx]$/i)){
        var sum=0,times=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
        for (var i=0;i<17;i++)
            sum+=parseInt(num[i],10)*times[i];
        if ("10x98765432".charAt(sum%11)!=num[17])
            return false;
        return !!obj.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/,"$1-$2-$3").isDateTime();
    }
    if (obj.match(/^\d{15}$/))
        return !!obj.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/,"19$1-$2-$3").isDateTime();
    return false;
};

//是否日期
exports.isDate = function(obj) {
    var date = obj===false?obj:obj.parseStdDate(false);
    if (!date) return false;
    var arr=date.match(/^((19|20)\d{2})-(\d{1,2})-(\d{1,2})$/);
    if (!arr) return false;
    for (var i=1;i<5;i++)
        arr[i] = parseInt(arr[i],10);
    if(arr[3]<1||arr[3]>12||arr[4]<1||arr[4]>31) return false;
    var _t_date=new Date(arr[1],arr[3]-1,arr[4]);
    return _t_date.getDate()==arr[4]?_t_date:null;
};

//是否为空
var isNullOrEmpty = exports.isNullOrEmpty = function(obj) {
    if(!obj||obj=='null'||typeof(obj)==undefined || obj=="" || obj.length==0){
        return true;
    }
    else{
        return false;
    }
};

//是否是整数
exports.isInteger = function(obj) {
    var num = new RegExp(ValidatorRegex.Integer);
    if (isNaN(obj)) {
        return false
    }
    else{
        return num.test(obj);
    }
};

//是否是小数
exports.isDecimal = function(obj) {
    if (isNaN(obj)) {
        return false
    }
    else{
        var num = new RegExp(ValidatorRegex.Decimal);
        return num.test(obj);
    }
};

//是否是正整数
exports.isPositiveInteger = function(obj) {
    if (isNaN(obj)) {
        return false
    }
    else{
        var num = new RegExp(ValidatorRegex.PositiveInteger);
        return num.test(obj);
    }
};

//是否是正小数
exports.isPositiveDecimal = function(obj) {
    var num = new RegExp(ValidatorRegex.PositiveDecimal);
    if (isNaN(obj)) {
        return false
    }
    else {
        return num.test(obj);
    }
};

//是否是邮编
exports.isZip = function(obj) {
    var num = new RegExp(ValidatorRegex.Zip);
    return num.test(obj);
};

//是否是QQ
exports.isQQ = function(obj) {
    var num = new RegExp(ValidatorRegex.QQ);
    return num.test(obj);
};

//是否是英文
exports.isEnglish = function(obj) {
    var num = new RegExp(ValidatorRegex.Letter);
    return num.test(obj);
};

//是否是中文
exports.isChinese = function(obj) {
    var num = new RegExp(ValidatorRegex.Chinese);
    return num.test(obj);
};

//是否是大写英文字母
exports.isUppercase = function(obj) {
    var num = new RegExp(ValidatorRegex.Uppercase);
    return num.test(obj);
};

//是否含有大写英文字母
exports.isContainUppercase = function(obj) {
    var num = new RegExp(ValidatorRegex.ContainUppercase);
    return num.test(obj);
};

//字符串长度是否小于指定长度
function isLessNum(v, len) {
    if(isNullOrEmpty(v)){
        return true;
    }
    else{
        return v.length < len;
    }
}

//字符串长度是否小于2
exports.isLess2 = function (v) {
    return isLessNum(v, 2);
};

//字符串长度是否小于10
exports.isLess10 = function (v) {
    return isLessNum(v, 10);
};

//字符串长度是否小于20
exports.isLess20 = function (v) {
    return isLessNum(v, 20);
};

//字符串长度是否小于40
exports.isLess40 = function (v) {
    return isLessNum(v, 40);
};

//字符串长度是否小于50
exports.isLess50 = function (v) {
    return isLessNum(v, 50);
};

//字符串长度是否小于100
exports.isLess100 = function (v) {
    return isLessNum(v, 100);
};

//字符串长度是否小于250
exports.isLess256 = function (v) {
    return isLessNum(v, 256);
};

//字符串长度是否小于512
exports.isLess512 = function (v) {
    return isLessNum(v, 512);
};

//字符串长度是否小于1024
exports.isLess1024 = function (v) {
    return isLessNum(v, 1024);
};
