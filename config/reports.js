module.exports.views = {
    locals : {
	reports : {
	    '/reports' : [ {
		id : 1,
		name : {
		    locale_label : {
			en : 'Alarm History Report',
			es : 'Informe del historial de alarmas'
		    }
		},
		footnote1 : {
		    locale_label : {
		    	en : 'Alarm History Report',
				es : 'Informe del historial de alarmas'
			    }
			},
		footnote2 : {
		    locale_label : {
				en : 'Summary of device faults and alarms and their duration for a given time range.',
				es : ''
			    }
			},
		footnote3 : {
		    locale_label : {
				en : '',
				es : ''
			    }
			},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Start Timesss'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'fault_type' : {
			type : 'fault',
			locale_label : {
			    en : 'Fault',
			    es : 'Fault'
			}
		    },
		    'eqp_id' : {
			type : 'select',
			source : 'eqp_ids',
			dependant : {
			    'dev_id' : {
				'url' : '/reports/getdevicesbyeqpid'
			    }
			},
			locale_label : {
			    en : 'Equipment',
			    es : 'Equipo'
			}
		    },
		    'dev_id' : {
			type : 'select',
			parent : 'eqp_id',
			locale_label : {
			    en : 'Device',
			    es : 'Dispositivo'
			}
		    }
		}
	    }, {
		id : 2,
		name : {
		    locale_label : {
			en : 'Equipment Summary Report',
			es : 'Informe resumido Equipo'
		    }
		},
		footnote1 : {
		    locale_label : {
				en : 'Equipment Summary Report',
				es : 'Informe resumido Equipo'
			    }
			},
		footnote2 : {
		    locale_label : {
				en : 'A summary of equipment statistics for the given time range.',
				es : ''
			    }
			},
		footnote3 : {
		    locale_label : {
				en : '',
				es : ''
			    }
			},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Finalización'
			}
		    },
		    'eqp_id' : {
			type : 'select',
			dependant : {
			    'dev_id' : {
				'url' : '/reports/getdevicesbyeqpid'
			    }
			},
			source : 'eqp_ids',
			locale_label : {
			    en : 'Equipment',
			    es : 'Equipo'
			}
		    },
		    'dev_id' : {
			type : 'select',
			parent : 'eqp_id',
			locale_label : {
			    en : 'Device',
			    es : 'Dispositivo'
			}
		    },
		    'sections' : {
			type : 'checkboxes',
			locale_label : {
			    en : 'Device Types',
			    es : 'Secciones'
			},
			checkboxes : {
			    'tracking_photo_eyes' : {
				locale_label : {
				    en : 'Tracking Photo Eyes',
				    es : 'Seguimiento de Fotos Eyes'
				}
			    },
			    'jam_photo_eyes' : {
				locale_label : {
				    en : 'Jam Photo Eyes',
				    es : 'Jam Fotos Eyes'
				}
			    },
			    'diverters' : {
				locale_label : {
				    en : 'Diverters',
				    es : 'Desviadores'
				}
			    },
			    'vertical_sorters_mergers' : {
				locale_label : {
				    en : 'Vertical Sorters / Mergers',
				    es : 'Clasificadores / Fusiones verticales'
				}
			    }
			}
		    }
		}

	    }, {
		id : 3,
		name : {
		    locale_label : {
			en : 'Equipment Interval Report',
			es : 'Informe resumido Equipo'
		    }
		},
		footnote1 : {
		    locale_label : {
				en : 'Equipment Interval Report',
				es : 'Informe resumido Equipo'
			    }
			},
		footnote2 : {
		    locale_label : {
				en : 'A summary of cumulative equipment statistics grouped by a time interval and bounded by a time range',
				es : ''
			    }
			},
		footnote3 : {
		    locale_label : {
				en : '',
				es : ''
			    }
			},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Finalización'
			}
		    },
		    'eqp_id' : {
			type : 'select',
			dependant : {
			    'dev_id' : {
				'url' : '/reports/getdevicesbyeqpid'
			    }
			},
			source : 'eqp_ids',
			locale_label : {
			    en : 'Equipment',
			    es : 'Equipo'
			}
		    },
		    'dev_id' : {
			type : 'select',
			parent : 'eqp_id',
			locale_label : {
			    en : 'Device',
			    es : 'Dispositivo'
			}
		    },
		    'interval' : {
			type : 'select',
			source : 'intervals',
			limit : 500,
			locale_label : {
			    en : 'Interval',
			    es : 'Interval'
			}
		    },
		    'sections' : {
			type : 'checkboxes',
			locale_label : {
			    en : 'Device Types',
			    es : 'Secciones'
			},
			checkboxes : {
			    'tracking_photo_eyes' : {
				locale_label : {
				    en : 'Tracking Photo Eyes',
				    es : 'Seguimiento de Fotos Eyes'
				}
			    },
			    'jam_photo_eyes' : {
				locale_label : {
				    en : 'Jam Photo Eyes',
				    es : 'Jam Fotos Eyes'
				}
			    },
			    'diverters' : {
				locale_label : {
				    en : 'Diverters',
				    es : 'Desviadores'
				}
			    },
			    'vertical_sorters_mergers' : {
				locale_label : {
				    en : 'Vertical Sorters / Mergers',
				    es : 'Clasificadores / Fusiones verticales'
				}
			    }
			}
		    }
		}
	    },
	    {
		id : 5,
		name : {
		    locale_label : {
			en : 'Throughput Report',
			es : 'Throughput Report'
		    }
		},
		footnote1 : {
		    locale_label : {
				en : 'Throughput Report',
				es : 'Throughput Report'
			    }
			},
		footnote2 : {
		    locale_label : {
				en : ' Input = Bags seen at OB1-03, Output = Bags seen at OB1-07',
				es : ''
			    }
			},
		footnote3 : {
		    locale_label : {
				en : 'Statistics are tracked in the PLC by tags S_OUTPUT_TP_CNT (Output) and S_INPUT_TP_CNT (Input)',
				es : ''
			    }
			},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Finalización'
			}
		    },
		    'interval' : {
			type : 'select',
			source : 'intervals',
			limit : 500,
			locale_label : {
			    en : 'Interval',
			    es : 'Interval'
			}
		    }
		}
	    },
	    {
		id : 6,
		name : {
		    locale_label : {
			en : 'Executive Summary Report',
			es : 'Executive Summary Report'
		    }
		},
		footnote1 : {
		    locale_label : {
				en : 'Executive Summary Report',
				es : 'Executive Summary Report'
			    }
			},
		footnote2 : {
		    locale_label : {
				en : 'Summary of all statistics for the given day.',
				es : ''
			    }
			},
		footnote3 : {
		    locale_label : {
				en : 'System Availability = (Time Elapsed since Midnight - Cummulative Fault Time) / Time Elapsed since midnight)',
				es : ''
			    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Finalización'
			}
		    }
		}
	    }],
	    '/search' : [ {
		id : 4,
		name : {
		    locale_label : {
			en : 'Bag Search',
			es : 'Informe del historial de Bags'
		    }
		},
		footnote1 : {
		    locale_label : {
				en : 'Bag Search',
				es : 'Informe del historial de Bags'
			    }
			},
		footnote2 : {
		    locale_label : {
				en : '',
				es : ''
			    }
			},
		footnote3 : {
		    locale_label : {
				en : '',
				es : ''
			    }
		},
		title:{
		    logo:'iSystemsNow-Logo-RGB-Black.png'
		},
		footer:{
		    logo:'default.png'
		},
		parameters : {
		    'start_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'Start Time',
			    es : 'Start Timesss'
			}
		    },
		    'end_time' : {
			type : 'datetime',
			locale_label : {
			    en : 'End Time',
			    es : 'Hora de Inicio'
			}
		    },
		    'search_field' : {
			type : 'text',
			post_value : '',
			locale_label : {
			    en : 'IATA / Security ID',
			    es : 'IATA / Security ID'
			}

		    }
		}
	    } ]
	}
    }
};