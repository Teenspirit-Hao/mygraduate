var nowDateTime = null, failProcedureId = null;

$(document).ready(function() {
	initNowDataTime();
	initCas();
	setHotNoticeList();
});

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

/**
 * 初始化cas单点登录
 */
function initCas() {
	let urlParam = window.location.href.split(webpath)[1].split("?")[1];
	if (getCookie('access_token') == null && getCookie('expires') == null && urlParam.indexOf("uuid") !== -1) {
		let uuidValue = urlParam.split("uuid=")[1];
		if (uuidValue.indexOf("&") !== -1) {
			uuidValue = uuidValue.split("&")[0]
		}
		if (uuidValue) {
			let params = {};
			params.uuid = uuidValue;
			commonAjax({
				'type' : 'get',
				'data': params,
				'url' : '/redis/token',
				'dataType' : 'json',
				'notLogin' : true,
				'successFunc' : function(result) {
					if (result && result.state === 200) {
						setCookie('access_token', result.data.access_token, result.data.expires);
						setCookie('expires', result.data.expires, result.data.expires);
						setCookie('systemType', result.data.systemType, result.data.expires);
					}
					window.location.href = webpath;
				},
				'errorFunc' : function() {
					// 初始化人员信息
					initUserInfo();
					// 初始化流程数据
					initDatamanagement();
					// 初始化交大的余额捐赠
					donation();
					alert();
				}
			});
		}
	} else {
		if (urlParam != null && urlParam.indexOf("uuid") !== -1) {
			window.location.href = webpath;
		} else {
			getUserInfo()
		}
	}
	
}

function getUserInfo () {
	if (getCookie('access_token') != null && getCookie('expires') != null && common_studentBean == null) {
		commonAjax({
			'type' : 'get',
			'url' : '/user/afterLogin',
			'dataType' : 'json',
			'async' : false,
			'notLogin' : true,
			'successFunc' : function(o) {
				if (o && o.state === 200) {
					if (o.data.studentPictureUrl != null) {
						o.data.studentBean.pictureUrl = o.data.studentPictureUrl;
					} else {
						o.data.studentBean.pictureUrl = null;
					}
					if (o.data.teacherId != null) {
						o.data.studentBean.teacherId = o.data.teacherId;
					} else {
						o.data.studentBean.teacherId = null;
					}
					if (o.data.teacherName != null) {
						o.data.studentBean.teacherName = o.data.teacherName;
					} else {
						o.data.studentBean.teacherName = null;
					}
					setCookie("common_studentBean", JSON.stringify(o.data.studentBean), getCookie('expires'));
					common_studentBean = o.data.studentBean
					if (o.data.flowBean != null) {
						setCookie("common_flowBean", JSON.stringify(o.data.flowBean), getCookie('expires'));
						common_flowBean = o.data.flowBean
					}
				}
				// 初始化人员信息
				initUserInfo();
				// 初始化流程数据
				initDatamanagement();
				// 初始化交大的余额捐赠
				donation();
				alert();
			},
			'errorFunc' : function() {
				// 初始化人员信息
				initUserInfo();
				// 初始化流程数据
				initDatamanagement();
				// 初始化交大的余额捐赠
				donation();
				alert();
			}
		});
	} else {
		// 初始化人员信息
		initUserInfo();
		// 初始化流程数据
		initDatamanagement();
		// 初始化交大的余额捐赠
		donation();
		alert();
	}
}

/**
 * 初始化人员信息
 */
function initUserInfo() {
	$('#userInfo').html('');
	var system_config = JSON.parse(getCookie('system_config'));
	if (common_studentBean != null && system_config != null) {
		if (system_config.userCode == 'xjtu') {
			if (common_flowBean != null && common_flowBean.flowType == "1") {
				$("#qq-code").html('<img src="http://hello.xjtu.edu.cn/staticFile/image/xjtu/yingxinQQ.png" onerror="javascript:this.src=\'http://hello.xjtu.edu.cn/staticFile/image/xjtu/default-error.png\';"><img src="http://hello.xjtu.edu.cn/staticFile/image/xjtu/yingxinQQ2.png" onerror="javascript:this.src=\'http://hello.xjtu.edu.cn/staticFile/image/xjtu/default-error.png\';">')
				$("#qq-code").show();
			} else if (common_flowBean != null && common_flowBean.flowType == 3) {
				$("#qq-code").html('<img src="http://hello.xjtu.edu.cn/staticFile/image/xjtu/lixiao.png">')
				$("#qq-code").show();
			}
		}
		var htmlStr = ''
		if (common_studentBean.pictureUrl != null) {
			htmlStr += '<img src="' + common_studentBean.pictureUrl
			+ '" onerror="javascript:this.src=\'' + webpath
			+ '/themes/default/images/default.png\'">';
		} else {
			htmlStr += '<img src="' + webpath + '/themes/default/images/default.png">';
		}
		htmlStr	+= '<h4 class="text-ellipsis">欢迎您，' + common_studentBean.name + '</h4>'
		+ (common_studentBean.sno != null ? ('<p>学号（Student ID ） ：' + common_studentBean.sno  + '</p>') : '')
		// + (common_studentBean.phoneNumber != null ? ('<p>电话：' + common_studentBean.phoneNumber  + '</p>') : '')
		+ (common_studentBean.academyName != null ? ('<p>书院（College）：' + common_studentBean.academyName  + '</p>') : '')
		+ (common_studentBean.departmentName != null ? ('<p>学院（School）：' + common_studentBean.departmentName  + '</p>') : '')
		+ (common_studentBean.professionName != null ? ('<p>专业（Major）：' + common_studentBean.professionName  + '</p>') : '')
		+ (common_studentBean.className != null ? ('<p>班级（Class）：' + common_studentBean.className + '</p>') : '');
		if (system_config.userCode == 'xjtu') {
			/**
			 * 本科生显示辅导员；研究生显示导师
			 * 1统招博士,2统招硕士,3专业学位博士,4专业学位硕士,5同等学力博士,6同等学力硕士,9其他[课程选修],10	留学生博士,11留学生硕士,12非全日制硕士专业学位,20	统考本科生
			 */
			if (common_studentBean.teacherName != null && common_studentBean.identityCode == '20') {
				htmlStr += '<p>导员（Instructor）：' + common_studentBean.teacherName + '</p>';
			}
			if (common_studentBean.teacherId != null && common_studentBean.identityCode != '20') {
				htmlStr += '<p>导师（Supervisor）：' + common_studentBean.teacherId + '</p>';
			}
		}
		$('#userInfo').append(htmlStr);
//		console.log(common_studentBean)
//		console.log(JSON.parse(getCookie("common_studentBean")))
// 		if (common_studentBean.accommodationInfoBean != null) {
// 			if (common_studentBean.accommodationInfoBean.dormitoryBuildingBean != null) {
// 				$('#userInfo').append("<p>宿舍：" + common_studentBean.accommodationInfoBean.dormitoryBuildingBean.name
// 										+ common_studentBean.accommodationInfoBean.dormitoryNo + "室"
// 										+ common_studentBean.accommodationInfoBean.bedNo + "床</p>");
// 			} else if (common_studentBean.accommodationInfoBean.dormitoryNo != null) {
// 				$('#userInfo').append("<p>宿舍：" + common_studentBean.accommodationInfoBean.dormitoryNo + "室"
// 								+ common_studentBean.accommodationInfoBean.bedNo + "床</p>");
// 			}
// 		}
//		if (common_studentBean.accommodationInfoBean != null) {
//			$('#userInfo').append('<p>宿舍：' + common_studentBean.accommodationInfoBean.dormitoryNo + '</p>');
//		} else {
//			commonAjax({
//				'type' : 'get',
//				'url' : '/accommodationInfo',
//				'dataType' : 'json',
//				'data' : {
//					'studentId' : common_studentBean.id
//				},
//				'async' : false,
//				'successFunc' : function(o) {
//					if (o && o.state === 200 && o.data.length == 1) {
//						if (o.data[0].dormitoryBuildingBean != null) {
//							$('#userInfo').append('<p>宿舍：' + o.data[0].dormitoryBuildingBean.name + ' ' + o.data[0].dormitoryNo + '</p>');
//						} else if (o.data[0].dormitoryNo != null) {
//							$('#userInfo').append('<p>宿舍：' + o.data[0].dormitoryNo + '</p>');
//						}
//					}
//				}
//			});
//		}
	}
}

/**
 * 初始化流程数据
 */
function initDatamanagement() {
	if (common_studentBean != null && common_flowBean != null) {
		commonAjax({
			'type' : 'get',
			'url' : '/dataManagement/getDataManagementList',
			'dataType' : 'json',
			'data' : {
				'flowStudentBean.studentId' : common_studentBean.id,
				'flowBean.id' : common_flowBean.id,
				'flowBean.isInFlow' : '1',
				'flag': '1'
			},
			'async' : false,
			'successFunc' : function(o) {
				if (o && o.state === 200 && o.data.length > 0) {
					if (o.message != '请求成功') {
						failProcedureId = Number(o.message)
					}
					// 初始化办理进度和未办手续（卡片）
					initProcessAndDetail(o.data);
					// 初始化办理记录
					handleRecording(o.data);
				}
			}
		});
	} else {
		$("#progress-bar").html("<div><p style='text-align:center;color:#AEAEAE'>您暂时没有办理的进程~</p></div>");
		$("#cardInfo").html("<div><p style='text-align:center;color:#AEAEAE'>您暂时没有未办事项~</p></div>");
		$("#recordContent").html('<div class="no-data-box"><img src="' + webpath + '/themes/default/images/nodata.png"><p>您暂时没有办理记录You have no record for the time being~~~</p></div>');
	}
}

/**
 * 初始化办理记录
 */
function handleRecording(data) {
	var allHtmlStr = '', finishedHtmlStr = '', notFinishedHtmlStr = '';
	var aHtmlStr = '';
	for (var i = 0, len = data.length; i < len; i++) {
		// 是否非必要办理
		if (data[i].flowProcedureBean.flag.substring(1, 2) == '1' && data[i].status!=4) {
			statusName = '<i class="layui-icon icon-state-style layui-icon-circle"></i>';
		} else {
			statusName = '<i class="layui-icon icon-state-style '+(data[i].status==4?'layui-icon-ok':'layui-icon-close')+'"></i>';
		}
		var tempHtmlStr = '';
		let startDate = data[i].flowProcedureBean.startDate + " 00:00:00";
		if (new Date(startDate.replace(/-/g,"/")).getTime() <= new Date(nowDateTime.replace(/-/g,"/")).getTime()) {
			if (data[i].procedureBean.id != 3 && data[i].flowProcedureBean.flag.substring(5, 6) == '1') {
				if (data[i].flowProcedureBean.config != null && data[i].procedureBean.flag.slice(1, 2) == '1') {
					if (data[i].flowProcedureBean.flag.substring(6, 7) == '1') {
						commonAjax({
							'type' : 'get',
							'url' : '/helper/des',
							'data' : {info: common_studentBean.sno},
							'successFunc' : function(o) {
								if (o && o.state === 200) {
									tempHtmlStr = '<a class="layui-btn layui-btn-sm" href="javascript:void(0);" onclick="handleThridProcedure(\'' + data[i].flowProcedureBean.config + '?synjones_ticket=' + encodeURIComponent(o.data) + '&synjones_type=pc\', '+data[i].procedureBean.id+')">查看 / Enter the view</a></div>';
								} else {
									tempHtmlStr = '<a class="layui-btn layui-btn-sm" href="javascript:void(0);" onclick="handleThridProcedure(\'' + data[i].flowProcedureBean.config + '\', '+data[i].procedureBean.id+')">查看 / Enter the view</a></div>';
								}
							},
							'errorFunc': function(o) {
								tempHtmlStr = '<a class="layui-btn layui-btn-sm" href="javascript:void(0);" onclick="handleThridProcedure(\'' + data[i].flowProcedureBean.config + '\', '+data[i].procedureBean.id+')">查看 / Enter the view</a></div>';
							}
						});
					} else {
						tempHtmlStr = '<a class="layui-btn layui-btn-sm" href="javascript:void(0);" onclick="handleThridProcedure(\'' + data[i].flowProcedureBean.config + '\', '+data[i].procedureBean.id+')">查看 / Enter the view</a></div>';
					}
				} else {
					tempHtmlStr = '</div>';
				}
			} else {
				tempHtmlStr = (data[i].procedureBean.flag.slice(1, 2) == '1' ? ('<a class="layui-btn layui-btn-sm" onclick="handleProcedure(\''
						+ data[i].procedureId + '\')">查看 / Enter the view</a></div>') : '</div>');
			}
		}
		if (data[i].flowProcedureBean.position != null) {
			aHtmlStr = '<a style="position:relative;display:block;padding-right:40px;" target="_blank" href="http://api.map.baidu.com/marker?location='
					+ data[i].flowProcedureBean.position
					+ '&title=地点&content=地点&output=html">'
					+ (data[i].flowProcedureBean.address != null ? data[i].flowProcedureBean.address
							: '暂无地点（Nothing Temporally）')
					+ '<i style="color:#299EF7;font-weight:700;position:absolute;right:11px;top:50%;transform:translateY(-50%)" class="layui-icon layui-icon-location"></i></a>';
		} else {
			aHtmlStr = '<a style="position:relative;display:block;padding-right:40px;">'
					+ (data[i].flowProcedureBean.address != null ? data[i].flowProcedureBean.address
							: '暂无地点（Nothing Temporally）') + '</a>';
		}
		var tempHtmlStr = 
			'<li class="finised">' +
			'<div class="time">' +
			'<p>'+data[i].flowProcedureBean.startDate+'</p>' +
			'<p class="name">开始时间 Starting Date</p>' +
			'</div><i class="item-icon iconbg-c-purple icon-'+(data[i].procedureBean.icon!=null?data[i].procedureBean.icon:'item')+' x64"></i>' +
			'<div class="info">' +
			'<div class="name"><span class="layui-badge-dot layui-bg-black"></span>' +
			'<span class="text">'+data[i].procedureBean.name + ' ' + data[i].procedureBean.nameEn +'</span>' +
			tempHtmlStr +
//				(data[i].procedureBean.flag.slice(1, 2) == '1'?('<a class="layui-btn layui-btn-sm" onclick="handleProcedure(\''+data[i].procedureId+'\')">查看</a></div>'):'</div>') +
			(data[i].flowProcedureBean.remark!=null?('<div class="tips"><span>*手续说明（Illustration）：</span><span>'+data[i].flowProcedureBean.remark+'</span></div>'):'') +
			'<table class="layui-table"><colgroup><col width="50"><col width="200"><col width="80"><col width="80"><col width="80"></colgroup>' +
			'<thead><tr><th>办理状态 Processing Status</th><th>办理地点 Processing Place</th><th>截止时间 Deadline</th><th>联系老师 Contact Teacher</th><th>联系方式 Permanent Phone Number</th></tr></thead>' +
			'<tbody><tr><td>'+statusName+'</td>' +
			'<td>'+aHtmlStr+'</td>' +
			'<td>'+data[i].flowProcedureBean.endDate+'</td>' +
			'<td>'+(data[i].flowProcedureBean.contact != null ? data[i].flowProcedureBean.contact : '暂无（Nothing Temporally）')+'</td>' +
			'<td>'+(data[i].flowProcedureBean.contactNumber != null ? data[i].flowProcedureBean.contactNumber : '暂无（Nothing Temporally）')+'</td></tr></tbody>' +
			'</table>' +
			'</div>' +
			'</li>';
		$('#ul-content-in').append(tempHtmlStr);
		allHtmlStr = allHtmlStr + tempHtmlStr;
		if (data[i].status == 4) {
			finishedHtmlStr = finishedHtmlStr + tempHtmlStr;
		} else {
			notFinishedHtmlStr = notFinishedHtmlStr + tempHtmlStr;
		}
	}
	
	if (allHtmlStr != '') {
		$('#ul-content-out').html('');
    	$('#ul-content-out').append(allHtmlStr);
	} else if (allHtmlStr == '') {
		$("#recordContent").html('<div class="no-data-box"><img src="' + webpath + '/themes/default/images/nodata.png"><p>您暂时没有办理记录~~~</p></div>');
	}
	
	// layui单选框选择事件
	layui.form.on('radio(handleCount)', function (data) {
//        console.log(data.value);//判断单选框的选中值
        if (data.value == 0) {
        	$('#ul-content-out').html('');
        	$('#ul-content-out').append(allHtmlStr);
        } else if (data.value == 1) {
        	$('#ul-content-out').html('');
        	$('#ul-content-out').append(notFinishedHtmlStr);
        	if (notFinishedHtmlStr == '') {
            	$('#ul-content-out').html('');
        		$("#ul-content-out").html('<div class="no-data-box"><img src="' + webpath + '/themes/default/images/nodata.png"><p>您暂时没有未办理记录~~~</p></div>');
        	}
        } else if (data.value == 2) {
        	$('#ul-content-out').html('');
        	$('#ul-content-out').append(finishedHtmlStr);
        	if (finishedHtmlStr == '') {
            	$('#ul-content-out').html('');
        		$("#ul-content-out").html('<div class="no-data-box"><img src="' + webpath + '/themes/default/images/nodata.png"><p>您暂时没有已办理记录~~~</p></div>');
        	}
        }
    });
}

/**
 * 初始化办理进度和未办手续（卡片）
 */
function initProcessAndDetail(data) {
	// 进度条
	var processTotal = data.length; // 手续总数
	var finished = 0; // 已办完
	var notNeed = 0; // 可不用办理的手续的数量

	// 未完成列表
	var notFinishedList = [];

	for (var i = 0, len = data.length; i < len; i++) {
		if (data[i].status != 4) {
			notFinishedList.push(data[i]);
			// flowProcedureBean.flag [0]办理状态（0：默认未办理；1：默认已办理）
			// [1]办理类型（0：必须办理；1：非必要办理）
			if (data[i].flowProcedureBean.flag.slice(0, 1) == '1') {
				finished++;
			} else if (data[i].flowProcedureBean.flag.slice(1, 2) == '1') {
				notNeed++;
			}
		} else if (data[i].status == 4) {
			finished++;
		}
	}

	// 百分比
	var percentage = (finished / processTotal * 100).toFixed(0);
	var htmlStr = '<em>' + percentage + '%</em><span>（已办理' + finished + '项</span><span>未办理' + (processTotal - finished) + '</span><span>共' + processTotal + '项）' +
		'（Processed：' + finished + '，</span><span>Incompleteness：' + (processTotal - finished) + '，</span><span>All：' + processTotal + '）</span>';
	$('#progressHandleProcedure').html(htmlStr)

	var html = "";
	if (parseInt(processTotal) > 0) {
		for (var i = 0; i < parseInt(processTotal); i++) {
			if (i < parseInt(finished)) {
				html += "<span style='background-color:#1C90E6'></span>"
			} else {
				html += "<span></span>"
			}
		}
		$("#progress-bar").html(html);
		$("#progress-bar span").width(parseInt(($("#progress-bar").width() - 20 * (parseInt(processTotal) - 1)) / parseInt(processTotal)));
	} else {
		$("#progress-bar").html("<div><p style='text-align:center;color:#AEAEAE'>您暂时没有办理的进程~</p></div>");
	}

	/** --------------------------分隔符------------------------------* */

	// 卡片背景颜色
	var colorClassList = [ 'bg-green-linear', 'bg-red-linear',
			'bg-orange-linear', 'bg-purple-linear' ];
	var htmlStr = '';
	for (var i = 0, len = notFinishedList.length; i < len; i++) {
		// limitClassStr:限制class， limitHtmlStr:限制html字符串
		var limitClassStr = '', limitHtmlStr = '', onclickStr = '';
		// flag【[0]0操作员不可办1操作员可办；[1]0学生不可办1学生可办
		if (notFinishedList[i].procedureBean.flag.slice(1, 2) == '1') {
			let startDate = notFinishedList[i].flowProcedureBean.startDate + " 00:00:00";
			let endDate = notFinishedList[i].flowProcedureBean.endDate + " 23:59:59";
			if (new Date(nowDateTime.replace(/-/g,"/")).getTime() < new Date(startDate.replace(/-/g,"/")).getTime()) {
				// 当前时间小于开始时间时
				limitHtmlStr = '<span class="disabled-tip"><span class="tip-zh">未开始</span><span class="tip-en">not started</span></span>';
			} else if (new Date(nowDateTime.replace(/-/g,"/")).getTime() > new Date(endDate.replace(/-/g,"/")).getTime()) {
				// 当前时间大于结束时间时
				limitHtmlStr = '<span class="disabled-tip"><span class="tip-zh">已结束</span><span class="tip-en">Completed</span></span>';
			} else {
				if (notFinishedList[i].procedureBean.id != 3 && notFinishedList[i].flowProcedureBean.flag.substring(5, 6) == '1') {
					if (notFinishedList[i].flowProcedureBean.config != null && notFinishedList[i].procedureBean.flag.slice(1, 2) == '1') {
						if (notFinishedList[i].flowProcedureBean.flag.substring(6, 7) == '1') {
							commonAjax({
								'type' : 'get',
								'url' : '/helper/des',
								'data' : {info: common_studentBean.sno},
								'successFunc' : function(o) {
									if (o && o.state === 200) {
										onclickStr = '<a class="layui-btn layui-btn-primary" href="javascript:void(0);" onclick="handleThridProcedure(\'' + notFinishedList[i].flowProcedureBean.config + '?synjones_ticket=' + encodeURIComponent(o.data) + '&synjones_type=pc\', '+notFinishedList[i].procedureBean.id+')">立即办理 / Process Promptly</a>';
									} else {
										onclickStr = '<a class="layui-btn layui-btn-primary" href="javascript:void(0);" onclick="handleThridProcedure(\'' + notFinishedList[i].flowProcedureBean.config + '\', '+notFinishedList[i].procedureBean.id+')">立即办理 / Process Promptly</a>';
									}
								},
								'errorFunc': function(o) {
									onclickStr = '<a class="layui-btn layui-btn-primary" href="javascript:void(0);" onclick="handleThridProcedure(\''+ notFinishedList[i].flowProcedureBean.config + '\', '+notFinishedList[i].procedureBean.id+')">立即办理 / Process Promptly</a>';
								}
							});
						} else {
							onclickStr = '<a class="layui-btn layui-btn-primary" href="javascript:void(0);" onclick="handleThridProcedure(\''+ notFinishedList[i].flowProcedureBean.config + '\', '+notFinishedList[i].procedureBean.id+')">立即办理 / Process Promptly</a>';
						}
					}
				} else {
					// 满足所有条件时
					onclickStr = '<a href="javascript:void(0);" class="layui-btn layui-btn-primary" onclick="handleProcedure(\''
						+ notFinishedList[i].procedureId + '\')"' + '>立即办理 / Process Promptly</a>';
				}
			}
		} else {
			// 不允许学生办理时
			limitHtmlStr = '<span class="disabled-tip"><span class="tip-zh">现场办理</span><span class="tip-en">On-site Process</span></span>';
		}
		let errorMsg = '';
		if (notFinishedList[i].procedureBean.id == failProcedureId) {
			errorMsg = '<p>接口获取数据异常，请联系图书馆</p>';
		}
		// 拼接html字符串
		htmlStr = htmlStr
				+ '<div class="swiper-slide '
				+ colorClassList[i % 4]
				+ ' process-crad '
				+ limitClassStr
				+ '">'
				+ '<div class="crad-content">'
				+ '<span class="iconbox">'
				+ '<i class="icon-'
				+ (notFinishedList[i].procedureBean.icon != null ? notFinishedList[i].procedureBean.icon
						: 'item') + '"></i>' + '</span>'
				+ '<div class="card-right"><div class="item-right-inner">'
			    + '<h4>' + notFinishedList[i].procedureBean.name + '</h4>'
			    + '<h6 style="white-space:nowrap;text-overflow: ellipsis; overflow: hidden;">' + notFinishedList[i].procedureBean.nameEn + '</h6>'
			    + '<p>' + notFinishedList[i].flowProcedureBean.startDate + '至(to)' + notFinishedList[i].flowProcedureBean.endDate + '</p>'
				+ errorMsg
				+ onclickStr + '</div>' + limitHtmlStr + '</div>' + '</div>' + '</div>';
	}
	$('#swiperWrapper').append(htmlStr);
	if ($('#swiperWrapper').find('.process-crad').length == 0) {
		$("#cardInfo").html("<div><p style='text-align:center;color:#AEAEAE'>您暂时没有未办事项~</p></div>");
	} else {
		// 未办事项滑动
		var swiper = new Swiper('.swiper-container', {
			slidesPerView : 'auto',
			spaceBetween : 30,
			freeMode : true,
		});
	}

}

/**
 * 查询热门新闻
 */
function setHotNoticeList() {
	commonAjax({
		'type': 'get',
		'url': '/notice/group',
		'data': {isPublish: 1, isExpire: 1, current: 1, pageSize: 13},
		'successFunc': function (result) {
			if (result.state == 200 && result.data != null && result.data.hotNoticeList != null && result.data.hotNoticeList.length > 0) {
				var noticeList = result.data.hotNoticeList;
				var hotNoticeHtml = '';
				for (var i = 0; i < noticeList.length; i++) {
					let notice = noticeList[i];
					hotNoticeHtml = hotNoticeHtml + '<div class="sx-item" onclick="goNewsDetail(\'' + notice.id + '\',\'hot\')">' + notice.title + '</div>';
				}
				$("#hotNoticeList").html(hotNoticeHtml);
				
			    //通知公告滚动滚动
				layui.carousel.render({
			      elem: '#message',
			      width: '100%', //设置容器宽度
			      height: '30px',
			      arrow: 'none', //始终显示箭头
			      anim: 'updown', //切换动画方式
			      autoplay: 'true',
			      indicator: 'none'
			    });
			} else {
				$("#userbox-notice").html('');
				$("#userbox-notice").html("<div><p style='text-align:center;line-height:38px;color:#AEAEAE;'>暂无通知（Nothing Temporally）~</p></div>");
			}
		},
		'errorFunc': function (result) {
			$("#userbox-notice").html('');
			$("#userbox-notice").html("<div><p style='text-align:center;line-height:38px;color:#AEAEAE;'>暂无通知（Nothing Temporally）~</p></div>");
		}
	});
}

/**
 * 查看通知详情
 * @param article_id
 */
function goNewsDetail(noticeId){
	window.location.href = webpath + "/notice/detail?flag=all&id=" + noticeId;
}

/**
 * 跳转到通知公告页面
 */
function goNoticeList(){
	window.location.href = webpath + "/notice/list";
}

/**
 * 余额捐赠
 */
function donation() {
	if (common_studentBean != null && common_flowBean != null && common_flowBean.flowType == 3) {
		var system_config = JSON.parse(getCookie('system_config'));
		if (system_config.userCode == 'xjtu') {
			commonAjax({
				'type': 'get',
				'url': '/donation',
				'dataType': 'json',
				'data': {studentId: common_studentBean.id, flowId: common_flowBean.id},
				'successFunc': function (result) {
					if (result != null && result.data.length == 0) {
						donationConfirm();
					}
				}
			});
		}
	}
}

/**
 * 更新话弹框
 */
function alert() {
	if (common_studentBean != null && common_flowBean == null && common_studentBean.identityCode == 20) {
		parent.layerAlert("系统还未获取到您的实际毕业时间，请于6月28日以后再进入系统办理。");
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
 * 余额捐赠弹框
 * @returns
 */
function donationConfirm () {
	var donationMsg = '<div class="modal-content">您是否需要将您的余额捐赠给学校呢?</div>'
		+ '<div class="modal-content">Do you need to donate your card balance to the school?</div>'
		+ '<p class="modal-font-s">快去右上角'
		+ '<span class="text-success">余额捐赠</span>去设置吧'
		+ '<br/>'
		+ 'Go to the top right corner to set up the '
		+ '<span class="text-success">card balance donation</span>'
		+ '</p>';
	layer.confirm(donationMsg, {
		closeBtn : 0,
		icon: 3,
		title: '系统提示system prompt',
		area: ['480px', '270px'],
		btn: ['现在就去，go now'],
		btnAlign: 'r',
		offset: '30%'
	}, function(index, layero) {
		toPage('user/donation')
	});
}