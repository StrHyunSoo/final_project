$(document).ready(function() {
	//// 나부터 다른거////

	var midldate = false;
	var prev = false;
	var startdate = [];
	var enddate = [];
	var green = [];
	var noReservation = [];
	var startday;
	var endday;
	var utcStartDate;
	var utcEndDate;

	// day 클경우 endDay    	    
	// day 작을경우 startDay    	    
	var Reservation = [
		{
			"year": 0,
			"month": 0,
			"day": 0
		},
		{
			"year": 0,
			"month": 0,
			"day": 0

		}
	]

	// 형식 yyyy-mm-dd
	clenderList.forEach(function(ele, index) {
		startdate.push(ele.startdate.split('T', 1)[0]);
		enddate.push(ele.enddate.split('T', 1)[0]);
	});

	var now = new Date();
	var month = now.getMonth();
	var year = now.getFullYear();

	function clearDate() {
		// 내가 누른거 색상 바꾸고.
		$("#calendar" + Reservation[0].day).css("background-color", "white");
		$("#calendar" + Reservation[1].day).css("background-color", "white");
		Reservation[0].year = 0;
		Reservation[0].month = 0;
		Reservation[0].day = 0;
		Reservation[1].year = 0;
		Reservation[1].month = 0;
		Reservation[1].day = 0;

		// 기존에 눌린 거 색상 바꾼다.
		for (let gre of green) {
			$("#calendar" + gre).css("background-color", "white");
		}
		// 다 지웠으니 초기화
		green = [];

	}

	function generateCalendar() {
		paintbutton();
		$("#month-year").text(new Date(year, month).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }));

		$("#days").empty();
		var numDays = new Date(year, month + 1, 0);

		var currentYear = $("#month-year").text().substring(0, 4).trim();
		var currentMonth = $("#month-year").text().replace('월', '');
		currentMonth = currentMonth.substring(5, 8).trim()

		// 달 형식 맞추려고 10 미만일경우 앞에 0 붙임
		var newMonth = "";
		if (Number(currentMonth) < 10) {
			newMonth = "0" + currentMonth;
		} else {
			newMonth = currentMonth;
		}

		var newday = 0;


		// 번호 돌리기
		for (var i = 1; i <= numDays.getDate(); i++) {

			// 7일 만 계산해서 요일표시
			var week = String(new Date(year, month + 1, i)).substring(0, 3);;
			if (i <= 7) {
				var num = String(i);
				$("." + num).html(week);
			}

			var day = $("<div class='child' id='calendar" + i + "'>").text(i);
			$("#days").append(day);
			//paintbutton(i);

			// 받아온 campCalender 만큼 반복
			for (var d = 0; d < clenderList.length; d++) {

				// 데이터가 있을 경우에만 
				if (clenderList != null) {

					// Start Day
					// 해당 년도 확인
					if (startdate[d].substring(0, 4).trim() == currentYear) {
						// 해당 월 확인
						if (startdate[d].substring(5, 7).trim() == newMonth) {

							// 문자열 맞추기 위해서 10 전이면 
							if (i < 10) {
								newday = 0;
								newday = newday + String(i);
							} else {
								newday = String(i);
							}
							// 해당 일 확인
							if (startdate[d].substring(8, 10).trim() == newday) {
								$("#calendar" + i).css('background-color', 'red');

								// 예약 불가날짜
								noReservation.push(i);
								midldate = true;
							}
						}
					}

					if (midldate == true) {
						$("#calendar" + i).css('background-color', 'red');
						noReservation.push(i);
					}

					// End Day
					// 해당 년도 확인
					if (enddate[d].substring(0, 4).trim() == currentYear) {
						// 해당 월 확인
						if (enddate[d].substring(5, 7).trim() == newMonth) {

							if (i < 10) {
								newday = 0;
								newday = newday + String(i);
							} else {
								newday = String(i);
							}

							// 해당 일 확인
							if (enddate[d].substring(8, 10).trim() == newday) {
								$("#calendar" + i).css('background-color', 'red');
								noReservation.push(i);
								midldate = false;

								if (prev = true) {

									if (Number(startdate[d].substring(8, 10).trim()) > Number(newday)) {
										var test = i;
										for (var tt = test; tt > 0; tt--) {
											$("#calendar" + tt).css('background-color', 'red');
											noReservation.push(i);
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//for 문 종료

		// 캘린더 숫자 눌렀을때
		$("#days .child").on("click", function() {
			// 불가능 한 날짜 배열

			var able = true;

			// 빨간 색상 인경우 선택 불가.
			if ($(this).css("background-color") != 'rgb(255, 0, 0)') {

				if (Reservation[0].year == 0 ||
					Reservation[1].year == 0) {

					$(this).css('background-color', 'green');

					var day = String($("#month-year").html());

					if (Reservation[0].year == 0) {
						Reservation[0].year = day.substr(0, 4);
						Reservation[0].month = day.substr(5, day.length).replace("월", "").trim();
						Reservation[0].day = $(this).html();
					} else {
						// 모든 값이 들어온 경우.
						Reservation[1].year = day.substr(0, 4);
						Reservation[1].month = day.substr(5, day.length).replace("월", "").trim();
						Reservation[1].day = $(this).html();

						// 페인트 입히기
						paintbutton();

					}
				}
			}
			// 힌색 넣자
		});

		function calculation(Reservation) {

			startday = Reservation[0];
			endday = Reservation[1];
			var buffer = {
				"year": 0,
				"month": 0,
				"day": 0
			}


			// 시작년 과 종료 년이 같을경우
			if (Number(startday.year) == Number(endday.year)) {

				// 시작달과 종료달이 같은결우
				if (Number(startday.month) == Number(endday.month)) {

					// 시작일 이 종료일 보다 크면
					if (Number(startday.day) > Number(endday.day)) {
						buffer.day = startday.day;
						startday.day = endday.day;
						endday.day = buffer.day;
					}

					// 시작 달이 종료 달 보다 더 큰경우
				} else if (Number(startday.month) > Number(endday.month)) {
					buffer.month = startday.month;
					buffer.day = startday.day;
					startday.month = endday.month;
					startday.day = endday.day;
					endday.month = buffer.month;
					endday.day = buffer.day;
				}

				// 시작 년이 종료 년 보다 더 큰경우
			} else if (Number(startday.year) > Number(endday.year)) {
				buffer = startday;
				startday = endday;
				endday = buffer;
			}

			Reservation[0] = startday;
			Reservation[1] = endday;
			startday = Reservation[0];
			endday = Reservation[1];

		}

		function paintbutton() {

			// 앞뒤 데이터를 [0] 에 더 작은 날짜 [1] 에 더큰날짜를 넣어준다.
			calculation(Reservation);

			outter: for (var a = 0; a < 34; a++) {



				// 기본 적으로 둘다 데이터가 있는경우 에만 실행
				if (Reservation[0].year > 1 && Reservation[1].year > 1) {

					// 몇일 차이나는지 구하는 로직
					startday = new Date(Reservation[0].year, Reservation[0].month, Reservation[0].day);
					endday = new Date(Reservation[1].year, Reservation[1].month, Reservation[1].day);

					var diff = endday.getTime() - startday.getTime();
					diff = diff / (1000 * 60 * 60 * 24);

					var yea = $("#month-year").html().substring(0, 4).trim();
					var mon = $("#month-year").html().substring(4, $("#month-year").html().length).replace("년", "").replace("월", "").trim();

					var planday = startday;
					inner: for (var j = 0; j <= diff; j++) {

						if (planday.getFullYear() == yea) {
							if (planday.getMonth() == mon) {
								if (planday.getDate() == a) {
									if ($("#calendar" + planday.getDate()).css("background-color") != 'rgb(255, 0, 0)') {
										// 그린넣어주고 클린할떄 없앤다.
										green.push(planday.getDate());
										$("#calendar" + planday.getDate()).css("background-color", "green");
									} else { //red 를 만났다.
										bred = true;
										// 예약을 초기화 시켜야해.
										clearDate(Reservation);
										alert("예약 불가능한 날짜입니다.");
										break outter;
									}
								}
							}
						}

						// 12 월달은 계산식이 달라서 추가.
						if (planday.getMonth() == "0" && mon == "12") {

							if ($("#calendar" + planday.getDate()).css("background-color") != 'rgb(255, 0, 0)') {
								// 그린넣어주고 클린할떄 없앤다.
								green.push(planday.getDate());
								$("#calendar" + planday.getDate()).css("background-color", "green");
							} else { //red 를 만났다.
								bred = true;
								// 예약을 초기화 시켜야해.
								clearDate(Reservation);
								alert("예약 불가능한 날짜입니다.");
								break outter;
							}
						}
						// 시작날짜부터 다른만큼 하나씩 올림
						planday.setDate(startday.getDate() + 1);
					}
				}
			}
		}
		// 포문 종료
	}
	generateCalendar();


	$("#reservation").click(function() {
		//팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
		$("#RVpopup").css('display', 'flex').hide().fadeIn();

		var startDate = new Date(Reservation[0].year, Reservation[0].month - 1, Reservation[0].day);
		var endDate = new Date(Reservation[1].year, Reservation[1].month - 1, Reservation[1].day);

		utcStartDate = startDate;
		utcEndDate = endDate;


		$("#start-day cite").html(utcStartDate);
		$("#end-day cite").html(utcEndDate);

		// 보내줄 앤데 하루가 자꾸 내려가서 올림...
		utcStartDate.setDate(utcStartDate.getDate() + 1);
		utcEndDate.setDate(utcEndDate.getDate() + 1);


	});

	$("#RVclose").click(function() {
		rvmodalClose(); //모달 닫기 함수 호출
	});

	$("#RVconfirm").click(function() {
		// 예약 
		clickCampReservation();
		
		alert("예약이 완료 되었습니다.");

		// 캘린더 다시 load();
		generateCalendar();

		// 모달 닫기 함수 호출
		rvmodalClose(); //모달 닫기 함수 호출
	});

	function rvmodalClose() {
		$("#RVpopup").fadeOut(); //페이드아웃 효과
	}

	$("#reset").on("click", function() {
		clearDate();
	});

	$("#prev-month").on("click", function() {
		if (month == 0) {
			month = 11;
			year--;
		} else {
			month--;
		}
		midldate = false;
		prev = true;
		generateCalendar();
	});

	$("#next-month").on("click", function() {
		if (month == 11) {
			month = 0;
			year++;
		} else {
			month++;
		}
		prev = false;
		generateCalendar();
	});

	//////////////////////달력 끝 /////////////////////////
	//////////////////////댓글 기능/////////////////////////



	let crno = "";
	let listGroup = $(".sec4 .box4");

	//// 별점 관리 /////
	var grade = $(".starrr").html();
	$(".starrr").html("");

	$('.starrr').starrr({
		rating: grade,
		change: function(e, value) {
			if (value) {
				grade = value
			}
		}
	});

	$("#modal-open").click(function() {
		//팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
		$("#popup").css('display', 'flex').hide().fadeIn();

		// 로드시 숫자를 -> ☆ 로 바꿈 
		$("#sync_star").html(getStar($("#sync_star").html()));
	});

	// 리뷰 작성 모달 닫기
	$("#close").click(function() {
		modalClose(); //모달 닫기 함수 호출
	});

	// 리뷰 작성 버튼 클릭
	$("#confirm").click(function() {
		clickCampConfirm();
	});

	// 리뷰 수정 모달 닫기
	$(".modify-close").click(function() {
		modifyModalClose(); //모달 닫기 함수 호출
	});

	// 리뷰 수정
	$(".modify-confirm").click(function() {
		var crno = $(".crno").val();
		replyModify(crno);
		modifyModalClose(); //모달 닫기 함수 호출
	});

	// 리뷰 작성 모달 닫기
	function modalClose() {
		$("#popup").fadeOut(); //페이드아웃 효과
	}

	// 리뷰 수정 모달 닫기
	function modifyModalClose() {
		$("#modify-popup").fadeOut(); //페이드아웃 효과
	}

	function getStar(grade) {
		let star = '';
		for (let i = 1; i <= 5; i++) {
			if (i <= grade) star += '★';
			else star += '☆';
		}
		return star;
	}
	function setStar() {
		let grade = $("#sync_star").html();
		$("#item_star").html("<div id='sync_star'></div>");
		$("#sync_star").starrr({
			readOnly: true,
			rating: grade
		});
		$("#sync_star").append(Math.round(grade * 10) / 10);
	}



	// 댓글 수정 모달 열기
	listGroup.on('click', '.modify', function(event) {
		var crno = $(this).attr('id');
		getReview(crno);

		//팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
		$("#modify-popup").css('display', 'flex').hide().fadeIn();
	});

	//댓글 삭제
	listGroup.on('click', '.remove', function(event) {
		var crno = $(this).attr('id');
		removeReview(crno);
	});

	//하트 추가
	listGroup.on('click', '.saveHeart', function() {
		var cno = $(this).attr('id');
		var hlno = $(this).attr('data-id');
		var heart = $(this);
		saveHeart(cno, heart, hlno);
	});

	//하트 삭제
	listGroup.on('click', '.removeHeart', function() {
		var cno = $(this).attr('id');
		var hlno = $(this).attr('data-id');
		var heart = $(this);

		removeHeart(cno, heart, hlno);
	});

	// 이미지 클래스 data-id 변경 메서드
	function changeHeartImg(flag, heart, hlno) {
		heart.attr("src", flag ? "../img/full_heart.png" : "../img/empty_heart.png");

		if (flag) {
			heart.removeClass("saveHeart");
			heart.addClass("removeHeart");
			heart.attr("data-id", hlno.hlno);
		} else {
			heart.removeClass("removeHeart");
			heart.addClass("saveHeart");
			heart.attr("data-id", hlno);
		}

	};

	function loadJSON() {

		// 날씨 테스트 
		weatherFindData(start, end);

		$.getJSON('/camp/reply/list/' + cno, function(arr) {

			let str = "";
			const [reply, member] = arr;

			$.each(reply, function(index, reply) {
				let direction = index % 2 == 0 ? 'l' : 'r';
				crno = reply.crno;
				str += "<div class='rv_" + direction + "'box5>";
				str += "<div class='box_l' box6>";
				str += "<div class='imgbox box7'>";
				str += "<a class='imglink box8' href=''>";
				str += "<img class='rv_img item' src=" + reply.capture + ">";
				str += "</a>";
				str += "</div>";
				str += "<div class='rv_star box7_2'>";
				str += "<p class='item'>" + getStar(reply.star) + "</p>";
				str += "</div>";
				str += "</div>";
				str += "<div class='box_r box6'>";
				str += "<div class='comment box7'>";
				str += "<h2 class='write item' >" + reply.reviewer + "</h2>";
				str += "</div>";
				str += "<p class='content item_2'>" + reply.content + "</p>";
				str += "</div>";
				str += "<div class='rv_like box7'>";
				str += "<i class='fa-sharp fa-solid fa-thumbs-up fa-1x item'></i>"
				str += "</div>";

				var heartData = "";
				try {
					heartData = JSON.parse(heartCheck(reply.crno));
				} catch {

				}

				// 하트 한 항목이라면 ?
				if (Number(heartData.hlno) > 0) {
					// 눌렷을때 행동을 class Name 으로줌
					str += "<img class='removeHeart' id=" + reply.crno + " data-id= " + heartData.hlno + " width=30px height=30px src='../img/full_heart.png'>";
				} else {
					str += "<img class='saveHeart' id=" + reply.crno + " data-id= 'empty' width=30px height=30px src='../img/empty_heart.png'>";
				}


				if (member.nickname == reply.reviewer) {
					str += '<div class="modify-box">';
					str += '      <button class="modify" id=' + reply.crno + '>수정</button>';
					str += '      <button class="remove" id=' + reply.crno + '> 삭제</button>';
					str += '</div>';
				}

				str += "</div>";
				str += "</div>";

			})
			setStar();
			listGroup.html(str);
		})
	};

	function saveHeart(cno, heart) {
		$.ajax({
			url: "/heart/save",
			contentType: "application/json",
			method: "post",
			data: JSON.stringify({
				productNum: cno,
				productType: "CAMPREVIEW",
				// 동기처리
				async: false
			}), success: function(hlno) {
				console.log("성공");
				changeHeartImg(true, heart, hlno);
			}
		})
	}

	function removeHeart(cno, heart, hlno) {
		$.ajax({
			url: "/heart/remove",
			contentType: "application/json",
			method: "DELETE",
			data: JSON.stringify({
				hlno: Number(hlno),
				productNum: cno,
				async: false,
				productType: "CAMPREVIEW",
			}), success: changeHeartImg(false, heart, hlno),
			fail: console.log("실패")
		})
	}

	// 하트 확인 메서드
	function heartCheck(no) {
		return $.ajax({
			url: "/heart/getOne",
			contentType: "application/json",
			// 동기처리
			async: false,
			method: "POST",
			data: JSON.stringify({
				productNum: no,
				productType: "CAMPREVIEW"
			}), dataType: "json"
		}).responseText
	}

	function clickCampConfirm() {

		$.ajax({
			url: "/camp/review/register",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				content: $("#content").val(),
				capture: $("#picture").val(),
				star: $("#select_star").data('starrr').options.rating,
				cno: cno

			}),
			success: function(result) {
				$("#item_heart").html(result);
				loadJSON();
				modalClose();
			},
			error: function(err) {
				alert("로그인 후 이용하실수 있습니다.");
				location.href = "/camp/campgroundsdetail/{cno}/login";
			}
		});
	}

	function clickCampReservation() {
		
		$.ajax({
			url: "/camp/calendar/register",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				cno: cno,
				startdate: utcStartDate,
				enddate: utcEndDate
			}),
			success: function(reuslt) {

			},
			error: function(err) {

			}
		})
	}

	function removeReview(crno) {

		$.ajax({
			url: "/camp/review/" + Number(crno),
			method: "DELETE",
			success: loadJSON()
		})
	}

	async function getReview(crno) {
		const result = await $.get("/camp/reply/one/" + crno)

		var regdate = result.regdate;
		var capture = result.capture;
		var heart = result.heart;
		var star = result.star;
		var content = result.content;

		$("#modify-content").val(content);
		$("#modify-select_star").val(getStar(star));
		$(".crno").val(crno);
		$(".regdate").val(regdate);
		$(".heart").val(heart);
	}

	function replyModify(crno) {
		$.ajax({
			url: "/camp/reply/modify",
			contentType: "application/json",
			method: "PUT",
			data: JSON.stringify({
				cno: cno,
				crno: crno,
				capture: $("#modify-picture").val(),
				content: $("#modify-content").val(),
				star: $("#modify-select_star").data('starrr').options.rating,
				regdate: $(".regdate").val()
			})
		})
	}

	$(".weather-container").on("click", ".prev", function() {
		if (start > 0) {
			start -= viewSize;
			end -= viewSize;
			weatherFindData(start, end);
		}
	});

	$(".weather-container").on("click", ".next", function() {
		if (end < 38) {
			start += viewSize;
			end += viewSize;
			weatherFindData(start, end);
		}else{
			alter("오늘 날짜로부터 5일 뒤의 정보 까지만 제공됩니다.");
		}
	});


	var $WeatherContainer = $(".weather-container");
	var viewSize = 3;
	var start = 0;
	var end = viewSize;

	function weatherFindData(start, end) {
		var num = calcLocationToNum();

		var apiURI = "http://api.openweathermap.org/data/2.5/forecast?id=" + num + "&appid=69e3983d301e56b958de5f85e38f463c"
		$.ajax({
			url: apiURI,
			dataType: "json",
			type: "GET",
			async: "false",
			success: function(data) {

				// 반복할 껀데 첫번째 데이터가 15:00 라 날짜 맞추려면.. 
				// 3시간 간격 처음만 3개 후 8개씩 마지막은또 4개  총 40개 3/8/8/8/8/4 
				var str = "";
				str += '<button class="prev">prev</button>';

				var title = data.list[start].dt_txt.substring(5, 10);

				str += '<div class="date">' + title + '</div>';


				for (var i = start; i < end; i++) {

					var time = data.list[i].dt_txt.substring(10, 16);

					str += `<div class="weather-re">
								<div class="weatherbox">
									<div class="weather-info">
										<div class="date">${time}</div>`

					var weatherID = data.list[i].weather[0].id;
					
					// weatherID별 날씨 표시
					switch (true) {
						case (weatherID >= 200 && weatherID <= 599): // 비
							str += '<img class="weather-img" src="../img/rain.png">';
							break;
						case (weatherID >= 600 && weatherID <= 699): // 눈
							str += '<img class="weather-img" src="../img/snow.png">';
							break;
						case (weatherID >= 700 && weatherID <= 804): // 구름
							str += '<img class="weather-img" src="../img/cloud.png">';
							break;
						case (weatherID = 800): // 해
							if (Number(time) > 20 || Number(time) < 6) {
								str += '<img class="weather-img" src="../img/moon.png">';
							} else {
								str += '<img class="weather-img" src="../img/sun.png">';
							}
							break;
					}

					var wind = data.list[i].wind.speed;
					str += `<div class="wind">풍속: ${wind}m/s</div>
									</div>
								</div>
							</div>`;
				}

				// 시작 위치를 바꿔야해서 올림

				str += '<button class="next">next</button>';

				$WeatherContainer.html(str);
			}
		})
	}

	function calcLocationToNum() {

		var num = "";

		switch (result.location) {

			case "서울시": num = 1835847; break;
			case "부산시": num = 1838519; break;
			case "대구시": num = 1835327; break;
			case "인천시": num = 1843561; break;
			case "광주시": num = 1841808; break;
			case "대전시": num = 1835224; break;
			case "울산시": num = 1833742; break;
			case "세종시": num = 1835224; break;
			case "경기도": num = 1841610; break;
			case "강원도": num = 1843125; break;
			case "충청남도": num = 1845105; break;
			case "충청북도": num = 1845106; break;
			case "전라남도": num = 1845788; break;
			case "전라북도": num = 1845789; break;
			case "경상남도": num = 1902028; break;
			case "경상북도": num = 1841597; break;
			case "제주도": num = 1846265; break;
		}

		return num;
	}

	//프로그램 처음 로드시 loadJSON 호출;
	// 밑에서 해야함
	loadJSON();

});