$(document).ready(function() {
	var system_config = JSON.parse(getCookie('system_config'));
	if (system_config == null) {
		commonAjax({
			'type': 'get',
			'url': '/helper/systemConfig',
			'dataType': 'json',
			'successFunc': function (result) {
				if (result != null && result.state == 200) {
					setCookie('system_config', JSON.stringify(result.data));
					setCookie('systemType', "yingxin_student_pc");
					system_config = result.data
					if (result.data.userName != null && result.data.userName != '' && typeof result.data.userName !== 'undefined') {
						$('#footer_content').text("© 2019 " + result.data.userName + ".版权所有");
					} else {
						$('#footer').hide();
					}
				} else {
					$('#footer').hide();
				}
			},
			'errorFunc': function (result) {
				$('#footer').hide();
			}
		});
	} else {
		if (system_config.userName != null && system_config.userName != '' && typeof system_config.userName !== 'undefined') {
			$('#footer_content').text("© 2019 " + system_config.userName + ".版权所有");
		} else {
			$('#footer').hide();
		}
	}
});