﻿calendarBlitzApp.controller('calendarBlitzInitController', function ($scope, $route, calendarBlitzModel, $routeParams, $location, $log, $q, $timeout) {
	$scope.loadingShow = loadingShow;
	$scope.loadingHide = loadingHide;
	$scope.allWeeks = [];
	$scope.success = false;
	$scope.showFeedback = function () {
		$("#feedbackModal").modal("show");
	};

	$scope.saveFeedback = function () {
		$scope.success = "";
		$scope.success = false;
		$scope.loadingShow();
		var feebackNumber = $('#mRadio input[name=optradio]:checked').val();
		var feedbackObservations = $scope.observations;
		calendarBlitzModel.saveFeedback(feebackNumber, feedbackObservations).then(function (result) {
			var data = result.d;
			try {
				var dataJson = $.parseJSON(data);
				if (dataJson.status === "ok") {
					try {
						//$("#feedbackModal").modal("hide");
						$('#mRadio input[name=optradio]').each(function (index, value) {
							$(this).prop('checked', false);
						});
						$scope.observations = "";
						$scope.success = true;
						$scope.loadingHide();
					} catch (exception) {
						$scope.loadingHide();
						message("Error", "Attention", "error");
					}
				} else {
					$scope.loadingHide();
					message("Error", "Attention", "error");
				}

			} catch (e) {
				$scope.loadingHide();
				message("Error", "Attention", "error");

			}
			return false;
		});

	}
});

calendarBlitzApp.controller('calendarBlitzController', function ($scope, calendarBlitzModel, getJson, $route, $routeParams, $location, $log, $q, $timeout) {
	$scope.loadingShow = loadingShow;
	$scope.loadingHide = loadingHide;
	$scope.allWeeks = [];
	$scope.months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	$scope.dateSelected = "";
	$scope.semana1 = [];
	$scope.semana2 = [];
	$scope.semana3 = [];
	$scope.semana4 = [];
	$scope.semana5 = [];

	$scope.collect = function () {
		var ret = {};
		var len = arguments.length;
		for (var i = 0; i < len; i++) {
			for (p in arguments[i]) {
				if (arguments[i].hasOwnProperty(p)) {
					ret[p] = arguments[i][p];
				}
			}
		}
		return ret;
	}

	//TODO revisar funcionamiento
	$scope.containsObject = function (list, obj) {
		if (list.length === 0) return true;

		for (var i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return false;
			}
		}
		return true;
	}

	$scope.containsObject2 = function (obj, list) {
		if (list.length === 0) return true;

		for (var i = 0; i < list.length; i++) {
			if (list[i].eventId === obj.eventId) {
				return false;
			}
		}
		return true;
	}

	$scope.getEvents = function () {
		var evReport = [];
		var len = arguments.length;
		var cond = false;
		for (var i = 0; i < len; i++) {
			angular.forEach(arguments[i], function (item) {
				angular.forEach(item.Events, function (field) {
					cond = $scope.containsObject2(field, evReport);
					if (cond) {
						evReport.push(field);
					}
					//evReport.push(field);
				});
			});
		}
		return evReport;
	}

	$scope.getEventsActualDate = function () {
		$scope.loadingShow();
		calendarBlitzModel.getEventsActualDate().then(function (result) {
			var data = result.d;
			try {
				var dataJson = $.parseJSON(data);
				if (dataJson.status === "ok") {
					try {
						$scope.semana1Ori = dataJson.semana1;
						$scope.semana2Ori = dataJson.semana2;
						$scope.semana3Ori = dataJson.semana3;
						$scope.semana4Ori = dataJson.semana4;
						$scope.semana5Ori = dataJson.semana5;

						$scope.semana1 = dataJson.semana1;
						$scope.semana2 = dataJson.semana2;
						$scope.semana3 = dataJson.semana3;
						$scope.loadNav($scope.semana3);
						$scope.semana4 = dataJson.semana4;
						$scope.semana5 = dataJson.semana5;
						$scope.allWeeks = $scope.getEvents($scope.semana1, $scope.semana2, $scope.semana3, $scope.semana4, $scope.semana5);
						$scope.tales = "stop";
						$scope.loadingHide();
						$scope.loadingHide();
					} catch (exception) {
						$scope.loadingHide();
						$scope.loadingHide();
						message("Error", "Attention", "error");
					}
				} else {
					$scope.loadingHide();
					$scope.loadingHide();
					message("Error", "Attention", "error");
				}

			} catch (e) {
				$scope.loadingHide();
				$scope.loadingHide();
				message("Error", "Attention", "error");

			}

			return false;
		});
	}

	$scope.getEventsActualDate();


	$scope.getEventById = function (ev) {
	    $scope.loadingShow();

	    calendarBlitzModel.getEventById(ev.myId, ev.TypeCalendar).then(function (result) {
	        var data = result.d;
	        try {
	            $scope.loadingHide();
	            var dataJson = $.parseJSON(data);
	            if (dataJson.status === "ok") {
	                try {
	                    $scope.actualEvent = dataJson.data;
	                    if (ev.TypeCalendar === 'Campaigns') {
	                        $("#modaltactic-campaign").modal("show");
	                    } else {
	                        $("#modaltactic-blitz").modal("show");
	                    }

	                    
	                } catch (exception) {
	                    $scope.loadingHide();
	                    message("Error", "Attention", "error");
	                }
	            } else {
	                $scope.loadingHide();
	                message("Error", "Attention", "error");
	            }

	        } catch (e) {
	            $scope.loadingHide();
	            message("Error", "Attention", "error");

	        }

	        return false;
	    });
	};


	$scope.showDetails = function (ev, close) {
		if (close) {
			$("#myModal").modal("hide");
		}
		$scope.getEventById(ev);
		//$scope.actualEvent = ev;
		//$("#modaltactic").modal("show");
	}

	$scope.showEvents = function (events) {
		$scope.dayEvents = events;
		$("#myModal").modal("show");
	}

	$scope.navMonth = {
		back: "",
		next: "",
		current: [],
		currentDate: ""
	};

	$scope.buildSelect = function (actualDate, first) {
		$scope.navMonth.current = [];
		for (var i = 0; i <= 12; i++) {
			$scope.select = {
				date: "",
				selected: ""
			};
			$scope.select.date = new Date(new Date(first).setMonth(first.getMonth() + i));
			var act = $scope.select.date.toDateString();
			var cur = actualDate.toDateString();
			if (act === cur) {
				$scope.select.selected = true;
				$scope.navMonth.currentDate = actualDate;
				$scope.navMonth.current.push($scope.select);
			} else {
				$scope.select.selected = false;
				$scope.navMonth.current.push($scope.select);
			}
		}
	};

	$scope.actualDateNav = "";


	$scope.clearFilters = function () {
		
		$scope.loadMultiselects();
		
		$scope.teatrosSeleccionados = [];
		

	}

	$scope.loadNav = function (semana3) {
		var actualDate = new Date(semana3[0].Date);
		$scope.actualDateNav = actualDate;
		var back = new Date(new Date(actualDate).setMonth(actualDate.getMonth() - 1));
		var next = new Date(new Date(actualDate).setMonth(actualDate.getMonth() + 1));
		var first = new Date(new Date(actualDate).setMonth(actualDate.getMonth() - 6));

		$scope.buildSelect(actualDate, first);
		$scope.navMonth.back = back;
		$scope.navMonth.next = next;
		//$scope.clearFilters();

	};


	$scope.getEventsByMonthYear = function (date) {
		var year = 0;
		var month = 0;
		if (date) {
			year = new Date(date).getFullYear();
			month = new Date(date).getMonth() + 1;
		} else {
			date = $scope.dateSelected;
			year = new Date(date).getFullYear();
			month = new Date(date).getMonth() + 1;
		}

		if ($scope.existeBusqueda()) {
		    var campBlitzName = ($scope.CampBlitzName !== undefined) ? $scope.CampBlitzName : "";
		    var agencyInternal = ($scope.agencyInternal !== undefined) ? $scope.agencyInternal : "";
		    var teatrosSeleccionados = ($scope.theater !== undefined) ? $scope.theater : "";

		    $scope.searchServer(date, teatrosSeleccionados, campBlitzName, agencyInternal);
			$scope.getEventsByMonthYear2(date);
		} else {
			$scope.loadingShow();
			calendarBlitzModel.getEventsByMonthYear(month, year).then(function (result) {
				var data = result.d;
				try {
					var dataJson = $.parseJSON(data);
					if (dataJson.status === "ok") {
						try {

							$scope.semana1Ori = dataJson.semana1;
							$scope.semana2Ori = dataJson.semana2;
							$scope.semana3Ori = dataJson.semana3;
							$scope.semana4Ori = dataJson.semana4;
							$scope.semana5Ori = dataJson.semana5;

							$scope.semana1 = dataJson.semana1;
							$scope.semana2 = dataJson.semana2;
							$scope.semana3 = dataJson.semana3;
							$scope.loadNav($scope.semana3);
							$scope.semana4 = dataJson.semana4;

							$scope.semana5 = dataJson.semana5;
							$scope.allWeeks = $scope.getEvents($scope.semana1, $scope.semana2, $scope.semana3, $scope.semana4, $scope.semana5);
							//trae los datos //validar si existen filtros

							$scope.loadingHide();
							$scope.loadingHide();
						} catch (exception) {
							$scope.loadingHide();
							$scope.loadingHide();
							message("Error", "Attention", "error");
						}
					} else {
						$scope.loadingHide();
						$scope.loadingHide();
						message("Error", "Attention", "error");
					}

				} catch (e) {
					$scope.loadingHide();
					$scope.loadingHide();
					message("Error", "Attention", "error");

				}

				return false;
			});
		}
	};

	$scope.getEventsByMonthYear2 = function (date) {
		var year = 0;
		var month = 0;
		if (date) {
			year = new Date(date).getFullYear();
			month = new Date(date).getMonth() + 1;
		} else {
			date = $scope.dateSelected;
			year = new Date(date).getFullYear();
			month = new Date(date).getMonth() + 1;
		}
		$scope.loadingShow();
		calendarBlitzModel.getEventsByMonthYear(month, year).then(function (result) {
			var data = result.d;
			try {
				var dataJson = $.parseJSON(data);
				if (dataJson.status === "ok") {
					try {
						$scope.semana1Ori = dataJson.semana1;
						$scope.semana2Ori = dataJson.semana2;
						$scope.semana3Ori = dataJson.semana3;
						$scope.semana4Ori = dataJson.semana4;
						$scope.semana5Ori = dataJson.semana5;
						$scope.loadingHide();
						$scope.loadingHide();
					} catch (exception) {
						$scope.loadingHide();
						$scope.loadingHide();
						message("Error", "Attention", "error");
					}
				} else {
					$scope.loadingHide();
					$scope.loadingHide();
					message("Error", "Attention", "error");
				}

			} catch (e) {
				$scope.loadingHide();
				$scope.loadingHide();
				message("Error", "Attention", "error");

			}

			return false;
		});
	}


	//Filtrado del calendario
	//Carga de datos en los selects y checkbox
	$scope.getAndLoadData = function (nameList) {
		getJson.get(nameList).success(function (data) {
			$scope[nameList] = data;
		});
	}

	$scope.getAndLoadData('theaterList');
	// fin de carga


	//FUNCIONES PARA CARGA DE SELECTS DESDE BASE DE DATOS -- SERVICIO WEB
	$scope.loadSelect = function (service, idToLoad, param) {
		$scope.loadingShow();
		var vistaActual = (param !== undefined) ? param : "fake";
		var datae = { 'vista': vistaActual };
		calendarBlitzModel.loadSelect(service, datae).then(function (result) {
			var data = result.d;
			try {
				$scope.loadingHide();
				var dataJson = $.parseJSON(data);
				if (dataJson.status === "ok") {
					try {

						$scope[idToLoad] = "";
						$scope[idToLoad] = dataJson.data;
						$scope.loadingHide();
					} catch (exception) {
						$scope.loadingHide();
						message("Error", "Attention", "error");
					}
				} else {
					$scope.loadingHide();
					message("Error", "Attention", "error");
				}

			} catch (e) {
				$scope.loadingHide();
				message("Error", "Attention", "error");

			}

			return false;
		});
	};



	/**  INICIO DEL FILTRO  **/
	$scope.searchServer = function (actualDate, teatrosSeleccionados, campBlitzName, agencyInternal) {
		$scope.loadingShow();
		$scope.semana1 = {};
		$scope.semana2 = {};
		$scope.semana3 = {};
		$scope.semana4 = {};
		$scope.semana5 = {};
		calendarBlitzModel.searchServerV2(actualDate, teatrosSeleccionados, campBlitzName, agencyInternal).then(function (result) {
			var data = result.d;
			try {

				var dataJson = $.parseJSON(data);
				if (dataJson.status === "ok") {
					try {

						$scope.semana1Ori = dataJson.semana1;
						$scope.semana2Ori = dataJson.semana2;
						$scope.semana3Ori = dataJson.semana3;
						$scope.semana4Ori = dataJson.semana4;
						$scope.semana5Ori = dataJson.semana5;

						$scope.semana1 = dataJson.semana1;
						$scope.semana2 = dataJson.semana2;
						$scope.semana3 = dataJson.semana3;
						$scope.loadNav($scope.semana3);
						$scope.semana4 = dataJson.semana4;
						$scope.semana5 = dataJson.semana5;
						$scope.allWeeks = $scope.getEvents($scope.semana1, $scope.semana2, $scope.semana3, $scope.semana4, $scope.semana5);
						$scope.loadingHide();
						$scope.loadingHide();
					} catch (exception) {
						$scope.loadingHide();
						$scope.loadingHide();
						message("Error", "Attention", "error");
					}
				} else {
					$scope.loadingHide();
					$scope.loadingHide();
					message("Error", "Attention", "error");
				}

			} catch (e) {
				$scope.loadingHide();
				$scope.loadingHide();
				message("Error", "Attention", "error");

			}
			return false;
		});


	};

	$scope.existeBusqueda = function () {
	    var campBlitzName = ($scope.CampBlitzName !== undefined) ? $scope.CampBlitzName : "";
	    var agencyInternal = ($scope.agencyInternal !== undefined) ? $scope.agencyInternal : "";
	    var teatrosSeleccionados = ($scope.theater !== undefined) ? $scope.theater : "";

	    if (campBlitzName || agencyInternal || teatrosSeleccionados) {
			return true;
		}
		return false;
	};


	$scope.search = function () {
	    var campBlitzName = ($scope.CampBlitzName !== undefined) ? $scope.CampBlitzName : "";
	    var agencyInternal = ($scope.agencyInternal !== undefined) ? $scope.agencyInternal : "";
		var teatrosSeleccionados = ($scope.theater !== undefined) ? $scope.theater : "";
		var semana3 = $scope.semana3;
		var actualDate = new Date(semana3[0].Date);
		$scope.searchServer(actualDate, teatrosSeleccionados, campBlitzName, agencyInternal);
		$scope.getEventsByMonthYear2(actualDate);

	};

	$scope.showAll = function () {
		$scope.loadingShow();
		var semana3 = $scope.semana3;
		var actualDate = new Date(semana3[0].Date);
		$scope.getEventsByMonthYear(actualDate);
		$scope.loadingHide();
	};

	/* Filtrado por teatro */
	$scope.filterByTheatre = function (teatro) {
		$scope.theater = teatro;
		$scope.search();


	};


	///***  COMIENZA EL EXPORT ***///


	$scope.doExport = function (params) {
		var options = {
			tableName: 'FeedBacks',
			worksheetName: 'FeedBacks'
		};
		$.extend(true, options, params);
		$('#reporte').tableExport(options);
	};

	$scope.toExcel = function () {
		$scope.doExport({ type: 'excel' });
	};

	$scope.changeToMontly = function () {
		$scope.montly = true;

		$("#weeklytable").removeClass("display");
		$("#weeklytable").addClass("hide");
		$("#weeklytabletabs").removeClass("display");
		$("#weeklytabletabs").addClass("hide");

		$("#monthlytable").removeClass("hide");
		$("#monthlytable").addClass("display");
		$("#monthlytablehdr").removeClass("hide");
		$("#monthlytablehdr").addClass("display");
	};

	$scope.changeToWeekly = function () {
		$scope.montly = false;

		$("#weeklytable").removeClass("hide");
		$("#weeklytable").addClass("display");
		$("#weeklytabletabs").removeClass("hide");
		$("#weeklytabletabs").addClass("display");

		$("#monthlytable").removeClass("display");
		$("#monthlytable").addClass("hide");
		$("#monthlytablehdr").removeClass("display");
		$("#monthlytablehdr").addClass("hide");
	};

	$scope.changeToWeekly();

	Date.prototype.getWeekOfMonth = function (exact) {
		var month = this.getMonth()
			, year = this.getFullYear()
			, firstWeekday = new Date(year, month, 1).getDay()
			, lastDateOfMonth = new Date(year, month + 1, 0).getDate()
			, offsetDate = this.getDate() + firstWeekday - 1
			, index = 1 // start index at 0 or 1, your choice
			, weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
			, week = index + Math.floor(offsetDate / 7)
		;
		if (exact || week < 2 + index) return week;
		return week === weeksInMonth ? index + 5 : week;
	};

	var date = new Date();
	var foo = date.getWeekOfMonth();


	console.log(foo);

	$scope.weeksIds = [{ 'id': 0, 'name': 'mon' }, { 'id': 1, 'name': 'tue' }, { 'id': 2, 'name': 'wed' }, { 'id': 3, 'name': 'thu' }, { 'id': 4, 'name': 'fri' }];
	$scope.setActualWeek = function () {
		var bar = date.getWeekOfMonth(true);
		var week = bar - 1;
		angular.forEach($scope.weeksIds, function (field) {
			if (field.id === week) {
				$('#weeklytabletabs li:eq(' + week + ') a').tab('show');
			}
		});

	}

	$scope.setActualWeek();

});


$(document).ready(function () {
	$('[data-toggle="tooltip"]').tooltip();
});
