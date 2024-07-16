export default {
    "count": 10,
    "results": [
        {
            "name": "School Region",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "None",
                    "value": "none"
                },
                {
                    "label": "Urban",
                    "value": "urban"
                },
                {
                    "label": "Rural",
                    "value": "rural"
                }
            ],
            "parameter": {
                "label": "Region",
                "table": "schools",
                "field": "environment",
                "filter": "iexact"
            },
            "active_countries_list": []
        },
        {
            "name": "School Type",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "None",
                    "value": "none"
                },
                {
                    "label": "Private",
                    "value": "private"
                },
                {
                    "label": "Public",
                    "value": "public"
                }
            ],
            "parameter": {
                "label": "School Type",
                "table": "schools",
                "field": "school_type",
                "filter": "iexact"
            },
            "active_countries_list": []
        },
        {
            "name": "Education Level",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "None",
                    "value": "none"
                },
                {
                    "label": "Primary",
                    "value": "primary"
                },
                {
                    "label": "Secondary",
                    "value": "secondary"
                }
            ],
            "parameter": {
                "label": "Education Level",
                "table": "schools",
                "field": "education_level",
                "filter": "iexact"
            },
            "active_countries_list": []
        },
        {
            "name": "No of Computers",
            "type": "range",
            "description": "",
            "include_none_filter": true,
            "parameter": {
                "label": "# of Computers",
                "table": "school_static",
                "field": "num_computers",
                "filter": "range"
            },
            "active_countries_list": [
                7,
                32,
                86,
                184,
                222,
                285
            ],
            "active_countries_range": {
                "default": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (1 Lac)",
                    "min_value": 0,
                    "max_value": 2147483647
                },
                "7": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (36)",
                    "min_value": 0,
                    "max_value": 36
                },
                "32": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (824)",
                    "min_value": 0,
                    "max_value": 824
                },
                "86": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (900)",
                    "min_value": 0,
                    "max_value": 900
                },
                "184": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (431)",
                    "min_value": 0,
                    "max_value": 431
                },
                "222": {
                    "min_place_holder": "Min (3)",
                    "max_place_holder": "Max (244)",
                    "min_value": 3,
                    "max_value": 244
                },
                "285": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (113)",
                    "min_value": 0,
                    "max_value": 113
                }
            }
        },
        {
            "name": "No of Students",
            "type": "range",
            "description": "",
            "include_none_filter": true,
            "parameter": {
                "label": "# of Students",
                "table": "school_static",
                "field": "num_students",
                "filter": "range"
            },
            "active_countries_list": [],
            "active_countries_range": {
                "default": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (1 Lac)",
                    "min_value": 0,
                    "max_value": 2147483647
                },
                "4": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (3881)",
                    "min_value": 0,
                    "max_value": 3881
                },
                "7": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (53)",
                    "min_value": 0,
                    "max_value": 53
                },
                "32": {
                    "min_place_holder": "Min (1)",
                    "max_place_holder": "Max (824)",
                    "min_value": 1,
                    "max_value": 824
                },
                "134": {
                    "min_place_holder": "Min (10)",
                    "max_place_holder": "Max (626)",
                    "min_value": 10,
                    "max_value": 626
                },
                "144": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (9053)",
                    "min_value": 0,
                    "max_value": 9053
                },
                "147": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (6849)",
                    "min_value": 0,
                    "max_value": 6849
                },
                "168": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (3766)",
                    "min_value": 0,
                    "max_value": 3766
                },
                "174": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (2485)",
                    "min_value": 0,
                    "max_value": 2485
                },
                "186": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (17790)",
                    "min_value": 0,
                    "max_value": 17790
                },
                "191": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (626)",
                    "min_value": 0,
                    "max_value": 626
                },
                "200": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (325)",
                    "min_value": 0,
                    "max_value": 325
                },
                "222": {
                    "min_place_holder": "Min (5)",
                    "max_place_holder": "Max (1075)",
                    "min_value": 5,
                    "max_value": 1075
                },
                "238": {
                    "min_place_holder": "Min (4)",
                    "max_place_holder": "Max (18)",
                    "min_value": 4,
                    "max_value": 18
                },
                "276": {
                    "min_place_holder": "Min (3)",
                    "max_place_holder": "Max (317)",
                    "min_value": 3,
                    "max_value": 317
                },
                "285": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (857)",
                    "min_value": 0,
                    "max_value": 857
                },
                "299": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (592)",
                    "min_value": 0,
                    "max_value": 592
                },
                "329": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (472)",
                    "min_value": 0,
                    "max_value": 472
                },
                "331": {
                    "min_place_holder": "Min (5)",
                    "max_place_holder": "Max (904)",
                    "min_value": 5,
                    "max_value": 904
                },
                "332": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (70)",
                    "min_value": 0,
                    "max_value": 70
                }
            }
        },
        {
            "name": "No of Teachers",
            "type": "range",
            "description": "",
            "include_none_filter": true,
            "parameter": {
                "label": "# of Teachers",
                "table": "school_static",
                "field": "num_teachers",
                "filter": "range"
            },
            "active_countries_list": [
                7,
                32,
                144,
                186,
                222,
                285
            ],
            "active_countries_range": {
                "default": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (10K)",
                    "min_value": 0,
                    "max_value": 32767
                },
                "7": {
                    "min_place_holder": "Min (2)",
                    "max_place_holder": "Max (46)",
                    "min_value": 2,
                    "max_value": 46
                },
                "32": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (364)",
                    "min_value": 0,
                    "max_value": 364
                },
                "144": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (338)",
                    "min_value": 0,
                    "max_value": 338
                },
                "186": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (1037)",
                    "min_value": 0,
                    "max_value": 1037
                },
                "222": {
                    "min_place_holder": "Min (3)",
                    "max_place_holder": "Max (135)",
                    "min_value": 3,
                    "max_value": 135
                },
                "285": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (93)",
                    "min_value": 0,
                    "max_value": 93
                }
            }
        },
        {
            "name": "Download Speed",
            "type": "range",
            "description": "",
            "include_none_filter": true,
            "parameter": {
                "label": "Connectivity Speed",
                "table": "school_static",
                "field": "connectivity_speed",
                "filter": "range"
            },
            "downcast_aggr_str": "{val} / (1000 * 1000)",
            "upcast_aggr_str": "{val} * 1000 * 1000",
            "active_countries_list": [],
            "active_countries_range": {
                "default": {
                    "min_place_holder": "Min (MBs)",
                    "max_place_holder": "Max (MBs)",
                    "min_value": 0,
                    "max_value": 2147
                },
                "5": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (28)",
                    "min_value": 0,
                    "max_value": 28
                },
                "7": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (66)",
                    "min_value": 0,
                    "max_value": 66
                },
                "20": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (4)",
                    "min_value": 0,
                    "max_value": 4
                },
                "21": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (54)",
                    "min_value": 0,
                    "max_value": 54
                },
                "29": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (300)",
                    "min_value": 0,
                    "max_value": 300
                },
                "32": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (100)",
                    "min_value": 0,
                    "max_value": 100
                },
                "39": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (4)",
                    "min_value": 0,
                    "max_value": 4
                },
                "45": {
                    "min_place_holder": "Min (181)",
                    "max_place_holder": "Max (182)",
                    "min_value": 181,
                    "max_value": 182
                },
                "54": {
                    "min_place_holder": "Min (1)",
                    "max_place_holder": "Max (2)",
                    "min_value": 1,
                    "max_value": 2
                },
                "86": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (5)",
                    "min_value": 0,
                    "max_value": 5
                },
                "126": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (100)",
                    "min_value": 0,
                    "max_value": 100
                },
                "134": {
                    "min_place_holder": "Min (1)",
                    "max_place_holder": "Max (156)",
                    "min_value": 1,
                    "max_value": 156
                },
                "137": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (100)",
                    "min_value": 0,
                    "max_value": 100
                },
                "144": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (1036)",
                    "min_value": 0,
                    "max_value": 1036
                },
                "147": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (140)",
                    "min_value": 0,
                    "max_value": 140
                },
                "157": {
                    "min_place_holder": "Min (4)",
                    "max_place_holder": "Max (5)",
                    "min_value": 4,
                    "max_value": 5
                },
                "161": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (51)",
                    "min_value": 0,
                    "max_value": 51
                },
                "164": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (18)",
                    "min_value": 0,
                    "max_value": 18
                },
                "172": {
                    "min_place_holder": "Min (14)",
                    "max_place_holder": "Max (15)",
                    "min_value": 14,
                    "max_value": 15
                },
                "173": {
                    "min_place_holder": "Min (2)",
                    "max_place_holder": "Max (100)",
                    "min_value": 2,
                    "max_value": 100
                },
                "174": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (164)",
                    "min_value": 0,
                    "max_value": 164
                },
                "175": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (173)",
                    "min_value": 0,
                    "max_value": 173
                },
                "184": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (250)",
                    "min_value": 0,
                    "max_value": 250
                },
                "191": {
                    "min_place_holder": "Min (14)",
                    "max_place_holder": "Max (129)",
                    "min_value": 14,
                    "max_value": 129
                },
                "192": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (285)",
                    "min_value": 0,
                    "max_value": 285
                },
                "194": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (50)",
                    "min_value": 0,
                    "max_value": 50
                },
                "196": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (40)",
                    "min_value": 0,
                    "max_value": 40
                },
                "200": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (443)",
                    "min_value": 0,
                    "max_value": 443
                },
                "201": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (208)",
                    "min_value": 0,
                    "max_value": 208
                },
                "205": {
                    "min_place_holder": "Min (1)",
                    "max_place_holder": "Max (2)",
                    "min_value": 1,
                    "max_value": 2
                },
                "212": {
                    "min_place_holder": "Min (68)",
                    "max_place_holder": "Max (69)",
                    "min_value": 68,
                    "max_value": 69
                },
                "214": {
                    "min_place_holder": "Min (38)",
                    "max_place_holder": "Max (49)",
                    "min_value": 38,
                    "max_value": 49
                },
                "216": {
                    "min_place_holder": "Min (28)",
                    "max_place_holder": "Max (29)",
                    "min_value": 28,
                    "max_value": 29
                },
                "229": {
                    "min_place_holder": "Min (6)",
                    "max_place_holder": "Max (7)",
                    "min_value": 6,
                    "max_value": 7
                },
                "238": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (126)",
                    "min_value": 0,
                    "max_value": 126
                },
                "249": {
                    "min_place_holder": "Min (50)",
                    "max_place_holder": "Max (100)",
                    "min_value": 50,
                    "max_value": 100
                },
                "258": {
                    "min_place_holder": "Min (5)",
                    "max_place_holder": "Max (185)",
                    "min_value": 5,
                    "max_value": 185
                },
                "285": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (340)",
                    "min_value": 0,
                    "max_value": 340
                },
                "299": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (126)",
                    "min_value": 0,
                    "max_value": 126
                },
                "304": {
                    "min_place_holder": "Min (2)",
                    "max_place_holder": "Max (3)",
                    "min_value": 2,
                    "max_value": 3
                },
                "329": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (195)",
                    "min_value": 0,
                    "max_value": 195
                },
                "331": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (196)",
                    "min_value": 0,
                    "max_value": 196
                },
                "332": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (94)",
                    "min_value": 0,
                    "max_value": 94
                }
            }
        },
        {
            "name": "Latency",
            "type": "range",
            "description": "",
            "include_none_filter": true,
            "parameter": {
                "label": "Latency",
                "table": "school_static",
                "field": "connectivity_latency",
                "filter": "range"
            },
            "active_countries_list": [
                5,
                7,
                21,
                29,
                32,
                45,
                86,
                126,
                134,
                144,
                157,
                161,
                164,
                172,
                174,
                175,
                191,
                192,
                194,
                196,
                201,
                205,
                212,
                214,
                216,
                229,
                238,
                258,
                285,
                299,
                304,
                329,
                331,
                332
            ],
            "active_countries_range": {
                "default": {
                    "min_place_holder": "Min (ms)",
                    "max_place_holder": "Max (ms)",
                    "min_value": 0,
                    "max_value": 36000000
                },
                "5": {
                    "min_place_holder": "Min (28)",
                    "max_place_holder": "Max (233)",
                    "min_value": 28,
                    "max_value": 233
                },
                "7": {
                    "min_place_holder": "Min (72)",
                    "max_place_holder": "Max (562)",
                    "min_value": 72,
                    "max_value": 562
                },
                "21": {
                    "min_place_holder": "Min (309)",
                    "max_place_holder": "Max (309)",
                    "min_value": 309,
                    "max_value": 309
                },
                "29": {
                    "min_place_holder": "Min (39)",
                    "max_place_holder": "Max (4509)",
                    "min_value": 39,
                    "max_value": 4509
                },
                "32": {
                    "min_place_holder": "Min (25)",
                    "max_place_holder": "Max (492)",
                    "min_value": 25,
                    "max_value": 492
                },
                "45": {
                    "min_place_holder": "Min (12)",
                    "max_place_holder": "Max (12)",
                    "min_value": 12,
                    "max_value": 12
                },
                "86": {
                    "min_place_holder": "Min (303)",
                    "max_place_holder": "Max (303)",
                    "min_value": 303,
                    "max_value": 303
                },
                "126": {
                    "min_place_holder": "Min (49)",
                    "max_place_holder": "Max (2746)",
                    "min_value": 49,
                    "max_value": 2746
                },
                "134": {
                    "min_place_holder": "Min (96)",
                    "max_place_holder": "Max (226)",
                    "min_value": 96,
                    "max_value": 226
                },
                "144": {
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (6721)",
                    "min_value": 0,
                    "max_value": 6721
                },
                "157": {
                    "min_place_holder": "Min (346)",
                    "max_place_holder": "Max (346)",
                    "min_value": 346,
                    "max_value": 346
                },
                "161": {
                    "min_place_holder": "Min (26)",
                    "max_place_holder": "Max (425)",
                    "min_value": 26,
                    "max_value": 425
                },
                "164": {
                    "min_place_holder": "Min (23)",
                    "max_place_holder": "Max (239)",
                    "min_value": 23,
                    "max_value": 239
                },
                "172": {
                    "min_place_holder": "Min (197)",
                    "max_place_holder": "Max (197)",
                    "min_value": 197,
                    "max_value": 197
                },
                "174": {
                    "min_place_holder": "Min (83)",
                    "max_place_holder": "Max (2247)",
                    "min_value": 83,
                    "max_value": 2247
                },
                "175": {
                    "min_place_holder": "Min (63)",
                    "max_place_holder": "Max (1475)",
                    "min_value": 63,
                    "max_value": 1475
                },
                "191": {
                    "min_place_holder": "Min (79)",
                    "max_place_holder": "Max (92)",
                    "min_value": 79,
                    "max_value": 92
                },
                "192": {
                    "min_place_holder": "Min (38)",
                    "max_place_holder": "Max (1244)",
                    "min_value": 38,
                    "max_value": 1244
                },
                "194": {
                    "min_place_holder": "Min (158)",
                    "max_place_holder": "Max (303)",
                    "min_value": 158,
                    "max_value": 303
                },
                "196": {
                    "min_place_holder": "Min (94)",
                    "max_place_holder": "Max (103)",
                    "min_value": 94,
                    "max_value": 103
                },
                "201": {
                    "min_place_holder": "Min (7)",
                    "max_place_holder": "Max (488)",
                    "min_value": 7,
                    "max_value": 488
                },
                "205": {
                    "min_place_holder": "Min (291)",
                    "max_place_holder": "Max (291)",
                    "min_value": 291,
                    "max_value": 291
                },
                "212": {
                    "min_place_holder": "Min (142)",
                    "max_place_holder": "Max (142)",
                    "min_value": 142,
                    "max_value": 142
                },
                "214": {
                    "min_place_holder": "Min (19)",
                    "max_place_holder": "Max (21)",
                    "min_value": 19,
                    "max_value": 21
                },
                "216": {
                    "min_place_holder": "Min (76)",
                    "max_place_holder": "Max (76)",
                    "min_value": 76,
                    "max_value": 76
                },
                "229": {
                    "min_place_holder": "Min (250)",
                    "max_place_holder": "Max (250)",
                    "min_value": 250,
                    "max_value": 250
                },
                "238": {
                    "min_place_holder": "Min (95)",
                    "max_place_holder": "Max (100)",
                    "min_value": 95,
                    "max_value": 100
                },
                "258": {
                    "min_place_holder": "Min (82)",
                    "max_place_holder": "Max (155)",
                    "min_value": 82,
                    "max_value": 155
                },
                "285": {
                    "min_place_holder": "Min (72)",
                    "max_place_holder": "Max (143)",
                    "min_value": 72,
                    "max_value": 143
                },
                "299": {
                    "min_place_holder": "Min (96)",
                    "max_place_holder": "Max (153)",
                    "min_value": 96,
                    "max_value": 153
                },
                "304": {
                    "min_place_holder": "Min (308)",
                    "max_place_holder": "Max (308)",
                    "min_value": 308,
                    "max_value": 308
                },
                "329": {
                    "min_place_holder": "Min (103)",
                    "max_place_holder": "Max (2297)",
                    "min_value": 103,
                    "max_value": 2297
                },
                "331": {
                    "min_place_holder": "Min (101)",
                    "max_place_holder": "Max (131)",
                    "min_value": 101,
                    "max_value": 131
                },
                "332": {
                    "min_place_holder": "Min (33)",
                    "max_place_holder": "Max (60)",
                    "min_value": 33,
                    "max_value": 60
                }
            }
        },
        {
            "name": "Has Computer Lab",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "Yes",
                    "value": "true"
                },
                {
                    "label": "No",
                    "value": "false"
                }
            ],
            "parameter": {
                "label": "Has Computer Lab",
                "table": "school_static",
                "field": "computer_lab",
                "filter": "on"
            },
            "active_countries_list": []
        },
        {
            "name": "Coverage Type",
            "type": "drop-down-multiselect",
            "description": "",
            "choices": [
                {
                    "label": "Unknown",
                    "value": "unknown"
                },
                {
                    "label": "No",
                    "value": "no"
                },
                {
                    "label": "2G",
                    "value": "2g"
                },
                {
                    "label": "3G",
                    "value": "3g"
                },
                {
                    "label": "4G",
                    "value": "4g"
                },
                {
                    "label": "5G",
                    "value": "5g"
                }
            ],
            "parameter": {
                "label": "Coverage Type",
                "table": "school_static",
                "field": "coverage_type",
                "filter": "in"
            },
            "active_countries_list": []
        }
    ]
}