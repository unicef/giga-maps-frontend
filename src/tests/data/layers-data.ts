export default {
  "count": 5,
  "next": "",
  "previous": "",
  "results": [
    {
      "id": 32,
      "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>timer</title><rect x=\"15\" y=\"11\" width=\"2\" height=\"9\"/><rect class=\"cls-1\" x=\"13\" y=\"2\" width=\"6\" height=\"2\"/><path d=\"M28,9,26.58,7.59,24.33,9.84a10.94,10.94,0,1,0,1.18,1.65ZM16,26a9,9,0,1,1,9-9A9,9,0,0,1,16,26Z\"/><rect class=\"cls-2\" width=\"32\" height=\"32\"/></svg>",
      "name": "Latency",
      "description": "Latency",
      "version": null,
      "type": "LIVE",
      "category": "CONNECTIVITY",
      "applicable_countries": [
        144
      ],
      "global_benchmark": {
        "value": "2",
        "unit": "ms",
        "convert_unit": "ms"
      },
      "legend_configs": [],
      "status": "PUBLISHED",
      "published_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      },
      "published_at": "27-02-2024 08:18:41",
      "created": "27-02-2024 08:16:39",
      "last_modified_at": "14-03-2024 16:12:57",
      "is_reverse": true,
      "data_sources_list": [
        {
          "id": 11,
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
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_upload_speed",
              "type": "int",
              "unit": "bps",
              "is_parameter": true,
              "alias": "Upload Speed",
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_latency",
              "type": "int",
              "unit": "ms",
              "is_parameter": true,
              "alias": "Latency",
              "base_benchmark": 1
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        },
        {
          "id": 12,
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
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_upload_speed",
              "type": "int",
              "unit": "bps",
              "is_parameter": true,
              "alias": "Upload Speed",
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_latency",
              "type": "int",
              "unit": "ms",
              "is_parameter": true,
              "alias": "Latency",
              "base_benchmark": 1
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        }
      ],
      "data_source_column": {
        "11": {
          "name": "connectivity_latency",
          "type": "int",
          "unit": "ms",
          "is_parameter": true,
          "alias": "Latency",
          "base_benchmark": 1
        },
        "12": {
          "name": "connectivity_latency",
          "type": "int",
          "unit": "ms",
          "is_parameter": true,
          "alias": "Latency",
          "base_benchmark": 1
        }
      },
      "benchmark_metadata": {
        "benchmark_value": "2",
        "benchmark_unit": "ms",
        "base_benchmark": "1",
        "parameter_column_unit": "ms",
        "round_unit_value": "{val}"
      },
      "created_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      },
      "last_modified_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      }
    },
    {
      "id": 33,
      "icon": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n\n      .cls-1, .cls-2 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <polygon class=\"cls-2\" points=\"17 11 20 11 20 21 17 21 17 23 25 23 25 21 22 21 22 11 25 11 25 9 17 9 17 11\"/>\n  <path class=\"cls-2\" d=\"m13,9h-4c-1.103,0-2,.897-2,2v12h2v-5h4v5h2v-12c0-1.103-.897-2-2-2Zm-4,7v-5h4v5h-4Z\"/>\n  <rect id=\"_Transparent_Rectangle_\" data-name=\"&amp;lt;Transparent Rectangle&amp;gt;\" class=\"cls-1\" width=\"32\" height=\"32\"/>\n</svg>",
      "name": "Fiber Data",
      "description": "Fiber details",
      "version": null,
      "type": "STATIC",
      "category": "CONNECTIVITY",
      "applicable_countries": [
        144,
        297
      ],
      "global_benchmark": {},
      "legend_configs": {
        "good": {
          "values": [
            "5G"
          ],
          "labels": "High"
        },
        "moderate": {
          "values": [
            "4G",
            "3G"
          ],
          "labels": "Medium"
        },
        "bad": {
          "values": [
            "2G",
            "No"
          ],
          "labels": "Low"
        },
        "unknown": {
          "values": [],
          "labels": "No Data"
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      },
      "published_at": "27-02-2024 08:18:38",
      "created": "27-02-2024 08:18:04",
      "last_modified_at": "13-03-2024 07:32:09",
      "is_reverse": false,
      "data_sources_list": [
        {
          "id": 13,
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
              "alias": "Coverage Type"
            },
            {
              "name": "connectivity_type",
              "type": "str",
              "is_parameter": true,
              "alias": "Connectivity Type"
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        }
      ],
      "data_source_column": {
        "13": {
          "name": "coverage_type",
          "type": "str",
          "is_parameter": true,
          "alias": "Coverage Type"
        }
      },
      "benchmark_metadata": {},
      "created_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      },
      "last_modified_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      }
    },
    {
      "id": 34,
      "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: none;\n      }\n    </style>\n  </defs>\n  <path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/>\n  <polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/>\n  <g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\">\n    <rect class=\"cls-1\" width=\"32\" height=\"32\"/>\n  </g>\n</svg>",
      "name": "Download Test",
      "description": "Download",
      "version": null,
      "type": "LIVE",
      "category": "CONNECTIVITY",
      "applicable_countries": [],
      "global_benchmark": {
        "value": "20000000",
        "unit": "bps",
        "convert_unit": "mbps"
      },
      "legend_configs": [],
      "status": "PUBLISHED",
      "published_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      },
      "published_at": "01-03-2024 04:30:33",
      "created": "01-03-2024 04:30:23",
      "last_modified_at": "01-03-2024 04:30:33",
      "is_reverse": false,
      "data_sources_list": [
        {
          "id": 11,
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
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_upload_speed",
              "type": "int",
              "unit": "bps",
              "is_parameter": true,
              "alias": "Upload Speed",
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_latency",
              "type": "int",
              "unit": "ms",
              "is_parameter": true,
              "alias": "Latency",
              "base_benchmark": 1
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        },
        {
          "id": 12,
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
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_upload_speed",
              "type": "int",
              "unit": "bps",
              "is_parameter": true,
              "alias": "Upload Speed",
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_latency",
              "type": "int",
              "unit": "ms",
              "is_parameter": true,
              "alias": "Latency",
              "base_benchmark": 1
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        }
      ],
      "data_source_column": {
        "11": {
          "name": "connectivity_speed",
          "type": "int",
          "unit": "bps",
          "is_parameter": true,
          "alias": "Download Speed",
          "base_benchmark": 1000000
        },
        "12": {
          "name": "connectivity_speed",
          "type": "int",
          "unit": "bps",
          "is_parameter": true,
          "alias": "Download Speed",
          "base_benchmark": 1000000
        }
      },
      "benchmark_metadata": {
        "benchmark_value": "20000000",
        "benchmark_unit": "bps",
        "base_benchmark": "1000000",
        "parameter_column_unit": "bps",
        "round_unit_value": "{val} / (1000 * 1000)"
      },
      "created_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      },
      "last_modified_by": {
        "id": 47,
        "first_name": "Nitesh",
        "last_name": "B",
        "username": "aditya.acharya@nagarro.com",
        "email": "aditya.acharya@nagarro.com",
        "user_name": "Nitesh B"
      }
    },
    {
      "id": 31,
      "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><defs><style>.cls-1 {fill: none;}</style></defs><path d=\"M10.57,30l.9333-2h8.9928l.9333,2h2.2072L17,15.7778V11H15v4.7778L8.3631,30ZM16,18.3647,17.6965,22h-3.393ZM13.37,24h5.26l.9333,2H12.4369Z\" transform=\"translate(0 0)\"/><path d=\"M10.7832,9.3325a7.0007,7.0007,0,0,1,10.4341,0l-1.49,1.334a5,5,0,0,0-7.4537,0Z\" transform=\"translate(0 0)\"/><path d=\"M7.1992,6.3994a11.0019,11.0019,0,0,1,17.6006,0L23.2,7.6a9.0009,9.0009,0,0,0-14.4014,0Z\" transform=\"translate(0 0)\"/><rect id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\" class=\"cls-1\" width=\"32\" height=\"32\"/></svg>",
      "name": "Coverage data",
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
          "labels": "5G/4G"
        },
        "moderate": {
          "values": [
            "3G",
            "2G"
          ],
          "labels": "3G/2G"
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
      "published_at": null,
      "created": "27-02-2024 08:10:14",
      "last_modified_at": "27-02-2024 08:10:14",
      "is_reverse": false,
      "data_sources_list": [
        {
          "id": 13,
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
              "alias": "Coverage Type"
            },
            {
              "name": "connectivity_type",
              "type": "str",
              "is_parameter": true,
              "alias": "Connectivity Type"
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        }
      ],
      "data_source_column": {
        "13": {
          "name": "coverage_type",
          "type": "str",
          "is_parameter": true,
          "alias": "Coverage Type"
        }
      },
      "benchmark_metadata": {},
      "created_by": null,
      "last_modified_by": null
    },
    {
      "id": 30,
      "icon": "<svg id=\"icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><defs><style>.cls-1 {fill: none;}</style></defs><path d=\"M26,24v4H6V24H4v4H4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2h0V24Z\"/><polygon points=\"26 14 24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14\"/><g id=\"_Transparent_Rectangle_\" data-name=\"&lt;Transparent Rectangle&gt;\"><rect class=\"cls-1\" width=\"32\" height=\"32\"/></g></svg>",
      "name": "Download",
      "description": "System Download Layer",
      "version": "V 1.0",
      "type": "LIVE",
      "category": "CONNECTIVITY",
      "applicable_countries": [],
      "global_benchmark": {
        "value": "20000000",
        "unit": "bps",
        "convert_unit": "mbps"
      },
      "legend_configs": [],
      "status": "PUBLISHED",
      "published_by": null,
      "published_at": null,
      "created": "27-02-2024 08:10:14",
      "last_modified_at": "27-02-2024 08:10:14",
      "is_reverse": false,
      "data_sources_list": [
        {
          "id": 11,
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
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_upload_speed",
              "type": "int",
              "unit": "bps",
              "is_parameter": true,
              "alias": "Upload Speed",
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_latency",
              "type": "int",
              "unit": "ms",
              "is_parameter": true,
              "alias": "Latency",
              "base_benchmark": 1
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        },
        {
          "id": 12,
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
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_upload_speed",
              "type": "int",
              "unit": "bps",
              "is_parameter": true,
              "alias": "Upload Speed",
              "base_benchmark": 1000000
            },
            {
              "name": "connectivity_latency",
              "type": "int",
              "unit": "ms",
              "is_parameter": true,
              "alias": "Latency",
              "base_benchmark": 1
            }
          ],
          "status": "PUBLISHED",
          "published_by": null,
          "published_at": null,
          "last_modified_at": "27-02-2024 08:10:14",
          "last_modified_by": null,
          "created": "27-02-2024 08:10:14",
          "created_by": null
        }
      ],
      "data_source_column": {
        "11": {
          "name": "connectivity_speed",
          "type": "int",
          "unit": "bps",
          "is_parameter": true,
          "alias": "Download Speed",
          "base_benchmark": 1000000
        },
        "12": {
          "name": "connectivity_speed",
          "type": "int",
          "unit": "bps",
          "is_parameter": true,
          "alias": "Download Speed",
          "base_benchmark": 1000000
        }
      },
      "benchmark_metadata": {
        "benchmark_value": "20000000",
        "benchmark_unit": "bps",
        "base_benchmark": "1000000",
        "parameter_column_unit": "bps",
        "round_unit_value": "{val} / (1000 * 1000)"
      },
      "created_by": null,
      "last_modified_by": null
    }
  ]
}