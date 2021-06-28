var websocket = null, nowDateTime = null;
var system_config;
$(document).ready(function() {
	initNowDataTime();
	system_config = JSON.parse(getCookie('system_config'));
	if (system_config == null) {
		commonAjax({
			'type': 'get',
			'url': '/helper/systemConfig',
			'dataType': 'json',
			'successFunc': function (result) {
				if (result != null && result.state == 200) {
					setCookie('system_config', JSON.stringify(result.data));
					setCookie('systemType', "yingxin_student_pc");
					system_config = JSON.parse(getCookie('system_config'));
					init();
				}
			}
		});
	} else {
		init();
	}
});

function init() {
	$("#logo_img").attr("src", webpath + "/themes/default/images/"+system_config.userCode+"/logo.png");
	let url = window.location.href.split(webpath)[1].split("?")[0];
	let flag = false;
	var notLogin = [
		'/login', '/notice/list', '/notice/detail', '/', '/error/500', '/error/400', '/bnu/statistics'
		]
	if (notLogin.indexOf(url) != -1) {
		flag = true
	}
	if (url == '/bnu/statistics' && system_config != null && system_config.userCode != 'bnu') {
		flag = false;
	}
	if (common_studentBean == null) {
		toLogin();
		if (!flag) {
			window.parent.location.href = webpath + "/login?systemType=yingxin_student_pc";
		}
		if (system_config.userCode != 'bnu') {
			if (system_config.userCode != 'xjtu') {
				$('#index').show();
			}
			$('#noticeMenu').show();
		}
	} else {
		userInfo();
		// 初始化菜单
		initHeaderMenu();
		show();
	}
}

function toLogin() {
	var toLoginHtml = "";
	toLoginHtml += '<li class="user-item to-login">';
	toLoginHtml += '<a href="javascript:;" onclick="window.location.href=\'' + webpath + '/login?systemType=yingxin_student_pc\'">';
	toLoginHtml += '<em class="layui-icon layui-icon-username"></em>登录</a>';
	toLoginHtml += '</li>';
	$("#userInfo-header").html(toLoginHtml);
}

function initNowDataTime() {
	commonAjax({
		'type' : 'get',
		'url' : '/helper/systemDateTime',
		'successFunc' : function(o) {
			if (o && o.state === 200) {
				nowDateTime = o.data;
			} else {
				nowDateTime = getNowDate();
			}
		},
		'errorFunc': function(o) {
			nowDateTime = getNowDate();
		}
	});
}

//控制按钮显示
function show() {
	if (system_config.userCode == 'bnu') {
		$('#userCenter').show();
	} else {
		if (system_config.userCode != 'xjtu') {
			$('#index').show();
		}
		$('#server').show();
		$('#noticeMenu').show();
		$('#userCenter').show();
	}
	if (system_config.openMessage == "true") {
//		initMessage();
//		connectWebsocket();
	}
}

function userInfo() {
	var userInfoHtml = "";
	userInfoHtml += '<li class="user-item user-info layui-nav-item layui-show">';
	if (common_studentBean.pictureUrl == null || common_studentBean.pictureUrl == 'null' || common_studentBean.pictureUrl == '') {
		userInfoHtml += '<a href="javascript:void(0);" onclick="memberDetail()">' + common_studentBean.name + '<img src=\''+webpath+'/themes/default/images/default.png\'">' + '</a>';
	} else {
		userInfoHtml += '<a href="javascript:void(0);" onclick="memberDetail()">'
			+ common_studentBean.name
			+ '<img src="'+common_studentBean.pictureUrl+'" onerror="javascript:this.src=\''+webpath+'/themes/default/images/default.png\'">'
			+ '</a>';
	}
	userInfoHtml += '<a class="meaage-badge" href="javascript:;" onclick="toPage(\'notice/messageList\')" id="messageNum"></a>';
	userInfoHtml += '<dl class="layui-nav-child box-shadow">';
	if (common_flowBean != null && common_flowBean.flowType == '1') {
		userInfoHtml += '<dd><a class="layui-icon layui-icon-set" href="javascript:;" onclick="toPage(\'user/setting\')">个人设置 personal setting</a></dd>';
		/*userInfoHtml += '<dd><a class="layui-icon layui-icon-set" href="javascript:;" onclick="toPage(\'admission/admission\')">录取通知书</a></dd>';*/
	}
	if (system_config.userCode == 'xjtu') {
		if (common_flowBean != null && common_flowBean.flowType == '3') {
			userInfoHtml += '<dd><a class="layui-icon layui-icon-template-1" href="javascript:;" onclick="toPage(\'user/donation\')">余额捐赠 Card Balance Donation</a></dd>';
		}
	}
//	userInfoHtml += '<dd><a class="layui-icon layui-icon-set" href="javascript:;" onclick="toPage(\'admission/admission\')">录取通知书</a></dd>';
	userInfoHtml += '<dd><a class="icon-logout" href="javascript:;" onclick="logout()">退出登录 log Out</a></dd>';
	userInfoHtml += '</dl>';
	userInfoHtml += '</li>';
	$("#userInfo-header").html(userInfoHtml);
	var element = layui.element;
    element.init();
}
/**
 * 退出登陆
 * @returns
 */ 
function logout() {
	commonAjax({
		'type' : 'post',
		'url' : '/logout',
		'dataType' : 'json',
		'successFunc' : function(data) {
			if (data && data.state === 200 ) {
				clearCookie(['system_config', 'systemType']);
				if (data.data.isCasLogout == true) {
					window.location=data.data.casLogoutUrl;
				}else{
					toPage("login?systemType=yingxin_student_pc");
				}
			}
		}
	});
}

/**
 * 初始化私信
 * @returns
 */
function initMessage() {
	var messageInfo = {};
	messageInfo.userType = "0";
	messageInfo.userId = common_studentBean.id;
	messageInfo.sendType = 0;
	messageInfo.status = 0;
	messageInfo.isRead = 0;
	commonAjax({
		'type': 'get',
		'url': '/message/info',
		'data': messageInfo,
		'successFunc': function (result) {
			if (result.state == 200) {
				var messageList = result.data;
				if (messageList.length > 0) {
					$(".meaage-badge").show();
					$('#messageNum').html('<i class="layui-icon layui-icon-speaker"></i><span class="layui-badge">' + messageList.length + '</span>');
				} else {
					$(".meaage-badge").hide();
				}
			} else {
				$(".meaage-badge").hide();
			}
		},
		'errorFunc': function (result) {
			$(".meaage-badge").hide();
		}
	});
}


/**
 * 初始化菜单
 * 满足条件：
 * 1.学生可以办理
 * 2.当前时间在流程时间内
 */
function initHeaderMenu() {
	if (common_flowBean != null) {
		commonAjax({
			'type' : 'get',
			'url' : '/flowProcedure',
			'dataType' : 'json',
			'data' : {
				'flowId' : common_flowBean.id
			},
			'successFunc' : function(o) {
				if (o && o.state === 200) {
					var headerHtmlStr = '';
					for (var i = 0, len = o.data.length; i < len; i++) {
						// flag【[0]0操作员不可办1操作员可办；[1]0学生不可办1学生可办
						if (o.data[i].procedureBean.flag.slice(1, 2) == '1') {
							// 当前时间在流程时间内的，加入菜单
							let startDate = o.data[i].startDate + " 00:00:00";
							let endDate = o.data[i].endDate + " 23:59:59";
							if (new Date(nowDateTime.replace(/-/g, "/")).getTime() >= new Date(startDate.replace(/-/g, "/")).getTime()
									&& new Date(nowDateTime.replace(/-/g, "/")).getTime() <= new Date(endDate.replace(/-/g, "/")).getTime()) {
								if (o.data[i].procedureBean.id != 3 && o.data[i].flag.substring(5, 6) == '1') {
									// 该手续为外部手续
									if (o.data[i].config != null) {
										if (o.data[i].flag.substring(6, 7) == '1') {
											commonAjax({
												'type' : 'get',
												'url' : '/helper/des',
												'data' : {info: common_studentBean.sno},
												'successFunc' : function(result) {
													if (result && result.state === 200) {
														headerHtmlStr = headerHtmlStr + '<dd><a class="icon-'
														+(o.data[i].procedureBean.icon == null ? 'item' : o.data[i].procedureBean.icon)+'" href="javascript:void(0);" onclick="handleThridProcedure(\'' + o.data[i].config + '?synjones_ticket=' + encodeURIComponent(result.data) + '&synjones_type=pc\', '+o.data[i].procedureBean.id+')">'+o.data[i].procedureBean.name+' '+o.data[i].procedureBean.nameEn+'</a></dd>';
													} else {
														headerHtmlStr = headerHtmlStr + '<dd><a class="icon-'
														+(o.data[i].procedureBean.icon == null ? 'item' : o.data[i].procedureBean.icon)+'" href="javascript:void(0);" onclick="handleThridProcedure(\'' + o.data[i].config + '\', '+o.data[i].procedureBean.id+')">'+o.data[i].procedureBean.name+' '+o.data[i].procedureBean.nameEn+'</a></dd>';
													}
												},
												'errorFunc': function(o) {
													headerHtmlStr = headerHtmlStr + '<dd><a class="icon-'
													+(o.data[i].procedureBean.icon == null ? 'item' : o.data[i].procedureBean.icon)+'" href="javascript:void(0);" onclick="handleThridProcedure(\'' + o.data[i].config + '\', '+o.data[i].procedureBean.id+')">'+o.data[i].procedureBean.name+' '+o.data[i].procedureBean.nameEn+'</a></dd>';
												}
											});
										} else {
											headerHtmlStr = headerHtmlStr + '<dd><a class="icon-'
											+(o.data[i].procedureBean.icon == null ? 'item' : o.data[i].procedureBean.icon)+'" href="javascript:void(0);" onclick="handleThridProcedure(\'' + o.data[i].config + '\', '+o.data[i].procedureBean.id+')">'+o.data[i].procedureBean.name+' '+o.data[i].procedureBean.nameEn+'</a></dd>';
										}
									}
								} else {
									headerHtmlStr = headerHtmlStr + '<dd><a class="icon-'
									+(o.data[i].procedureBean.icon == null ? 'item' : o.data[i].procedureBean.icon)+'" href="javascript:;" onclick="handleProcedure('
									+o.data[i].procedureBean.id+')">'+o.data[i].procedureBean.name+' '+o.data[i].procedureBean.nameEn+'</a></dd>';
								}
							}
						}
					}
					$('#headerMenuList').html('');
					if (headerHtmlStr != '') {
						$('#headerMenuList').append(headerHtmlStr);
					} else {
						$('#headerMenuList').append("<dd>&nbsp;&nbsp;&nbsp;暂无可办业务</dd>");
					}
				}
			}
		});
	} else {
		$('#headerMenuList').append("<dd>&nbsp;&nbsp;&nbsp;暂无可办业务</dd>");
	}
}

/**
 * 外部手续
 */
function handleThridProcedure(url, flowProcedureId) {
	commonAjax({
		'url': '/dataManagement',
		'type': 'get',
		'data': {'studentBean.id':common_studentBean.id,'flowBean.id':common_flowBean.id,'procedureBean.id':flowProcedureId},
		'successFunc': function (result) {
			if (result.state == 200) {
				window.open(url);
			} else {
				parent.layerAlert(result.message);
			}
		},
		'errorFunc': function (result) {
			parent.layerAlert(result.message);
		}
	});
}

/**
 * 我的信息
 */
function memberDetail() {
	$('#my_name').html($('#my_name').html() + common_studentBean.name);
	$('#my_sno').html($('#my_sno').html() + common_studentBean.sno);
	$('#my_department').html($('#my_department').html() + (common_studentBean.departmentName == null ? '暂无' : common_studentBean.departmentName));
	$('#my_profession').html($('#my_profession').html() + (common_studentBean.professionName == null ? '暂无' : common_studentBean.professionName));
	$('#my_class').html($('#my_class').html() + (common_studentBean.className == null ? '暂无' : common_studentBean.className));
	// $('#my_origin').html($('#my_origin').html() + (common_studentBean.origin == null ? '暂无' : common_studentBean.origin));
	$('#my_qq').html($('#my_qq').html() + (common_studentBean.qq == null ? '暂无' : common_studentBean.qq));
	$('#my_wechat').html($('#my_wechat').html() + (common_studentBean.wechat == null ? '暂无' : common_studentBean.wechat));
	$('#my_email').html($('#my_email').html() + (common_studentBean.email == null ? '暂无' : common_studentBean.email));
	$('#my_phoneNumber').html($('#my_phoneNumber').html() + (common_studentBean.phoneNumber == null ? '暂无' : common_studentBean.phoneNumber));
	if (common_studentBean.accommodationInfoBean != null) {
		if (common_studentBean.accommodationInfoBean.dormitoryBuildingBean != null) {
			$('#my_room').html($('#my_room').html() + (common_studentBean.accommodationInfoBean.dormitoryBuildingBean.name
									+ common_studentBean.accommodationInfoBean.dormitoryNo + "室"
									+ common_studentBean.accommodationInfoBean.bedNo + "床"));
		} else if (common_studentBean.accommodationInfoBean.dormitoryNo != null) {
			$('#my_room').html($('#my_room').html() + (common_studentBean.accommodationInfoBean.dormitoryNo + "室"
							+ common_studentBean.accommodationInfoBean.bedNo + "床"));
		}
	} else {
		commonAjax({
			'type' : 'get',
			'url' : '/accommodationInfo',
			'dataType' : 'json',
			'data' : {
				'studentId' : common_studentBean.id
			},
			'async' : false,
			'successFunc' : function(o) {
				if (o && o.state === 200 && o.data.length == 1) {
					if (o.data[0].dormitoryBuildingBean != null) {
						$('#my_room').html($('#my_room').html() + (o.data[0].dormitoryBuildingBean.name + o.data[0].dormitoryNo + "室" + o.data[0].bedNo + "床"));
					} else if (o.data[0].dormitoryNo != null) {
						$('#my_room').html($('#my_room').html() + (o.data[0].dormitoryNo + "室" + o.data[0].bedNo + "床"));
					}
					common_studentBean.accommodationInfoBean = o.data[0];
					setCookie("common_studentBean", JSON.stringify(common_studentBean));
				} else {
					$('#my_room').html($('#my_room').html() + '暂无');
				}
			}
		});
	}
	
	if (system_config.userCode == 'xjtu') {
		$("#academy").show();
		$('#my_academy').html($('#my_academy').html() + (common_studentBean.academyName == null ? '暂无' : common_studentBean.departmentName));
		if (common_studentBean.teacherName != null && common_studentBean.identityCode == '20') {
			$("#teacher1").show();
			$('#my_teacher1').html($('#my_teacher1').html() + common_studentBean.teacherName);
		} else {
			$("#teacher1").hide();
		}
		if (common_studentBean.teacherId != null && common_studentBean.identityCode != '20') {
			$("#teacher2").show();
			$('#my_teacher2').html($('#my_teacher2').html() + common_studentBean.teacherId);
		} else {
			$("#teacher2").hide();
		}
	} else {
		$("#academy").hide();
		$("#teacher1").hide();
		$("#teacher2").hide();
	}
	var layer = layui.layer;
	parent.layerOpenUserDefined({
		type : 1,
		title : '我的信息 My Information',
		content : $('#myInfo').html(),
		area : ['400px', '400px'],
		btnAlign : 'c',
		cancel : function(index, layero) {
			$("#myInfo").css("display", "none");
		}
	})
}

/**
 * 跳转业务大厅
 * @param procedureId
 * @returns
 */
function handleProcedure(procedureId) {
	setCookie("procedure_id", procedureId);
	toPage('formality/page');
}

/**
 * websocket连接
 */
var websocket_connected_count = 0;
function connectWebsocket() {
	var websocket = null;
	// 判断当前环境是否支持websocket
	if (window.WebSocket) {
		if (!websocket) {
			websocket = new WebSocket(system_config.websocketUrl + "/"
					+ systemType + "/message/"
					+ JSON.parse(getCookie("common_studentBean")).id);
		}
	} else {
		console.log("not support websocket");
	}

	// 连接成功建立的回调方法
	websocket.onopen = function(e) {
		heartCheck.reset().start(); // 成功建立连接后，重置心跳检测
		console.log("connected successfully")
	}
	// 连接发生错误，连接错误时会继续尝试发起连接（尝试5次）
	websocket.onerror = function() {
		console.log("websocket连接发生错误")
		websocket_connected_count++;
		if (websocket_connected_count <= 5) {
			connectWebsocket()
		}
	}
	// 接受到消息的回调方法
	websocket.onmessage = function(e) {
		console.log("接收到消息了")
		heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
		var message = e.data;
		if (message) {
			console.log(message);
			initMessage();
		}
	}

	// 接受到服务端关闭连接时的回调方法
	websocket.onclose = function() {
		console.log("onclose断开连接");
	}
	// 监听窗口事件，当窗口关闭时，主动断开websocket连接，防止连接没断开就关闭窗口，server端报错
	window.onbeforeunload = function() {
		websocket.close();
	}

	// 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
	var heartCheck = {
		timeout : 550000, // 比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
		serverTimeoutObj : null,
		reset : function() {
			clearTimeout(this.serverTimeoutObj);
			return this;
		},
		start : function() {
			var self = this;
			this.serverTimeoutObj = setInterval(function() {
				if (websocket.readyState == 1) {
					console.log("连接状态，发送消息保持连接");
					websocket.send("heartCheck");
					heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
				} else {
					console.log("断开状态，尝试重连");
					connectWebsocket();
				}
			}, this.timeout)
		}
	}
}
