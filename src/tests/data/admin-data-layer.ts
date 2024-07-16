export const dataLayerlistMock = [
  {
    "id": 8,
    "icon": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 28.01\">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 1.6px;\n      }\n\n      .cls-1, .cls-2 {\n        fill: none;\n        stroke: #000;\n        stroke-miterlimit: 10;\n      }\n\n      .cls-2 {\n        stroke-width: 2px;\n      }\n\n      .cls-3 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id=\"icons\">\n    <g id=\"Workspace\">\n      <g>\n        <path class=\"cls-3\" d=\"M16.61,6.82c-.36-.29-.88-.29-1.24,0L0,16.01l1,1.57,1-.57v9c0,1.1.9,2,2,2h24c1.1,0,2-.9,2-2v-9l.98.56,1.02-1.56-15.39-9.2ZM4,26.01v-9.94l12-7.2,12,7.21v9.93H4Z\"/>\n        <rect class=\"cls-1\" x=\"15.81\" y=\".8\" width=\"6\" height=\"3.82\"/>\n        <path class=\"cls-2\" d=\"M13,26.88v-6.95c0-.55.45-1,1-1h4c.55,0,1,.45,1,1v6.95\"/>\n        <rect class=\"cls-3\" x=\"6\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"22.06\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"15.01\" y=\"3.98\" width=\"2\" height=\"4.01\"/>\n      </g>\n    </g>\n  </g>\n</svg>",
    "name": "School",
    "description": "School",
    "version": null,
    "type": "LIVE",
    "category": "CONNECTIVITY",
    "applicable_countries": [
      24,
      223,
      144
    ],
    "global_benchmark": {
      "value": "200",
      "unit": "bps",
      "convert_unit": "ms"
    },
    "legend_configs": [],
    "status": "PUBLISHED",
    "published_by": {
      "id": 46,
      "first_name": "Test",
      "last_name": "Admin",
      "username": "test.user.com",
      "email": "test.user.com",
      "user_name": "Test Admin"
    },
    "published_at": "28-02-2024 19:35:40",
    "created": "28-02-2024 19:23:01",
    "last_modified_at": "28-02-2024 19:35:40",
    "is_reverse": false,
    "data_sources_list": [
      {
        "id": 5,
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
        "last_modified_at": "28-02-2024 08:22:07",
        "last_modified_by": null,
        "created": "28-02-2024 08:22:07",
        "created_by": null
      },
      {
        "id": 6,
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
        "last_modified_at": "28-02-2024 08:22:07",
        "last_modified_by": null,
        "created": "28-02-2024 08:22:07",
        "created_by": null
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
      },
      "6": {
        "name": "connectivity_upload_speed",
        "type": "int",
        "unit": "bps",
        "is_parameter": true,
        "alias": "Upload Speed",
        "base_benchmark": 1000000
      }
    },
    "benchmark_metadata": {
      "benchmark_value": "200",
      "benchmark_unit": "bps",
      "base_benchmark": "1000000",
      "parameter_column_unit": "bps",
      "round_unit_value": "{val}"
    },
    "created_by": {
      "id": 46,
      "first_name": "Test",
      "last_name": "Admin",
      "username": "test.user.com",
      "email": "test.user.com",
      "user_name": "Test Admin"
    },
    "last_modified_by": {
      "id": 46,
      "first_name": "Test",
      "last_name": "Admin",
      "username": "test.user.com",
      "email": "test.user.com",
      "user_name": "Test Admin"
    }
  },
  {
    "id": 5,
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
    "created": "28-02-2024 08:22:07",
    "last_modified_at": "28-02-2024 08:22:07",
    "is_reverse": false,
    "data_sources_list": [
      {
        "id": 5,
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
        "last_modified_at": "28-02-2024 08:22:07",
        "last_modified_by": null,
        "created": "28-02-2024 08:22:07",
        "created_by": null
      },
      {
        "id": 6,
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
        "last_modified_at": "28-02-2024 08:22:07",
        "last_modified_by": null,
        "created": "28-02-2024 08:22:07",
        "created_by": null
      }
    ],
    "data_source_column": {
      "5": {
        "name": "connectivity_speed",
        "type": "int",
        "unit": "bps",
        "is_parameter": true,
        "alias": "Download Speed",
        "base_benchmark": 1000000
      },
      "6": {
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

export const singleLayerMock = {
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 8,
      "icon": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 28.01\">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 1.6px;\n      }\n\n      .cls-1, .cls-2 {\n        fill: none;\n        stroke: #000;\n        stroke-miterlimit: 10;\n      }\n\n      .cls-2 {\n        stroke-width: 2px;\n      }\n\n      .cls-3 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id=\"icons\">\n    <g id=\"Workspace\">\n      <g>\n        <path class=\"cls-3\" d=\"M16.61,6.82c-.36-.29-.88-.29-1.24,0L0,16.01l1,1.57,1-.57v9c0,1.1.9,2,2,2h24c1.1,0,2-.9,2-2v-9l.98.56,1.02-1.56-15.39-9.2ZM4,26.01v-9.94l12-7.2,12,7.21v9.93H4Z\"/>\n        <rect class=\"cls-1\" x=\"15.81\" y=\".8\" width=\"6\" height=\"3.82\"/>\n        <path class=\"cls-2\" d=\"M13,26.88v-6.95c0-.55.45-1,1-1h4c.55,0,1,.45,1,1v6.95\"/>\n        <rect class=\"cls-3\" x=\"6\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"22.06\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"15.01\" y=\"3.98\" width=\"2\" height=\"4.01\"/>\n      </g>\n    </g>\n  </g>\n</svg>",
      "name": "School",
      "description": "School",
      "version": null,
      "type": "LIVE",
      "category": "CONNECTIVITY",
      "applicable_countries": [
        24,
        223,
        144
      ],
      "global_benchmark": {
        "value": "200",
        "unit": "bps",
        "convert_unit": "ms"
      },
      "legend_configs": [],
      "status": "PUBLISHED",
      "published_by": {
        "id": 46,
        "first_name": "Test",
        "last_name": "Admin",
        "username": "test.user@test.com",
        "email": "test.user@test.com",
        "user_name": "Test Admin"
      },
      "published_at": "28-02-2024 19:35:40",
      "created": "28-02-2024 19:23:01",
      "last_modified_at": "28-02-2024 19:35:40",
      "is_reverse": false,
      "data_sources_list": [
        {
          "id": 5,
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
          "last_modified_at": "28-02-2024 08:22:07",
          "last_modified_by": null,
          "created": "28-02-2024 08:22:07",
          "created_by": null
        },
        {
          "id": 6,
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
          "last_modified_at": "28-02-2024 08:22:07",
          "last_modified_by": null,
          "created": "28-02-2024 08:22:07",
          "created_by": null
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
        },
        "6": {
          "name": "connectivity_upload_speed",
          "type": "int",
          "unit": "bps",
          "is_parameter": true,
          "alias": "Upload Speed",
          "base_benchmark": 1000000
        }
      },
      "benchmark_metadata": {
        "benchmark_value": "200",
        "benchmark_unit": "bps",
        "base_benchmark": "1000000",
        "parameter_column_unit": "bps",
        "round_unit_value": "{val}"
      },
      "created_by": {
        "id": 46,
        "first_name": "Test",
        "last_name": "Admin",
        "username": "test.user@test.com",
        "email": "test.user@test.com",
        "user_name": "Test Admin"
      },
      "last_modified_by": {
        "id": 46,
        "first_name": "Test",
        "last_name": "Admin",
        "username": "test.user@test.com",
        "email": "test.user@test.com",
        "user_name": "Test Admin"
      }
    }
  ]
}

export const currentLayerMockWithDraftStaus =
{
  "id": 8,
  "icon": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 28.01\">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 1.6px;\n      }\n\n      .cls-1, .cls-2 {\n        fill: none;\n        stroke: #000;\n        stroke-miterlimit: 10;\n      }\n\n      .cls-2 {\n        stroke-width: 2px;\n      }\n\n      .cls-3 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id=\"icons\">\n    <g id=\"Workspace\">\n      <g>\n        <path class=\"cls-3\" d=\"M16.61,6.82c-.36-.29-.88-.29-1.24,0L0,16.01l1,1.57,1-.57v9c0,1.1.9,2,2,2h24c1.1,0,2-.9,2-2v-9l.98.56,1.02-1.56-15.39-9.2ZM4,26.01v-9.94l12-7.2,12,7.21v9.93H4Z\"/>\n        <rect class=\"cls-1\" x=\"15.81\" y=\".8\" width=\"6\" height=\"3.82\"/>\n        <path class=\"cls-2\" d=\"M13,26.88v-6.95c0-.55.45-1,1-1h4c.55,0,1,.45,1,1v6.95\"/>\n        <rect class=\"cls-3\" x=\"6\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"22.06\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"15.01\" y=\"3.98\" width=\"2\" height=\"4.01\"/>\n      </g>\n    </g>\n  </g>\n</svg>",
  "name": "School",
  "description": "School",
  "version": null,
  "type": "LIVE",
  "category": "CONNECTIVITY",
  "applicable_countries": [
    24,
    223,
    144
  ],
  "global_benchmark": {
    "value": "200",
    "unit": "bps",
    "convert_unit": "ms"
  },
  "legend_configs": [],
  "status": "DRAFT",
  "published_by": {
    "id": 46,
    "first_name": "Test",
    "last_name": "Admin",
    "username": "test.@test.com",
    "email": "test.@test.com",
    "user_name": "Test Admin"
  },
  "published_at": "28-02-2024 19:35:40",
  "created": "28-02-2024 19:23:01",
  "last_modified_at": "28-02-2024 19:35:40",
  "is_reverse": false,
  "data_sources_list": [
    {
      "id": 5,
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
      "last_modified_at": "28-02-2024 08:22:07",
      "last_modified_by": null,
      "created": "28-02-2024 08:22:07",
      "created_by": null
    },
    {
      "id": 6,
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
      "last_modified_at": "28-02-2024 08:22:07",
      "last_modified_by": null,
      "created": "28-02-2024 08:22:07",
      "created_by": null
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
    },
    "6": {
      "name": "connectivity_upload_speed",
      "type": "int",
      "unit": "bps",
      "is_parameter": true,
      "alias": "Upload Speed",
      "base_benchmark": 1000000
    }
  },
  "benchmark_metadata": {
    "benchmark_value": "200",
    "benchmark_unit": "bps",
    "base_benchmark": "1000000",
    "parameter_column_unit": "bps",
    "round_unit_value": "{val}"
  },
  "created_by": {
    "id": 46,
    "first_name": "Test",
    "last_name": "Admin",
    "username": "test.user@test.com",
    "email": "test.@test.com",
    "user_name": "Test Admin"
  },
  "last_modified_by": {
    "id": 46,
    "first_name": "Test",
    "last_name": "Admin",
    "username": "test.user@test.com",
    "email": "test.user@test.com",
    "user_name": "Test Admin"
  }
}
export const currentLayerMockWithReadyToPublishStaus =
{
  "id": 8,
  "icon": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 28.01\">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 1.6px;\n      }\n\n      .cls-1, .cls-2 {\n        fill: none;\n        stroke: #000;\n        stroke-miterlimit: 10;\n      }\n\n      .cls-2 {\n        stroke-width: 2px;\n      }\n\n      .cls-3 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id=\"icons\">\n    <g id=\"Workspace\">\n      <g>\n        <path class=\"cls-3\" d=\"M16.61,6.82c-.36-.29-.88-.29-1.24,0L0,16.01l1,1.57,1-.57v9c0,1.1.9,2,2,2h24c1.1,0,2-.9,2-2v-9l.98.56,1.02-1.56-15.39-9.2ZM4,26.01v-9.94l12-7.2,12,7.21v9.93H4Z\"/>\n        <rect class=\"cls-1\" x=\"15.81\" y=\".8\" width=\"6\" height=\"3.82\"/>\n        <path class=\"cls-2\" d=\"M13,26.88v-6.95c0-.55.45-1,1-1h4c.55,0,1,.45,1,1v6.95\"/>\n        <rect class=\"cls-3\" x=\"6\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"22.06\" y=\"18.01\" width=\"4\" height=\"4\"/>\n        <rect class=\"cls-3\" x=\"15.01\" y=\"3.98\" width=\"2\" height=\"4.01\"/>\n      </g>\n    </g>\n  </g>\n</svg>",
  "name": "School",
  "description": "School",
  "version": null,
  "type": "STATIC",
  "category": "CONNECTIVITY",
  "applicable_countries": [
    24,
    223,
    144
  ],
  "global_benchmark": {
    "value": "200",
    "unit": "bps",
    "convert_unit": "ms"
  },
  "legend_configs": [],
  "status": "READY_TO_PUBLISH",
  "published_by": {
    "id": 46,
    "first_name": "Test",
    "last_name": "Admin",
    "username": "test.@test.com",
    "email": "test.@test.com",
    "user_name": "Test Admin"
  },
  "published_at": "28-02-2024 19:35:40",
  "created": "28-02-2024 19:23:01",
  "last_modified_at": "28-02-2024 19:35:40",
  "is_reverse": false,
  "data_sources_list": [
    {
      "id": 5,
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
      "last_modified_at": "28-02-2024 08:22:07",
      "last_modified_by": null,
      "created": "28-02-2024 08:22:07",
      "created_by": null
    },
    {
      "id": 6,
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
      "last_modified_at": "28-02-2024 08:22:07",
      "last_modified_by": null,
      "created": "28-02-2024 08:22:07",
      "created_by": null
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
    },
    "6": {
      "name": "connectivity_upload_speed",
      "type": "int",
      "unit": "bps",
      "is_parameter": true,
      "alias": "Upload Speed",
      "base_benchmark": 1000000
    }
  },
  "benchmark_metadata": {
    "benchmark_value": "200",
    "benchmark_unit": "bps",
    "base_benchmark": "1000000",
    "parameter_column_unit": "bps",
    "round_unit_value": "{val}"
  },
  "created_by": {
    "id": 46,
    "first_name": "Test",
    "last_name": "Admin",
    "username": "test.user@test.com",
    "email": "test.@test.com",
    "user_name": "Test Admin"
  },
  "last_modified_by": {
    "id": 46,
    "first_name": "Test",
    "last_name": "Admin",
    "username": "test.user@test.com",
    "email": "test.user@test.com",
    "user_name": "Test Admin"
  }
}