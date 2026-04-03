export default {
  "count": 44,
  "results": [
      {
          "id": 46,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "TVSGL01",
          "name": "Test giga layer-01",
          "description": "This is a Static layer created for testing purpose",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              144,
              29,
              39,
              164,
              174
          ],
          "global_benchmark": {
              "benchmark_name": "School-Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" <= 25"
                  ],
                  "labels": "High",
                  "tooltip": ">=25"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > 25 AND sws.\"{col_name}\" <= 75"
                  ],
                  "labels": "Medium",
                  "tooltip": ">25 and <=75"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" <= 25"
                  ],
                  "labels": "Low",
                  "tooltip": "<=25"
              },
              "unknown": {
                  "values": [],
                  "labels": "Un-registered",
                  "tooltip": "Empty"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_at": "11-11-2024 10:57:36",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "fiber_node_distance",
                  "type": "float",
                  "is_parameter": true,
                  "alias": "Fiber Node Distance (fiber_node_distance)",
                  "unit": "km",
                  "display_unit": "km",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "km",
              "display_unit": "km",
              "benchmark_name": "School-Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 337,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 4,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              }
          ],
          "created_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          }
      },
      {
          "id": 47,
          "icon": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n\n      .cls-1, .cls-2 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <polygon class=\"cls-2\" points=\"17 11 20 11 20 21 17 21 17 23 25 23 25 21 22 21 22 11 25 11 25 9 17 9 17 11\"/>\n  <path class=\"cls-2\" d=\"m13,9h-4c-1.103,0-2,.897-2,2v12h2v-5h4v5h2v-12c0-1.103-.897-2-2-2Zm-4,7v-5h4v5h-4Z\"/>\n  <rect id=\"_Transparent_Rectangle_\" data-name=\"&amp;lt;Transparent Rectangle&amp;gt;\" class=\"cls-1\" width=\"32\" height=\"32\"/>\n</svg>",
          "code": "TVLGL",
          "name": "Test live layer-02",
          "description": "This is a test live layer for testing purpose",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              24,
              223,
              178,
              198,
              236,
              89,
              239,
              241,
              191,
              176,
              200,
              201,
              144,
              8,
              164,
              279,
              31,
              4,
              315,
              169,
              137,
              128,
              15,
              139,
              174,
              138,
              47,
              86
          ],
          "global_benchmark": {
              "unit": "",
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 50000000))",
              "convert_unit": "mbps",
              "benchmark_name": "School-Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 50000000)"
                  ],
                  "labels": "High",
                  "tooltip": ">=50000000"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 50000000) AND sds.\"{col_name}\" >= 1000000"
                  ],
                  "labels": "Medium",
                  "tooltip": ">50000000 and <=1000000"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 1000000"
                  ],
                  "labels": "Low",
                  "tooltip": "<=1000000"
              },
              "unknown": {
                  "values": [],
                  "labels": "Un-registered",
                  "tooltip": "Empty"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_at": "11-11-2024 10:56:59",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              },
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_upload_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Upload Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              },
              "5": {
                  "name": "connectivity_upload_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Upload Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School-Global",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 50000000))",
              "benchmark_unit": "",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 337,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 152,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "All data are from proper data source",
                      "description": "This is a test data source"
                  }
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 200,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              }
          ],
          "created_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          }
      },
      {
          "id": 45,
          "icon": "",
          "code": "SCHOOL STATUS LAYER",
          "name": "School Status Layer",
          "description": "School status",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": ""
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: \"schools_school\".connectivity_status IN ('good', 'moderate')"
                  ],
                  "labels": "Connected",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [
                      "SQL: \"schools_school\".connectivity_status  = 'SKIPPED'"
                  ],
                  "labels": "Skipped",
                  "tooltip": ""
              },
              "bad": {
                  "values": [
                      "SQL: \"schools_school\".connectivity_status = 'no'"
                  ],
                  "labels": "Not connected",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [
                      "SQL: \"schools_school\".connectivity_status NOT IN ('good', 'moderate', 'no')"
                  ],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "05-11-2024 15:44:23",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "coverage_type",
                  "type": "str",
                  "is_parameter": true,
                  "alias": "Coverage Type (coverage_type)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 4,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 37,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 139,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 152,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 153,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 170,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 171,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 264,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 269,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 291,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 321,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 17,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
          "code": "COVERAGE VIKASH",
          "name": "Coverage Vikash",
          "description": "Coverage",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: UPPER(sws.\"{col_name}\") IN ('6G', '5G', '4G')"
                  ],
                  "labels": "5G/4G"
              },
              "moderate": {
                  "values": [
                      "SQL: UPPER(sws.\"{col_name}\") IN ('3G', '2G', '1G')"
                  ],
                  "labels": "3G/2G"
              },
              "bad": {
                  "values": [
                      "SQL: UPPER(sws.\"{col_name}\")  = 'NO'"
                  ],
                  "labels": "No Coverage"
              },
              "unknown": {
                  "values": [
                      "SQL: LOWER(sws.\"{col_name}\") = 'unknown' OR sws.\"{col_name}\" IS NULL"
                  ],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "04-11-2024 09:09:06",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "coverage_type",
                  "type": "str",
                  "is_parameter": true,
                  "alias": "Coverage Type",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 31,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 4,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 37,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 139,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 152,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 153,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 170,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 171,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 264,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 269,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 291,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 321,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 33,
          "icon": "",
          "code": "BRA-SCHOOL-BENCH",
          "name": "BRA-SCHOOL-BENCH-Vikash",
          "description": "BRA-SCHOOL-BENCH-Description",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              144
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 30000000))",
              "benchmark_name": "School Benchmark",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 30000000)"
                  ],
                  "labels": "Good1",
                  "tooltip": ">= School Download Speed Benchmark/30 MBPS"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 30000000) AND sds.\"{col_name}\" >= 1000000"
                  ],
                  "labels": "Moderate1",
                  "tooltip": ">= 1 MBPS AND < School Benchmark/30 MBPS"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 1000000"
                  ],
                  "labels": "Bad1",
                  "tooltip": ">= 0 MBPS AND < 1 MBPS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown1",
                  "tooltip": "Not stored"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "29-10-2024 05:57:12",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School Benchmark",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 30000000))",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 44,
          "icon": "",
          "code": "NUM_OF_SCHOOLS_PER_BUILDING",
          "name": "Number of Schools per Building",
          "description": "Number of Schools per Building",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              196
          ],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > 1"
                  ],
                  "labels": "2 or more schools per building",
                  "tooltip": "> 1"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 1"
                  ],
                  "labels": "1 school per building",
                  "tooltip": "= 1"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": "= 0"
              },
              "unknown": {
                  "values": [
                      "SQL: sws.\"{col_name}\" IS NULL"
                  ],
                  "labels": "Unknown",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "25-10-2024 06:29:41",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_schools_per_building",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Schools per Building (num_schools_per_building)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 29,
          "icon": "",
          "code": "TGLV-02",
          "name": "Test giga layer-Vaish-02",
          "description": "Test layer created for to test the sql approach for legends",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222,
              201,
              144,
              250,
              29,
              164,
              31,
              137,
              88,
              47,
              86
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 30000000))",
              "convert_unit": "mbps",
              "benchmark_name": "School benchmark"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 30000000)"
                  ],
                  "labels": "Satisfactory",
                  "tooltip": ">= School Benchmark/30 MBPS"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 30000000) AND sds.\"{col_name}\" >= 2000000"
                  ],
                  "labels": "Steady",
                  "tooltip": ">= 2 MBPS AND < School Benchmark/30 MBPS"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 2000000"
                  ],
                  "labels": "Poor quality",
                  "tooltip": ">= 0 MBPS AND < 2 MBPS"
              },
              "unknown": {
                  "values": [
                      ""
                  ],
                  "labels": "Unrecognized",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_at": "25-10-2024 06:25:02",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              },
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_upload_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Upload Speed",
                  "base_benchmark": "2000000",
                  "display_unit": "Mbps"
              },
              "5": {
                  "name": "connectivity_upload_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Upload Speed",
                  "base_benchmark": "2000000",
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School benchmark",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 30000000))",
              "benchmark_unit": "bps",
              "base_benchmark": "2000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "Test source name",
                      "description": "Test source description"
                  }
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 200,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": true,
                  "data_sources": {
                      "name": "Test data source",
                      "description": "Test description"
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": true,
                  "data_sources": {
                      "name": "Test data source",
                      "description": "Test data source description"
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 337,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 164,
                  "is_default": true,
                  "data_sources": {
                      "name": "Test description",
                      "description": "Test description of data source"
                  }
              }
          ],
          "created_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          }
      },
      {
          "id": 43,
          "icon": "",
          "code": "BOY STUDENTS",
          "name": "Boy Students",
          "description": "Boy Students",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ">=20"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">=1 & < 20"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": "=0"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:57:28",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_students_boys",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Boy Students (num_students_boys)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 42,
          "icon": "",
          "code": "OTHER STUDENTS",
          "name": "Other Students",
          "description": "Other Students",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ">=20"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">=1 & < 20"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": "=0"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:52:33",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_students_other",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Other Students (num_students_other)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 41,
          "icon": "",
          "code": "FEMALE_TEACHERS",
          "name": "FEMALE_TEACHERS",
          "description": "FEMALE_TEACHERS",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ">=20"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">=1 & < 20"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": "=0"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:51:37",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_teachers_female",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Female Teachers (num_teachers_female)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 40,
          "icon": "",
          "code": "MALE_TEACHERS",
          "name": "MALE_TEACHERS",
          "description": "MALE_TEACHERS",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ""
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:50:35",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_teachers_male",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Male Teachers (num_teachers_male)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 39,
          "icon": "",
          "code": "NUM_OF_TABLETS",
          "name": "NUM_OF_TABLETS",
          "description": "NUM_OF_TABLETS",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ""
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:49:45",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_tablets",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Tablets (num_tablets)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 22,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "DOWNLOAD  MONGOLIA QOS",
          "name": "Download - Mongolia QOS",
          "description": "QOS",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              175
          ],
          "global_benchmark": {
              "value": "20000000",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate"
              },
              "bad": {
                  "values": [],
                  "labels": "Bad"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:48:55",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "20000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 13,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
          "code": "LATENCY  VIKASH",
          "name": "Latency - Vikash",
          "description": "Latency - Vikash",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "50",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Low"
              },
              "moderate": {
                  "values": [],
                  "labels": "Medium"
              },
              "bad": {
                  "values": [],
                  "labels": "High"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:47:51",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              },
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_latency",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency",
                  "base_benchmark": "10"
              },
              "5": {
                  "name": "connectivity_latency",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency",
                  "base_benchmark": "10"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "50",
              "benchmark_unit": "ms",
              "base_benchmark": "10",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 173,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 304,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 200,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 38,
          "icon": "",
          "code": "NUM_OF_ROBO_EQUIPMENT",
          "name": "Num of Robo Equipement",
          "description": "NA",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ""
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "23-10-2024 06:46:37",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_robotic_equipment",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 36,
          "icon": "",
          "code": "TRAINED TEACHERS",
          "name": "Trained Teachers",
          "description": "Trained Teachers",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": ""
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = True"
                  ],
                  "labels": "Yes",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = False"
                  ],
                  "labels": "No",
                  "tooltip": ""
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = True AND sws.\"{col_name}\" = False"
                  ],
                  "labels": "Skip",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [
                      "SQL: sws.\"{col_name}\" IS NULL"
                  ],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "18-10-2024 14:51:30",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "teachers_trained",
                  "type": "boolean",
                  "is_parameter": true,
                  "alias": "Trained Teachers (teachers_trained)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 35,
          "icon": "",
          "code": "NUMBER OF COMPUTERS",
          "name": "Number of Computers",
          "description": "Number of Computers",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": ""
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 20"
                  ],
                  "labels": "Good",
                  "tooltip": ">= 20"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" >= 1 AND sws.\"{col_name}\" < 20"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">= 1 AND < 20"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = 0"
                  ],
                  "labels": "Bad",
                  "tooltip": "= 0"
              },
              "unknown": {
                  "values": [
                      "SQL: sws.\"{col_name}\" IS NULL"
                  ],
                  "labels": "Unknown",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "18-10-2024 14:48:05",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "num_computers",
                  "type": "int",
                  "is_parameter": true,
                  "alias": "Number of Computers",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 20,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 28,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 37,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 39,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 40,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 47,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 55,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 88,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 143,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 146,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 147,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 150,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 153,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 168,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 169,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 170,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 171,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 186,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 200,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 264,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 291,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 321,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 37,
          "icon": "",
          "code": "DEVICE AVAILABILITY",
          "name": "Device Availability",
          "description": "Device Availability",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "benchmark_name": ""
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = True"
                  ],
                  "labels": "Yes",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = False"
                  ],
                  "labels": "No",
                  "tooltip": ""
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" = True AND sws.\"{col_name}\" = False"
                  ],
                  "labels": "Skip",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [
                      "SQL: sws.\"{col_name}\" IS NULL"
                  ],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "18-10-2024 14:37:10",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "device_availability",
                  "type": "boolean",
                  "is_parameter": true,
                  "alias": "Device Availability (device_availability)",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 31,
          "icon": "",
          "code": "LUKE BRAZIL DOWNLOAD BENCHMARK TEST",
          "name": "brazil benchmark test",
          "description": "luke brazil download benchmark test",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              144
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 30000000))",
              "benchmark_name": "School Benchmark",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 30000000)"
                  ],
                  "labels": "Good",
                  "tooltip": ">= School Benchmark/30 Mbps"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= 1000000 AND sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 30000000)"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">= 1 Mbps and < 30 Mbps / School Benchmark"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 100000"
                  ],
                  "labels": "Bad",
                  "tooltip": ">= 0 AND < 1 Mbps"
              },
              "unknown": {
                  "values": [
                      "SQL: sds.\"{col_name}\" is null or sds.\"{col_name}\" = 0"
                  ],
                  "labels": "Unknown",
                  "tooltip": "null or 0 Mbps"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "15-10-2024 09:53:00",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School Benchmark",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 30000000))",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 32,
          "icon": "",
          "code": "TGLV-03",
          "name": "Test giga layer-Vaish-03",
          "description": "This is a static giga layer created for testing purpose",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222,
              250,
              29,
              39,
              164,
              174
          ],
          "global_benchmark": {
              "benchmark_name": "Static-Global"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" <= sws.\"week\""
                  ],
                  "labels": "Strong",
                  "tooltip": ">= School Benchmark/50"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > sws.\"week\" AND sws.\"{col_name}\" <= 75"
                  ],
                  "labels": "Steady",
                  "tooltip": "1 AND < School Benchmark/50"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > 75"
                  ],
                  "labels": "Poor",
                  "tooltip": ">= 0 AND < 1"
              },
              "unknown": {
                  "values": [],
                  "labels": "No-info",
                  "tooltip": "Unrecognized"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_at": "26-09-2024 16:31:28",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "fiber_node_distance",
                  "type": "float",
                  "is_parameter": true,
                  "alias": "Fiber Node Distance",
                  "unit": "km",
                  "display_unit": "km",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "km",
              "display_unit": "km",
              "benchmark_name": "Static-Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "Test data source",
                      "description": "Test description"
                  }
              },
              {
                  "country": 39,
                  "is_default": false,
                  "data_sources": {
                      "name": "Test data source",
                      "description": "Test data source description"
                  }
              },
              {
                  "country": 4,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "Test data source",
                      "description": "Test data source description"
                  }
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "Test DS",
                      "description": "This is a test layer for static"
                  }
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "Test source",
                      "description": "Test description"
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 337,
                  "is_default": false,
                  "data_sources": {}
              }
          ],
          "created_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          }
      },
      {
          "id": 15,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
          "code": "LATENCY LIVE",
          "name": "Latency Live",
          "description": "Latency",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 100000000))",
              "unit": "ms",
              "convert_unit": "ms",
              "benchmark_name": "Global-school"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 100000000)"
                  ],
                  "labels": "Low",
                  "tooltip": ">= School Benchmark/100 MS"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 100000000) AND sds.\"{col_name}\" >= 40000000"
                  ],
                  "labels": "Medium",
                  "tooltip": ">= 400 MS AND < School Benchmark/100 MS"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 40000000"
                  ],
                  "labels": "High",
                  "tooltip": ">= 0 MBPS AND < 400 MS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unregistered",
                  "tooltip": "No info"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "11-09-2024 13:53:35",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              },
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_latency",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency",
                  "base_benchmark": "400",
                  "display_unit": "ms"
              },
              "5": {
                  "name": "connectivity_latency",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency",
                  "base_benchmark": "400",
                  "display_unit": "ms"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "ms",
              "benchmark_name": "Global-school",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 100000000))",
              "benchmark_unit": "ms",
              "base_benchmark": "400",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 304,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 5,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "DOWNLOADVIKASH",
          "name": "Download-Vikash",
          "description": "Download-Vikash",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "30000000",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate",
                  "tooltip": ""
              },
              "bad": {
                  "values": [],
                  "labels": "Bad",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "05-09-2024 07:59:39",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              },
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": "5000000",
                  "display_unit": "Mbps"
              },
              "5": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": "5000000",
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "30000000",
              "benchmark_unit": "bps",
              "base_benchmark": "5000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 304,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": true,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": true,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": true,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": true,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 30,
          "icon": "",
          "code": "TEST1001",
          "name": "Test Download",
          "description": "Test Download",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              144
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "30000000",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good",
                  "tooltip": ""
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate",
                  "tooltip": ""
              },
              "bad": {
                  "values": [],
                  "labels": "Bad",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 59,
              "first_name": "Rahul",
              "last_name": "Avhad",
              "username": "rahul.avhad@nagarro.com",
              "email": "rahul.avhad@nagarro.com",
              "user_name": "Rahul Avhad"
          },
          "last_modified_at": "05-09-2024 07:51:27",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": "5000000",
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "30000000",
              "benchmark_unit": "bps",
              "base_benchmark": "5000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 59,
              "first_name": "Rahul",
              "last_name": "Avhad",
              "username": "rahul.avhad@nagarro.com",
              "email": "rahul.avhad@nagarro.com",
              "user_name": "Rahul Avhad"
          },
          "last_modified_by": {
              "id": 59,
              "first_name": "Rahul",
              "last_name": "Avhad",
              "username": "rahul.avhad@nagarro.com",
              "email": "rahul.avhad@nagarro.com",
              "user_name": "Rahul Avhad"
          }
      },
      {
          "id": 28,
          "icon": "",
          "code": "TGLV",
          "name": "Test giga layer-Vaish-01",
          "description": "This is a test layer created for testing purpose",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222,
              250
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "50000000",
              "benchmark_name": "Global-school",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      ""
                  ],
                  "labels": "Satisfactory",
                  "tooltip": ">=50 MBPS"
              },
              "moderate": {
                  "values": [],
                  "labels": "Steady",
                  "tooltip": ">=1 MBPS AND <50 MBPS"
              },
              "bad": {
                  "values": [],
                  "labels": "Poor",
                  "tooltip": ">=0 MBPS AND <1 MBPS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Un-recognized",
                  "tooltip": "0"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_at": "05-09-2024 05:38:50",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global-school",
              "benchmark_type": "global",
              "benchmark_value": "50000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 337,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          },
          "last_modified_by": {
              "id": 70,
              "first_name": "Vaishnavi",
              "last_name": "Akshay",
              "username": "vaishnavi.shivakumar@nagarro.com",
              "email": "vaishnavi.shivakumar@nagarro.com",
              "user_name": "Vaishnavi Akshay"
          }
      },
      {
          "id": 24,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "DOWNLOAD SCHOOL BENCHMARK",
          "name": "Download School Benchmark",
          "description": "Download layer with AVG school Benchmark",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 40000000))",
              "benchmark_name": "School Benchmark",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 40000000)"
                  ],
                  "labels": "Satisfactory",
                  "tooltip": ">= School Benchmark/40 MBPS"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 40000000) AND sds.\"{col_name}\" >= 1000000"
                  ],
                  "labels": "Steady",
                  "tooltip": ">= 1 MBPS AND < School Benchmark/40 MBPS"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 1000000"
                  ],
                  "labels": "Poor quality",
                  "tooltip": ">= 0 MBPS AND < 1 MBPS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unrecognized",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "04-09-2024 16:48:54",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School Benchmark",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 40000000))",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 23,
          "icon": "",
          "code": "DOWNLOAD MONGOLIA  PCDC",
          "name": "Download Mongolia - PCDC",
          "description": "mongolia pcdc download speed",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              175
          ],
          "global_benchmark": {
              "value": "30000000",
              "unit": "bps",
              "convert_unit": "mbps",
              "benchmark_name": "Global"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate"
              },
              "bad": {
                  "values": [],
                  "labels": "Bad"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "04-09-2024 07:03:57",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": "5000000",
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "30000000",
              "benchmark_unit": "bps",
              "base_benchmark": "5000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 304,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": true,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 10,
          "icon": "",
          "code": "PCDC LATENCY  L TEST",
          "name": "PCDC Latency - L Test",
          "description": "pcdc latency layer test",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "40",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good",
                  "tooltip": "ABDCDF"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate",
                  "tooltip": ""
              },
              "bad": {
                  "values": [],
                  "labels": "Bad",
                  "tooltip": ""
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": ""
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "03-09-2024 11:27:40",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_latency",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency",
                  "base_benchmark": 1,
                  "display_unit": "ms"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "ms",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "40",
              "benchmark_unit": "ms",
              "base_benchmark": "1",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 304,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 27,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "DOWNLOAD SCHOOL-NATIONAL BENCHMARK",
          "name": "Download School-National Benchmark",
          "description": "Download School-National Benchmark",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 40000000))",
              "benchmark_name": "School Benchmark at layer",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 40000000)"
                  ],
                  "labels": "Good",
                  "tooltip": ">= School Benchmark/40 MBPS"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 40000000) AND sds.\"{col_name}\" >= 1000000"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">= 1 MBPS AND < School Benchmark/40 MBPS"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 1000000"
                  ],
                  "labels": "Bad",
                  "tooltip": ">= 0 MBPS AND < 1 MBPS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "03-09-2024 08:42:53",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School Benchmark at layer",
              "benchmark_type": "global",
              "benchmark_value": "SQL: AVG(coalesce(sws.\"download_speed_benchmark\", 40000000))",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 25,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "DOWNLOAD SCHOOL BENCHMARK FIX",
          "name": "Download School Benchmark Fix",
          "description": "Download School Benchmark with Fix value as 40 MBPS",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "40000000",
              "benchmark_name": "School Benchmark 2",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sds.\"{col_name}\" >= coalesce(sws.\"download_speed_benchmark\", 40000000)"
                  ],
                  "labels": "Good",
                  "tooltip": ">= School Benchmark/40 MBPS"
              },
              "moderate": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < coalesce(sws.\"download_speed_benchmark\", 40000000) AND sds.\"{col_name}\" >= 1000000"
                  ],
                  "labels": "Moderate",
                  "tooltip": ">= 1 MBPS AND < School Benchmark/40 MBPS"
              },
              "bad": {
                  "values": [
                      "SQL: sds.\"{col_name}\" < 1000000"
                  ],
                  "labels": "Bad",
                  "tooltip": ">= 0 MBPS AND < 1 MBPS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "03-09-2024 08:41:09",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "School Benchmark 2",
              "benchmark_type": "global",
              "benchmark_value": "40000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 26,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
          "code": "DOWNLOAD GLOBAL-SCHOOL BENCHMARK",
          "name": "Download Global-School Benchmark",
          "description": "Download Global and School (From country edit page) Benchmark",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              222
          ],
          "global_benchmark": {
              "unit": "bps",
              "value": "20000000",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [
                      ""
                  ],
                  "labels": "Good",
                  "tooltip": ">= 20 MBPS"
              },
              "moderate": {
                  "values": [
                      ""
                  ],
                  "labels": "Moderate",
                  "tooltip": ">= 1 MBPS AND < 20 MBPS"
              },
              "bad": {
                  "values": [
                      ""
                  ],
                  "labels": "Bad",
                  "tooltip": ">= 0 MBPS AND < 1 MBPS"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown",
                  "tooltip": "Not collected"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "03-09-2024 08:30:04",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "20000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 21,
          "icon": "",
          "code": "AVERAGE LATENCY PROBE",
          "name": "Average Latency Probe",
          "description": "latency measured from liquid probe, qos ken",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              5
          ],
          "global_benchmark": {
              "value": "450",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Low"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate"
              },
              "bad": {
                  "values": [],
                  "labels": "High"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "03-09-2024 07:51:57",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_latency_probe",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency Probe",
                  "base_benchmark": 1,
                  "display_unit": "ms"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "ms",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "450",
              "benchmark_unit": "ms",
              "base_benchmark": "1",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 24,
                  "is_default": true,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 18,
          "icon": "",
          "code": "AVERAGE DOWNLOAD SPEED PROBE",
          "name": "Average Download Speed Probe",
          "description": "Weekly and monthly average of download speed measurement triggered every 15 mins by a probe on a router.",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              5
          ],
          "global_benchmark": {
              "value": "9000000",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate"
              },
              "bad": {
                  "values": [],
                  "labels": "Bad"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 45,
              "first_name": "Shilpa",
              "last_name": "Arora",
              "username": "sharora@unicef.org",
              "email": "sharora@unicef.org",
              "user_name": "Shilpa Arora"
          },
          "last_modified_at": "03-09-2024 07:51:38",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_speed_probe",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed Probe",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "9000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              }
          ],
          "created_by": {
              "id": 45,
              "first_name": "Shilpa",
              "last_name": "Arora",
              "username": "sharora@unicef.org",
              "email": "sharora@unicef.org",
              "user_name": "Shilpa Arora"
          },
          "last_modified_by": {
              "id": 45,
              "first_name": "Shilpa",
              "last_name": "Arora",
              "username": "sharora@unicef.org",
              "email": "sharora@unicef.org",
              "user_name": "Shilpa Arora"
          }
      },
      {
          "id": 14,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <polygon points=\"30 25 2 25 2 27 4 27 4 29 6 29 6 27 11 27 11 29 13 29 13 27 18 27 18 29 20 29 20 27 25 27 25 29 27 29 27 27 30 27 30 25\"/>\n  <path d=\"M29.7144,16.59,18.1494,8.64A14.9327,14.9327,0,0,0,9.6519,6H2V8H9.6519a12.9459,12.9459,0,0,1,7.3647,2.2871L18.0532,11H9v2H20.9624l7.6187,5.2378A.966.966,0,0,1,28.0342,20H2v2H28.0342a2.9661,2.9661,0,0,0,1.68-5.41Z\" transform=\"translate(0 0)\"/>\n  <rect id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\" class=\"cls-1\" width=\"32\" height=\"32\"/>\n</svg>",
          "code": "FIBER NODE DISTANCE  VIKASH",
          "name": "Fiber Node Distance - (Vikash)",
          "description": "Fiber Node Distance",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {},
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" <= sws.\"week\""
                  ],
                  "labels": "Low1",
                  "tooltip": "< 50"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > sws.\"week\" AND sws.\"{col_name}\" <= 75"
                  ],
                  "labels": "Medium",
                  "tooltip": "> 2 and > 4"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > 75"
                  ],
                  "labels": "High"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 59,
              "first_name": "Rahul",
              "last_name": "Avhad",
              "username": "rahul.avhad@nagarro.com",
              "email": "rahul.avhad@nagarro.com",
              "user_name": "Rahul Avhad"
          },
          "last_modified_at": "16-08-2024 06:38:06",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "fiber_node_distance",
                  "type": "float",
                  "is_parameter": true,
                  "alias": "Fiber Node Distance",
                  "unit": "km",
                  "display_unit": "km",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "km",
              "display_unit": "km",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 4,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 4,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><defs><style>.cls-1 {fill: none;}</style></defs><path d=\"M10.57,30l.9333-2h8.9928l.9333,2h2.2072L17,15.7778V11H15v4.7778L8.3631,30ZM16,18.3647,17.6965,22h-3.393ZM13.37,24h5.26l.9333,2H12.4369Z\" transform=\"translate(0 0)\"/><path d=\"M10.7832,9.3325a7.0007,7.0007,0,0,1,10.4341,0l-1.49,1.334a5,5,0,0,0-7.4537,0Z\" transform=\"translate(0 0)\"/><path d=\"M7.1992,6.3994a11.0019,11.0019,0,0,1,17.6006,0L23.2,7.6a9.0009,9.0009,0,0,0-14.4014,0Z\" transform=\"translate(0 0)\"/><rect id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\" class=\"cls-1\" width=\"32\" height=\"32\"/></svg>",
          "code": "CELLULAR COVERAGE",
          "name": "Cellular Coverage",
          "description": "Mobile coverage in the area",
          "version": "V 1.0",
          "type": "STATIC",
          "category": "COVERAGE",
          "applicable_countries": [],
          "global_benchmark": {},
          "legend_configs": {
              "good": {
                  "values": [
                      "5G",
                      "4G"
                  ],
                  "labels": "3G & above"
              },
              "moderate": {
                  "values": [
                      "3G",
                      "2G"
                  ],
                  "labels": "2G"
              },
              "bad": {
                  "values": [
                      "no"
                  ],
                  "labels": "No Coverage"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": null,
          "last_modified_at": "22-05-2024 12:51:43",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "coverage_type",
                  "type": "str",
                  "is_parameter": true,
                  "alias": "Coverage Type",
                  "unit": "",
                  "display_unit": "",
                  "count_labels": [
                      "good",
                      "moderate"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 31,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 4,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 37,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 139,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 152,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 153,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 170,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 171,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 264,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 269,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 291,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 321,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": null,
          "last_modified_by": null
      },
      {
          "id": 19,
          "icon": "",
          "code": "ROUND TRIP TIME  RTT",
          "name": "Round Trip Time - RTT",
          "description": "RTT - QoS",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              144
          ],
          "global_benchmark": {
              "value": "80",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Low"
              },
              "moderate": {
                  "values": [],
                  "labels": "Medium"
              },
              "bad": {
                  "values": [],
                  "labels": "High"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "16-05-2024 14:30:42",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "roundtrip_time",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Roundtrip Time",
                  "base_benchmark": "20",
                  "display_unit": "ms"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "ms",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "80",
              "benchmark_unit": "ms",
              "base_benchmark": "20",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "NIC.br; Government; Ericsson; ITU; Meta",
                      "description": "NIC.br description; Government description; Ericsson description; ITU description; Meta description"
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 20,
          "icon": "",
          "code": "QOS DOWNLOAD SPEED",
          "name": "QoS Download Speed",
          "description": "download speed taken from QoS",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              175
          ],
          "global_benchmark": {
              "value": "20000000",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate"
              },
              "bad": {
                  "values": [],
                  "labels": "Bad"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "15-05-2024 14:15:07",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "20000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 3,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><defs><style>.cls-1 {fill: none;}</style></defs><path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/><polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/><g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\"><rect class=\"cls-1\" width=\"32\" height=\"32\"/></g></svg>",
          "code": "AVERAGE DOWNLOAD SPEED",
          "name": "Average Download Speed",
          "description": "Weekly and monthly average of download speed measurement triggered on user's device twice in a day.",
          "version": "V 1.0",
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "20000000",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": {
              "good": {
                  "values": [],
                  "labels": "Good"
              },
              "moderate": {
                  "values": [],
                  "labels": "Moderate"
              },
              "bad": {
                  "values": [],
                  "labels": "Bad"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": null,
          "last_modified_at": "08-05-2024 11:08:23",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              },
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              },
              "5": {
                  "name": "connectivity_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Download Speed",
                  "base_benchmark": 1000000,
                  "display_unit": "Mbps"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "Mbps",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "20000000",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [],
          "created_by": null,
          "last_modified_by": null
      },
      {
          "id": 16,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
          "code": "MICROWAVE DISTANCE VIKASH",
          "name": "Microwave Distance Vikash",
          "description": "Microwave",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {},
          "legend_configs": {
              "good": {
                  "values": [
                      "SQL: sws.\"{col_name}\" <= 25"
                  ],
                  "labels": "Low"
              },
              "moderate": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > 25 AND sws.\"{col_name}\" <= 75"
                  ],
                  "labels": "Medium"
              },
              "bad": {
                  "values": [
                      "SQL: sws.\"{col_name}\" > 75"
                  ],
                  "labels": "High"
              },
              "unknown": {
                  "values": [],
                  "labels": "Unknown"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "02-05-2024 12:41:32",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "microwave_node_distance",
                  "type": "float",
                  "is_parameter": true,
                  "alias": "Microwave Node Distance",
                  "unit": "km",
                  "display_unit": "km",
                  "count_labels": [
                      "good",
                      "moderate",
                      "bad"
                  ]
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "km",
              "display_unit": "km",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 31,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 23,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 44,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 54,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 12,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
          "code": "JITTER UPLOAD",
          "name": "Jitter Upload",
          "description": "Jitter Upload",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "50",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": [],
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "25-04-2024 11:21:35",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "jitter_upload",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Jitter Upload",
                  "base_benchmark": 1
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "50",
              "benchmark_unit": "ms",
              "base_benchmark": "1",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 11,
          "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
          "code": "ROUNDTRIP TIME",
          "name": "Roundtrip Time",
          "description": "Roundtrip Time",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "50",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": [],
          "status": "PUBLISHED",
          "published_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_at": "18-04-2024 08:17:06",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "roundtrip_time",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Roundtrip Time",
                  "base_benchmark": 1
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "50",
              "benchmark_unit": "ms",
              "base_benchmark": "1",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          },
          "last_modified_by": {
              "id": 42,
              "first_name": "Vikash",
              "last_name": "Admin",
              "username": "vikash.kumar05@nagarro.com",
              "email": "vikash.kumar05@nagarro.com",
              "user_name": "Vikash Admin"
          }
      },
      {
          "id": 9,
          "icon": "",
          "code": "QOS UPLOAD SPEED  L TEST",
          "name": "QoS Upload Speed - L Test",
          "description": "test upload speed layer from qos data",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {
              "value": "20",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": [],
          "status": "PUBLISHED",
          "published_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_at": "17-04-2024 13:33:34",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 5,
                  "name": "QoS",
                  "description": "QoS",
                  "version": "V1.0",
                  "data_source_type": "QOS",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_probe",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Probe",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency_probe",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency Probe",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "connectivity_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed_mean",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed Mean",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "roundtrip_time",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Roundtrip Time",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_download",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Download",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "jitter_upload",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Jitter Upload",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      },
                      {
                          "name": "rtt_packet_loss_pct",
                          "type": "int",
                          "unit": "",
                          "is_parameter": true,
                          "alias": "RTT Packet Loss",
                          "base_benchmark": 1,
                          "display_unit": "%"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "5": {
                  "name": "connectivity_upload_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Upload Speed",
                  "base_benchmark": 1000000
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "20",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          },
          "last_modified_by": {
              "id": 49,
              "first_name": "Luke",
              "last_name": "Stringer",
              "username": "lstringer@unicef.org",
              "email": "lstringer@unicef.org",
              "user_name": "Luke Stringer"
          }
      },
      {
          "id": 7,
          "icon": "",
          "code": "VIPULTESTING2",
          "name": "vipul-testing-2",
          "description": "testing",
          "version": null,
          "type": "STATIC",
          "category": "CONNECTIVITY",
          "applicable_countries": [],
          "global_benchmark": {},
          "legend_configs": {
              "good": {
                  "values": [
                      "5G/4G"
                  ],
                  "labels": "Gibberish"
              },
              "moderate": {
                  "values": [
                      "M"
                  ],
                  "labels": "M"
              },
              "bad": {
                  "values": [
                      "B"
                  ],
                  "labels": "B"
              },
              "unknown": {
                  "values": [],
                  "labels": "U"
              }
          },
          "status": "PUBLISHED",
          "published_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          },
          "last_modified_at": "12-04-2024 13:14:54",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 6,
                  "name": "School Master",
                  "description": "School Master",
                  "version": "V1.0",
                  "data_source_type": "SCHOOL_MASTER",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "coverage_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Coverage Type (coverage_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "connectivity_type",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Connectivity Type (connectivity_type)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "fiber_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Fiber Node Distance (fiber_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "microwave_node_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Microwave Node Distance (microwave_node_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_nr_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest NR Distance (nearest_nr_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_lte_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest LTE Distance (nearest_lte_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_umts_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest UMTS Distance (nearest_umts_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "nearest_gsm_distance",
                          "type": "float",
                          "is_parameter": true,
                          "alias": "Nearest GSM Distance (nearest_gsm_distance)",
                          "unit": "km",
                          "display_unit": "km",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "computer_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Computer Availability (computer_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_computers",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Computers (num_computers)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_girls",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Girl Students (num_students_girls)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_boys",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Boy Students (num_students_boys)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_students_other",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Other Students (num_students_other)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_female",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Female Teachers (num_teachers_female)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_teachers_male",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Male Teachers (num_teachers_male)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "teachers_trained",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Trained Teachers (teachers_trained)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "sustainable_business_model",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Sustainable Business Model (sustainable_business_model)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "device_availability",
                          "type": "boolean",
                          "is_parameter": true,
                          "alias": "Device Availability (device_availability)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate"
                          ]
                      },
                      {
                          "name": "num_tablets",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Tablets (num_tablets)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_robotic_equipment",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Robotic Equipment (num_robotic_equipment)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "building_id_govt",
                          "type": "str",
                          "is_parameter": true,
                          "alias": "Building Govt ID (building_id_govt)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      },
                      {
                          "name": "num_schools_per_building",
                          "type": "int",
                          "is_parameter": true,
                          "alias": "Number of Schools per Building (num_schools_per_building)",
                          "unit": "",
                          "display_unit": "",
                          "count_labels": [
                              "good",
                              "moderate",
                              "bad"
                          ]
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "6": {
                  "name": "connectivity_type",
                  "type": "str",
                  "is_parameter": true,
                  "alias": "Connectivity Type"
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global"
          },
          "active_countries_list": [
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 126,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 137,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 149,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 173,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 184,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 200,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 249,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 144,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          },
          "last_modified_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          }
      },
      {
          "id": 8,
          "icon": "",
          "code": "VIPULTESTING3",
          "name": "vipul-testing-3",
          "description": "testing",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              201
          ],
          "global_benchmark": {
              "value": "60",
              "unit": "ms",
              "convert_unit": "ms"
          },
          "legend_configs": [],
          "status": "PUBLISHED",
          "published_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          },
          "last_modified_at": "12-04-2024 13:11:47",
          "is_reverse": true,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_latency",
                  "type": "int",
                  "unit": "ms",
                  "is_parameter": true,
                  "alias": "Latency",
                  "base_benchmark": 1
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "ms",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "60",
              "benchmark_unit": "ms",
              "base_benchmark": "1",
              "round_unit_value": "{val}"
          },
          "active_countries_list": [
              {
                  "country": 304,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 192,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 194,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 212,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 214,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 216,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 229,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 238,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 276,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 332,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          },
          "last_modified_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          }
      },
      {
          "id": 6,
          "icon": "",
          "code": "VIPUL",
          "name": "vipul",
          "description": "testing",
          "version": null,
          "type": "LIVE",
          "category": "CONNECTIVITY",
          "applicable_countries": [
              201
          ],
          "global_benchmark": {
              "value": "20",
              "unit": "bps",
              "convert_unit": "mbps"
          },
          "legend_configs": [],
          "status": "PUBLISHED",
          "published_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          },
          "last_modified_at": "12-04-2024 12:58:24",
          "is_reverse": false,
          "data_sources_list": [
              {
                  "id": 4,
                  "name": "Daily Check APP and MLab",
                  "description": "Daily Check APP and MLab",
                  "version": "V1.0",
                  "data_source_type": "DAILY_CHECK_APP",
                  "request_config": {},
                  "column_config": [
                      {
                          "name": "connectivity_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Download Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_upload_speed",
                          "type": "int",
                          "unit": "bps",
                          "is_parameter": true,
                          "alias": "Upload Speed",
                          "base_benchmark": 1000000,
                          "display_unit": "Mbps"
                      },
                      {
                          "name": "connectivity_latency",
                          "type": "int",
                          "unit": "ms",
                          "is_parameter": true,
                          "alias": "Latency",
                          "base_benchmark": 1,
                          "display_unit": "ms"
                      }
                  ],
                  "status": "PUBLISHED"
              }
          ],
          "data_source_column": {
              "4": {
                  "name": "connectivity_upload_speed",
                  "type": "int",
                  "unit": "bps",
                  "is_parameter": true,
                  "alias": "Upload Speed",
                  "base_benchmark": 1000000
              }
          },
          "benchmark_metadata": {
              "parameter_column_unit": "bps",
              "display_unit": "",
              "benchmark_name": "Global",
              "benchmark_type": "global",
              "benchmark_value": "20",
              "benchmark_unit": "bps",
              "base_benchmark": "1000000",
              "round_unit_value": "{val} / (1000 * 1000)"
          },
          "active_countries_list": [
              {
                  "country": 304,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 205,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 329,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 5,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 7,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 32,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 45,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 49,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 86,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 134,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 157,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 161,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 174,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 175,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 191,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 258,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 285,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 299,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 331,
                  "is_default": false,
                  "data_sources": {}
              },
              {
                  "country": 201,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 222,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 250,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 29,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 196,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              },
              {
                  "country": 164,
                  "is_default": false,
                  "data_sources": {
                      "name": "",
                      "description": ""
                  }
              }
          ],
          "created_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          },
          "last_modified_by": {
              "id": 51,
              "first_name": "Vipul",
              "last_name": "Bhavsar",
              "username": "vbhavsar@unicef.org",
              "email": "vbhavsar@unicef.org",
              "user_name": "Vipul Bhavsar"
          }
      }
  ]
}