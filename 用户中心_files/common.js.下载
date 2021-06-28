/** 系统全局变量 --- 开始 */
//全局项目路径
var webpath = '/yingxin';
// 登录后学生的对象
var common_studentBean = JSON.parse(getCookie("common_studentBean"));
// 学生所在的当前正在进行的流程
var common_flowBean = JSON.parse(getCookie("common_flowBean"));
// 系统参数
var system_config = JSON.parse(getCookie('system_config'));
// 系统类型
var systemType = 'yingxin_student_pc';
// 是否正在加载---默认为false
var isloading = false;
/** 系统全局变量 --- 结束 */

$(document).ready(function() {
	// 浏览器兼容 自定义indexOf
	initIndexOf()
});

/**
 * 异步请求
 * @param option 请求对象
 * {
 *  （必须存在）type： 请求类型 get、post、put、delete
 * 	（必须存在）url: 路径
 *  （必须存在）dataType: 数据类型html、json
 *  data: 参数
 *  async: 是否为异步请求（默认为true，当时false时，把锁定方法，锁定浏览器执行完成后执行下一步）
 *  successFunc： （必须存在）执行成功后的方法
 *  errorFunc: 执行错误的方法
 * }
 */
function commonAjax(option) {
	if (option.notLogin == null) {
		option.notLogin = false;
	}
	$.ajax({
		cache: false,
		url : webpath + option.url,
		data : option.data,
		async : option.async == true ? true : false,
		type : option.type,
		dataType : 'json',
		headers : {
			"Content-Type" : "application/json;charset=utf-8",
			"access_token" : getCookie('access_token'),
			"access-token" : getCookie('access_token'),
			"systemType" : "yingxin_student_pc"
		},
		success : function(data) {
			if (data !== null && !option.notLogin) {
				let state = data.state;
				if (state < 3999 && state >= 2000) {
					delCookie("access_token");
					delCookie("common_flowBean");
					delCookie("common_studentBean");
					window.parent.location.href = webpath + "/login?systemType=yingxin_student_pc";
					return;
				} else if (state == 6001) {
					window.parent.location.href = webpath + "/error/unauthorized";
					return;
				}
			}
			if (typeof (option.successFunc) == "function") {
				option.successFunc(data);
			}
		},
		error : function(data) {
			if (typeof (option.errorFunc) == "function") {
				option.errorFunc(data);
			}
		}
	});
}

/**
 * 中英文切换
 * @returns
 */
function changeLanguage() {
	translate();
}

/**
 * loading加载层
 */
function openLoad() {
	layer.load(0, {
		scrollbar: false,
		shade: 0.4
	});
}

/**
 * 关闭加载层
 * @param index 指定页面，如果为空则默认关闭所有的弹窗
 */
function closeLoad(index) {
	if (typeof index == 'undefined') {
		layer.closeAll();
	} else {
		layer.close(index);
	}
}

/**
 * 跳转页面
 * @param url
 * @param param
 * @returns
 */
function toPage(url) {
	window.location.href = webpath + "/" + url;
}

/**
 * 默认的cookie写入方法
 * @param name cookie的key值
 * @param value cookie的value
 * @param expires 有效期（单位：毫秒=千分之一秒）
 */
function setCookie(name, value, expires) {
	if (name != undefined && value != undefined) {
		if (expires != undefined) {
			var exp = new Date()
			exp.setTime(exp.getTime() + expires);
			document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=' + webpath;
		} else {
			document.cookie = name + '=' + escape(value) + ';path=' + webpath;
		}
	}
}

/**
 * 获取Cookie中的值
 * 
 * @param objName
 * @returns
 */
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}
}

/**
 * 清除指定的cookie
 * @param name
 * @returns
 */
function delCookie(name) {
	var exp = new Date()
	exp.setTime(exp.getTime() - 1)
	var cval = getCookie(name)
	if (cval && cval != null) {
		document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=' + webpath;
	}
}

/**
 * 清除所有的cookie
 * @returns
 */
function clearCookie(exCookies) {
	var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
	if (keys) {
		for (var i = keys.length; i--;) {
			if (exCookies != null && exCookies.length != 0) {
				if (exCookies.indexOf(keys[i]) !== -1) {
					continue;
				}
			}
			document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + ';path=' + webpath;
		}
	}
}

/**
 * 通用确认方法
 * @param data
 * @param func
 * @returns
 */
function layerSubInfo(message, data, func) {
	// layer.confirm(message, function(index) {
	// 	if (typeof func == 'function') {
	// 		func(data);
	// 	}
	// 	layer.close(index);
	// });
	layer.confirm(message, {
		closeBtn : 0,
		icon: 3,
		title: '系统提示 System Reminder',
		btn : ['确定 / confirm', '取消 / cancel'],
		offset: '30%'
	}, function(index, layero) {
		if (typeof func == 'function') {
			func(data);
		}
		layer.close(index);
	});
}

/**
 * 通用警告方法
 * @param message
 * @returns
 */
function layerAlert(message) {
	layer.alert(message, {
		closeBtn : 1,
		anim : 1,
		icon : 0,
		title: '警告 warning',
		offset: '30%'
	});
}

/**
 * 通用的错误弹框
 * @param message
 * @param fun	点击确定的回调方法
 * @param data	回调方法的参数
 * @returns
 */
function layerError(message, fun, data) {
	layer.alert(message, {
		closeBtn : 0,
		anim : 1,
		title: '错误 error',
		btn : ['确定 / confirm'],
		icon : 2,
		offset: '30%'
	});
}

/**
 * 通用的成功弹框
 * @param message
 * @param fun	点击确定的回调方法
 * @param data	回调方法的参数
 * @returns
 */
function layerSuccess(message, fun, data) {
	layer.alert(message, {
		closeBtn : 0,
		anim : 1,
		title: '成功 success',
		btn : ['确定 / confirm'],
		icon : 1,
		offset: '30%',
		yes : function (index) {
			if (typeof fun == 'function') {
				fun(data);
			}
			layer.close(index);
		}
	});
}

/**
 * 自定义的弹出框
 * @param message
 * @param option
 * @returns
 */
function layerAlertUserDefined(message, option) {
//	option = {
//		closeBtn : 0,
//		anim : 1,
//		title: '错误',
//		btn : ['确定'],
//		icon : 2,
//		yes : function() {
//			window.parent.location.href = webpath;
//			parent.layer.closeAll();
//		}
//	}
	layer.alert(message, option);
}

/**
 * 自定义的弹出框
 * @param message
 * @param option
 * @returns
 */
function layerOpenUserDefined(option) {
	layer.open(option);
}

/**
 * 获取字符串字节长度（中文字符按三个字节）
 * @param str
 * @returns
 */
function getBytesLength(str) {
	return str.replace(/[^\x00-\xff]/g, '---').length;
}

/**
 * 浏览器兼容 自定义indexOf
 */
function initIndexOf () {
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(elt) {
	        var len = this.length >>> 0;
	        var from = Number(arguments[1]) || 0;
	        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	        if (from < 0) from += len;
	        for (; from < len; from++) {
	            if (from in this && this[from] === elt) return from;
	        }
	        return - 1;
	    };
	}
}

/**
 * 获取指定格式的【前端】当前时间，格式为【yyyy-MM-dd HH:mm:ss】
 * @returns
 */
function getNowDate() {
    var date = new Date();
    var transverse = "-";
    var Verticalpoint = ":";
    var month = date.getMonth() + 1;//获取月份
    var strDate = date.getDate();//获取具体的日期           
    var strHour = date.getHours();//获取...钟点
    var strMinute = date.getMinutes();//获取分钟数
    var strSeconde = date.getSeconds();//获取秒钟数
    //判断获取月份 、 具体的日期 、...钟点、分钟数、秒钟数 是否在1~9
    //如果是则在前面加“0”
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 1 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 1 && strHour <=9) {
        strHour = "0" + strHour
    }
    if (strMinute >= 1 && strMinute <= 9) {
        strMinute = "0" + strMinute;
    }

    if (strSeconde >= 1 && strSeconde <= 9) {
        strSeconde = "0" + strSeconde;
    }
    //时间日期字符串拼接
    var NewDate = date.getFullYear() + transverse + month + transverse + strDate + " " +
       strHour + Verticalpoint + strMinute + Verticalpoint + strSeconde;
    //返回拼接字符串
    return NewDate;
}
